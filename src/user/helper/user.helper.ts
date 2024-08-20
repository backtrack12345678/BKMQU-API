import { RegisterDto } from './../dto/register.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { OtpService } from '../../otp/otp.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { getHost } from '../../common/utils/utils';
import { UserBankResponse, UserResponse, UserResult } from '../dto/response.dto';

@Injectable()
export class UserHelper {
  constructor(
    private prismaService: PrismaService,
    private otpService: OtpService,
  ) { }

  async verifyEmailUser(email: string) {
    const countEmail: number = await this.prismaService.user.count({
      where: {
        email: email,
      },
    });

    if (countEmail !== 0) {
      throw new BadRequestException('Email Sudah Digunakan');
    }
  }

  async verifyNoRegisterMesjid(noRegister: string) {
    const countNoRegister: number = await this.prismaService.mesjid.count({
      where: {
        noRegister: noRegister,
      },
    });

    if (countNoRegister !== 0) {
      throw new BadRequestException('Mesjid Sudah Terdaftar');
    }
  }

  async verifyRegisteredMesjid(mesjidId: number): Promise<void> {
    const mesjid = await this.prismaService.mesjid.findUnique({
      where: {
        id: mesjidId,
      },
      select: {
        id: true,
      },
    });

    if (!mesjid) {
      throw new NotFoundException('Mesjid Tidak Terdaftar');
    }
  }

  async getWilayah(kecamatanId: number): Promise<{ [key: string]: number }> {
    const wilayah = await this.prismaService.kecamatan.findUnique({
      where: {
        id: kecamatanId,
      },
      select: {
        id: true,
        kota_kab: { select: { id: true } },
        provinsi: { select: { id: true } },
      },
    });

    if (!wilayah) {
      throw new NotFoundException('Wilayah Tidak Ditemukan');
    }

    return {
      kotaKabId: wilayah.kota_kab.id,
      provinsiId: wilayah.provinsi.id,
    };
  }

  async registerHelper(payload) {
    const OTP = {
      type: 'register',
      number: payload.otp,
    };
    await this.otpService.verifyOTP(OTP, payload.phone);
    await this.verifyEmailUser(payload.email);
  }

  async dataRegister(payload: RegisterDto, role: string, wilayah) {
    return {
      id: `${role}-${uuid().toString()}`,
      phone: payload.phone,
      email: payload.email,
      password: await bcrypt.hash(payload.password, 10),
      isVerified: ['jamaah', 'penceramah'].includes(role),
      acceptTerm: payload.acceptTerm,
      role: role,
      detailUser: {
        create: {
          nama: payload.nama,
          status: ['jamaah', 'penceramah'].includes(role)
            ? 'DITERIMA'
            : 'DIPENDING',
          kecamatanId: payload.kecamatanId,
          kotaKabId: wilayah.kotaKabId,
          provinsiId: wilayah.provinsiId,
        },
      },
      photo: {
        create: {
          path: './uploads/users/default_user.jpg',
        },
      },
      sampul: {
        create: {
          path: './uploads/users/default_sampul.jpg',
        },
      },
    };
  }

  async getUserRole(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna Tidak Ditemukan');
    }

    return user.role;
  }

  async deleteOtp(phone: string) {
    await this.prismaService.otp.delete({
      where: {
        phone: phone,
        type: 'register',
      },
    });
  }

  userSelectCondition(role: string) {
    const roleSelectCondition = {
      mesjid: {
        noRegister: true,
        imam: true,
        _count: { select: { jamaah: true } },
      },
      pengurus: { jabatan: true, uraianJabatan: true },
      penceramah: { keahlian: true },
      jamaah: { mesjid: { select: { id: true, userId: true } } },
    };

    return {
      id: true,
      phone: true,
      email: true,
      photo: { select: { nama: true } },
      sampul: { select: { nama: true } },
      role: true,
      detailUser: {
        select: {
          nama: true,
          alamat: true,
          kota_kab: { select: { nama: true } },
          kecamatan: { select: { nama: true } },
          saldo: true,
        },
      },
      ...(roleSelectCondition[role] && {
        [role]: { select: { id: true, ...roleSelectCondition[role] } },
      }),
    };
  }

  toUserResponse(user: UserResult, request: any, type: string): UserResponse {
    const toRoleResponse = {
      mesjid: {
        noRegister: user.mesjid?.noRegister,
        imam: user.mesjid?.imam,
        jamaah: user.mesjid?._count?.jamaah,
      },
      pengurus: {
        jabatan: user.pengurus?.jabatan,
        uraianJabatan: user.pengurus?.uraianJabatan,
      },
      penceramah: {
        keahlian: user.penceramah?.keahlian,
      },
      jamaah: {
        mesjidId: user.jamaah?.mesjid?.id,
        mesjidUserId: user.jamaah?.mesjid?.userId,
      },
    };

    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      nama: user.detailUser.nama,
      kota_kab: user.detailUser.kota_kab.nama,
      kecamatan: user.detailUser.kecamatan.nama,
      alamat: user.detailUser.alamat,
      saldo:
        type === 'private' || user.role === 'mesjid'
          ? parseInt(String(user.detailUser.saldo))
          : undefined,
      photo: `${getHost(request)}/api/files/users/${user.photo.nama}`,
      sampul: `${getHost(request)}/api/files/users/${user.sampul.nama}`,
      ...(toRoleResponse[user.role] && {
        [user.role]: {
          id: user[user.role].id,
          ...toRoleResponse[user.role],
        },
      }),
    };
  }

  async getUserImage(
    userId: string,
    type: string,
  ): Promise<{
    path: string;
    nama: string;
  } | null> {
    const whereConditions = { userId: userId };
    const selectConditions = { path: true, nama: true };

    if (type === 'photo') {
      return await this.prismaService[`photo_User`].findUnique({
        where: whereConditions,
        select: selectConditions,
      });
    }

    if (type === 'sampul') {
      return this.prismaService[`sampul_User`].findUnique({
        where: whereConditions,
        select: selectConditions,
      });
    }
  }

  userbankSelectCondition() {
    return {
      id: true,
      nama: true,
      noRekening: true,
      status: true,
      createdAt: true,
      bank: {
        select: {
          nama: true,
        }
      }
    }
  }

  toUserBankResponse(userbank): UserBankResponse {
    return {
      id: userbank.id,
      nama: userbank.nama,
      namaBank: userbank.bank.nama,
      noRekening: userbank.noRekening,
      status: userbank.status,
      createdAt: userbank.createdAt,
    }
  }

  async checkBank(bankId: number) {
    const bank = await this.prismaService.bank.count({
      where: { id: bankId }
    });
    if (bank < 1) {
      throw new NotFoundException("Bank Tidak Ditemukan");
    }
  }

  async checkUserBankOwner(userId: string, userBankId: number) {
    const userBank = await this.prismaService.user_Bank.findUnique({
      where: {
        id: userBankId,
      },
      select: {
        userId: true,
      }
    });

    if (!userBank) {
      throw new NotFoundException("Akun Bank Tidak Ditemukan");
    };

    if (userBank.userId !== userId) {
      throw new HttpException("Akun Bank Ini Bukan Milik Anda", 403);
    };
  }

  async checkUserBank(userId: string, noRekening: string) {
    const userBank = await this.prismaService.user_Bank.findUnique({
      where: { userId: userId },
      select: { noRekening: true }
    });

    if (userBank) {
      throw new BadRequestException("Anda Sudah Memiliki Akun Bank");
    };

    if (userBank?.noRekening == noRekening) {
      throw new BadRequestException("Nomor Rekening Sudah Digunakan");
    };
  }
}

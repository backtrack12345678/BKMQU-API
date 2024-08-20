import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../common/prisma.service';
import { getHost } from '../common/utils/utils';
import { GetMesjidResponse, GetUserBankResponse } from './dto/response.dto';
import { MesjidQueryDto, UserBankQueryDto } from './dto/get.dto';
import { UpdateMesjidStatusParamDto } from './dto/update-admin.dto';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { AdminHelper } from './helper/admin.helper';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private midtansService: MidtransService,
    private adminHelper: AdminHelper,
  ) { }

  async findAllMesjid(
    request: Request,
    query?: MesjidQueryDto,
  ): Promise<GetMesjidResponse[] | []> {
    const filters = query.status ? [{ status: query.status }] : [];
    const mesjid = await this.prismaService.detail_User.findMany({
      where: {
        user: {
          role: 'mesjid',
        },
        AND: filters,
      },
      select: {
        userId: true,
        nama: true,
        status: true,
        kecamatan: {
          select: {
            nama: true,
          },
        },
        user: {
          select: {
            phone: true,
            email: true,
            mesjid: {
              select: {
                noRegister: true,
              },
            },
            dokumenBukti: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });

    return mesjid.map((m) => ({
      id: m.userId,
      phone: m.user.phone,
      email: m.user.email,
      noRegister: m.user.mesjid.noRegister,
      nama: m.nama,
      status: m.status,
      kecamatan: m.kecamatan.nama,
      SKM: `${getHost(request)}/api/files/bukti/mesjid/${m.user.dokumenBukti.nama}`,
    }));
  }

  async updateMesjidStatus(param: UpdateMesjidStatusParamDto): Promise<void> {
    const mesjid: { id: number } = await this.prismaService.detail_User.update({
      where: {
        userId: param.mesjidUserId,
      },
      data: {
        status: param.status,
        user: {
          update: {
            isVerified: param.status === 'DITERIMA',
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!mesjid) {
      throw new HttpException('Gagal Memverifikasi Mesjid', 500);
    }
  }

  async findAllUserBank(query: UserBankQueryDto): Promise<GetUserBankResponse[] | []> {
    const userBank = await this.prismaService.user_Bank.findMany({
      where: {
        status: query?.status || undefined,
      },
      select: this.adminHelper.userbankSelectCondition(),
      orderBy: {
        createdAt: 'asc',
      }
    });
    return userBank.map((userBank) => this.adminHelper.toUserBankResponse(userBank));
  }

  async updateUserBankStatus(userBankId: number): Promise<void> {
    try {
      const bankAccount = await this.adminHelper.getBankAccountData(userBankId);
      const verifiedData = await this.midtansService.verifyBankAccount(bankAccount.kode, bankAccount.noRekening);
      await this.adminHelper.updateUserBankData(userBankId, verifiedData)
    } catch (e) {
      if (e.message === 'Gagal Memverifikasi Akun Bank, Akun Bank Tidak Terdaftar') {
        await this.adminHelper.updateUserBankData(userBankId)
      }
      throw new HttpException(e.message, e.status);
    }
  }
}

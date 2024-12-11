import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../common/prisma.service';
import { getHost } from '../common/utils/utils';
import {
  GetMesjidResponse,
  GetUserBankResponse,
  GetUserDeactivationResponse,
} from './dto/response.dto';
import {
  MesjidQueryDto,
  UserBankQueryDto,
  UserDeactivationQueryDto,
  UserWithdrawQueryDto,
} from './dto/get.dto';
import {
  UpdateMesjidStatusParamDto,
  WithdrawParamDto,
} from './dto/update-admin.dto';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { AdminHelper } from './helper/admin.helper';
import { WithdrawService } from 'src/withdraw/withdraw.service';
import { WithdrawResponse } from 'src/withdraw/dto/response.dto';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private midtansService: MidtransService,
    private adminHelper: AdminHelper,
    private withdrawService: WithdrawService,
  ) {}

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

    console.log(mesjid);

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

  async findAllUserBank(
    query: UserBankQueryDto,
  ): Promise<GetUserBankResponse[] | []> {
    const userBank = await this.prismaService.user_Bank.findMany({
      where: {
        status: query?.status || undefined,
      },
      select: this.adminHelper.userbankSelectCondition(),
      orderBy: {
        createdAt: 'asc',
      },
    });
    return userBank.map((userBank) =>
      this.adminHelper.toUserBankResponse(userBank),
    );
  }

  async findAllUserDeactivation(
    query: UserDeactivationQueryDto,
  ): Promise<GetUserDeactivationResponse[]> {
    const userDeactivation =
      await this.prismaService.user_Deactivation.findMany({
        where: {
          ...(query.acceptTerm && {
            acceptTerm: query.acceptTerm,
          }),
        },
      });
    return userDeactivation;
  }

  async acceptUserDeactivation(userId: string) {
    await this.prismaService.user_Deactivation.update({
      where: {
        userId: userId,
      },
      data: {
        user: {
          update: {
            acceptTerm: false,
            isVerified: false,
            detailUser: {
              update: {
                status: 'DITOLAK',
              },
            },
          },
        },
        acceptTerm: true,
      },
      select: {
        id: true,
      },
    });
  }

  async findAllUserWithdraw(
    query: UserWithdrawQueryDto,
  ): Promise<WithdrawResponse[]> {
    return await this.withdrawService.findWithdrawByQuery(query);
  }

  async acceptUserWithdraw(param: WithdrawParamDto) {
    await this.withdrawService.acceptWithdraw(param.withdrawId, param.status);
  }

  async updateUserBankStatus(userBankId: number): Promise<void> {
    try {
      const bankAccount = await this.adminHelper.getBankAccountData(userBankId);
      const verifiedData = await this.midtansService.verifyBankAccount(
        bankAccount.kode,
        bankAccount.noRekening,
      );
      await this.adminHelper.updateUserBankData(userBankId, verifiedData);
    } catch (e) {
      if (
        e.message === 'Gagal Memverifikasi Akun Bank, Akun Bank Tidak Terdaftar'
      ) {
        await this.adminHelper.updateUserBankData(userBankId);
      }
      throw new HttpException(e.message, e.status);
    }
  }
}

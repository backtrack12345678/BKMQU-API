import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { GetUserBankResponse } from '../dto/response.dto';

@Injectable()
export class AdminHelper {
  constructor(
    private prismaService: PrismaService,
  ) { }

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

  toUserBankResponse(userbank): GetUserBankResponse {
    return {
      id: userbank.id,
      nama: userbank.nama,
      namaBank: userbank.bank.nama,
      noRekening: userbank.noRekening,
      status: userbank.status,
      createdAt: userbank.createdAt,
    }
  }

  async verifyUserBankId(userBankid: number) {
    const userBank = await this.prismaService.user_Bank.count({
      where: {
        id: userBankid,
      }
    })
    if (userBank < 1) {
      throw new BadRequestException("Akun Bank User Tidak Ditemukan");
    }
  }

  async getBankAccountData(userBankId: number) {
    await this.verifyUserBankId(userBankId);
    const userBank = await this.prismaService.user_Bank.findUnique({
      where: {
        id: userBankId,
      },
      select: {
        noRekening: true,
        status: true,
        bank: {
          select: {
            kode: true,
          }
        }
      }
    });
    if (userBank.status == "DITERIMA") {
      throw new BadRequestException("Akun Bank Sudah Diterima");
    }
    return {
      kode: userBank.bank.kode,
      noRekening: userBank.noRekening,
    };
  }

  async updateUserBankData(userBankId: number, verifiedData?) {
    await this.prismaService.user_Bank.update({
      where: {
        id: userBankId,
      },
      data: {
        nama: verifiedData?.account_name || undefined,
        accountId: verifiedData?.id || undefined,
        status: verifiedData ? "DITERIMA" : "DITOLAK",
      },
      select: {
        id: true,
      }
    });
  }

}

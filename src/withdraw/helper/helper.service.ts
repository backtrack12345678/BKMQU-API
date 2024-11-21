import { BadRequestException, HttpException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { WithdrawResponse } from '../dto/response.dto';

@Injectable()
export class WithdrawHelper {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async checkUserBank(userId: string, userBankId: number) {
    const userBank = await this.prismaService.user_Bank.findUnique({
      where: {
        id: userBankId,
      },
      select: {
        userId: true,
        status: true,
      }
    });
    if (!userBank) {
      throw new NotFoundException("Akun Bank Anda Tidak Ditemukan");
    }
    if (userBank.status !== "DITERIMA") {
      throw new BadRequestException("Akun Bank Anda Belum Diverifikasi");
    }
    if (userBank.userId !== userId) {
      throw new HttpException('Akun Bank Ini Bukan Milik Anda', 403);
    }
  }

  async checkUserSaldo(userId: string, jumlah: number) {
    const detailUser = await this.prismaService.detail_User.findUnique({
      where: {
        userId: userId,
      },
      select: {
        saldo: true,
      }
    });
    if (detailUser.saldo < jumlah) {
      throw new BadRequestException("Saldo Anda Tidak Mencukupi")
    }
  }

  async decreaseSaldo(userId: string, jumlah: number) {
    const result = await this.updateSaldo(userId, jumlah, "decrement");
    if (!result) {
      throw new HttpException("Saldo Gagal Diupdate", 500)
    }
  }

  async updateSaldo(userId: string, jumlah: number, action: 'increment' | 'decrement') {
    const result = await this.prismaService.detail_User.update({
      where: {
        userId: userId,
      },
      data: {
        saldo: { [action]: jumlah },
      },
      select: {
        id: true,
      },
    });
    return result
  }

  async checkWithdrawOwner(userId: string, id: string) {
    const withdraw = await this.prismaService.withdraw.findUnique({
      where: {
        id: id,
      },
      select: {
        userId: true,
        status: true,
      }
    });
    if (!withdraw) {
      throw new NotFoundException("Pengajuan Withdraw Tidak Ditemukan");
    }
    if (withdraw.userId !== userId) {
      throw new HttpException('Pengajuan Withdraw Ini Bukan Milik Anda', 403);
    }
    if (withdraw.status === "DITERIMA") {
      throw new BadRequestException("Withdraw yang Sudah Diterima Tidak Dapat Dihapus")
    }
  }

  async increaseSaldo(userId: string) {
    const saldo = await this.prismaService.detail_User.findUnique({
      where: {
        userId: userId,
      },
      select: {
        saldo: true,
      },
    });
    const result = await this.updateSaldo(userId, Number(saldo.saldo), "increment");
    if (!result) {
      throw new HttpException("Saldo Gagal Diupdate", 500)
    }
  }

  toWithdrawResponse(withdraw: any): WithdrawResponse {
    return {
      id: withdraw.id,
      jumlah: parseInt(withdraw.jumlah),
      status: withdraw.status,
      nama: withdraw.userBank.nama,
      noRekening: withdraw.userBank.noRekening,
      namaBank: withdraw.userBank.bank.nama,
      createdAt: withdraw.createdAt,
    }
  }

  withdrawSelectCondition() {
    return {
      id: true,
      jumlah: true,
      status: true,
      createdAt: true,
      userBank: {
        select: {
          nama: true,
          noRekening: true,
          bank: {
            select: {
              nama: true,
            }
          }
        }
      }
    }
  }
}

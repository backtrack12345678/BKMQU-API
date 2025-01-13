import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { PrismaService } from '../../common/prisma.service';
import {
  KasArusDashboardResponse,
  KasArusResponse,
  KasMutasiResponse,
  KasResponse,
} from '../dto/response.dto';
import { getHost } from 'src/common/utils/utils';
import { Request } from 'express';
import { CreateKasMutasiDto } from '../dto/create-kas.dto';

@Injectable()
export class Helper {
  constructor(private prismaService: PrismaService) {}

  createKasData(payload, mesjidUserId) {
    return {
      id: `kas-${createId()}`,
      mesjidUserId: mesjidUserId,
      nama: payload.nama,
      saldo: payload.saldo,
    };
  }

  toKasResponse(kas): KasResponse {
    return {
      id: kas.id,
      nama: kas.nama,
      saldo: parseInt(kas.saldo),
      bank: kas.kasBank?.userBank.bank.nama || undefined,
      noRekening: kas.kasBank?.userBank.noRekening || undefined,
    };
  }

  toKasMutasiResponse(kasMutasi): KasMutasiResponse {
    return {
      id: kasMutasi.id,
      jumlah: Number(kasMutasi.jumlah),
      fromKas: this.toKasResponse(kasMutasi.kasSender),
      toKas: this.toKasResponse(kasMutasi.kasRecipient),
      createdAt: kasMutasi.createdAt,
    };
  }

  toKasArusResponse(kasArus, request: Request): KasArusResponse {
    return {
      id: kasArus.id,
      tipe: kasArus.tipe,
      kategori: kasArus.kategori,
      metode: kasArus.metode,
      keterangan: kasArus.keterangan,
      jumlah: Number(kasArus.jumlah),
      dokumen: kasArus.kasArusDokumen
        ? `${getHost(request)}/api/files/arus-kas/${kasArus.kasArusDokumen.nama}`
        : undefined,
      createdAt: kasArus.createdAt,
    };
  }

  toKasDashboardResponse(
    kasArus,
    kasTotal,
    request: Request,
  ): KasArusDashboardResponse {
    return {
      totalMasuk: kasTotal.masuk,
      totalKeluar: kasTotal.keluar,
      saldo: kasTotal.saldo,
      kasArus: kasArus
        .map(({ kasArus }) =>
          kasArus.map((kas) => this.toKasArusResponse(kas, request)),
        )
        .flat(),
    };
  }

  toKasArus;

  kasSelectionCondition() {
    return {
      id: true,
      nama: true,
      saldo: true,
      kasBank: {
        select: {
          userBank: {
            select: {
              noRekening: true,
              bank: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      },
    };
  }

  kasMutasiSelectionCondition() {
    return {
      id: true,
      jumlah: true,
      createdAt: true,
      kasSender: {
        select: this.kasSelectionCondition(),
      },
      kasRecipient: {
        select: this.kasSelectionCondition(),
      },
    };
  }

  kasArusSelectCondition() {
    return {
      id: true,
      tipe: true,
      kategori: true,
      metode: true,
      keterangan: true,
      jumlah: true,
      kasArusDokumen: {
        select: {
          nama: true,
          path: true,
        },
      },
      createdAt: true,
    };
  }

  async updateKasSaldo(
    kasId: string,
    jumlah: number,
    tipe: string,
  ): Promise<void> {
    await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        saldo: tipe === 'Masuk' ? { increment: jumlah } : { decrement: jumlah },
      },
      select: {
        id: true,
      },
    });
  }

  async updateExistingArusKasSaldo(
    kasId: string,
    arusKasId: number,
    tipe: string,
  ) {
    let saldoUpdate;
    const result = await this.prismaService.kas_Arus.findUnique({
      where: {
        id: arusKasId,
      },
      select: {
        jumlah: true,
        tipe: true,
      },
    });
    if (tipe === 'Masuk') {
      saldoUpdate =
        result.tipe === 'Masuk'
          ? { decrement: result.jumlah }
          : { increment: result.jumlah };
    }
    if (tipe === 'Keluar') {
      saldoUpdate =
        result.tipe === 'Keluar'
          ? { increment: result.jumlah }
          : { decrement: result.jumlah };
    }

    await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        saldo: saldoUpdate,
      },
    });
  }

  async updateKasSaldoDelete(kasId: string, tipe: string, jumlah: number) {
    await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        saldo: tipe == 'Masuk' ? { decrement: jumlah } : { increment: jumlah },
      },
    });
  }

  async verifyUserBank(
    mesjidUserId: string,
    userBankId: number,
  ): Promise<void> {
    const userBank = await this.prismaService.user_Bank.findUnique({
      where: {
        id: userBankId,
      },
      select: {
        userId: true,
      },
    });

    if (!userBank) {
      throw new NotFoundException('Akun Bank Tidak Ditemukan');
    }
    if (userBank.userId !== mesjidUserId) {
      throw new HttpException('Akun Bank Ini Bukan Milik Anda', 403);
    }
  }

  async verifyMaxKasBank(mesjidUserId: string): Promise<void> {
    const kasBankLimit = await this.getKasBankLimit(mesjidUserId);
    const countKasBank = await this.countKasBank(mesjidUserId);
    if (countKasBank >= kasBankLimit) {
      throw new BadRequestException(
        'Jumlah Kas Bank Sudah Mencapai Maksimum!, Lakukan Pembayaran Terlebih Dahulu',
      );
    }
  }

  async getKasBankLimit(mesjidUserId: string): Promise<number> {
    const kas = await this.prismaService.mesjid.findUnique({
      where: {
        userId: mesjidUserId,
      },
      select: {
        kasBankLimit: true,
      },
    });
    return kas.kasBankLimit;
  }

  async countKasBank(mesjidUserId: string) {
    const countKasBank = await this.prismaService.kas.count({
      where: {
        mesjidUserId: mesjidUserId,
        kasBank: {
          isNot: null,
        },
      },
    });
    return countKasBank;
  }

  async checkBank(bankId: number): Promise<void> {
    const bank = await this.prismaService.bank.count({
      where: {
        id: bankId,
      },
    });
    if (bank < 0) {
      throw new NotFoundException('Bank Tidak Ditemukan');
    }
  }

  async checkKasOwner(mesjidUserId: string, kasId: string) {
    const kas = await this.prismaService.kas.findUnique({
      where: {
        id: kasId,
      },
      select: {
        mesjidUserId: true,
        saldo: true,
      },
    });
    if (!kas) {
      throw new NotFoundException('Kas Tidak Ditemukan');
    }
    if (kas.mesjidUserId !== mesjidUserId) {
      throw new HttpException('Kas Ini Bukan Milik Anda', 403);
    }
    return kas;
  }

  async checkKasArus(kasId: string) {
    const kasArus = await this.prismaService.kas_Arus.count({
      where: {
        kasId: kasId,
      },
    });
    const kasMutasi = await this.prismaService.kas_Mutasi.count({
      where: {
        AND: {
          kasSenderId: kasId,
          kasRecipientId: kasId,
        },
      },
    });
    if (kasArus > 0 && kasMutasi > 0) {
      throw new BadRequestException(
        'Kas Yang Sudah Memiliki Transaksi Tidak Boleh Dihapus',
      );
    }
  }

  async checkKasSaldo(mesjidUserId: string, kasId: string, jumlah: number) {
    const kas = await this.checkKasOwner(mesjidUserId, kasId);
    if (kas.saldo < jumlah) {
      throw new BadRequestException('Saldo Kas Tidak Cukup');
    }
  }

  async getOldArusKasFoto(
    arusKasId: number,
  ): Promise<{ path: string; nama: string }> {
    const arusKas = await this.prismaService.kas_Arus_Dokumen.findUnique({
      where: {
        kasArusId: arusKasId,
      },
      select: {
        path: true,
        nama: true,
      },
    });
    return arusKas;
  }

  async getKasArusTotal(mesjidUserId: string) {
    const groupKasArus = await this.prismaService.kas_Arus.groupBy({
      by: ['tipe'],
      _sum: {
        jumlah: true,
      },
      where: {
        kas: {
          mesjidUserId: mesjidUserId,
        },
        tipe: {
          in: ['Masuk', 'Keluar'],
        },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const kasSaldo = await this.prismaService.kas.aggregate({
      where: {
        mesjidUserId: mesjidUserId,
      },
      _sum: {
        saldo: true,
      },
    });

    return {
      masuk: groupKasArus.find((g) => g.tipe === 'Masuk')?._sum.jumlah || 0,
      keluar: groupKasArus.find((g) => g.tipe === 'Keluar')?._sum.jumlah || 0,
      saldo: Number(kasSaldo._sum.saldo),
    };
  }

  async verifyKasMutasi(
    mesjidUserId: string,
    payload: CreateKasMutasiDto,
  ): Promise<void> {
    await this.checkKasOwner(mesjidUserId, payload.fromKasId);
    await this.checkKasOwner(mesjidUserId, payload.toKasId);
    await this.checkKasSaldo(mesjidUserId, payload.fromKasId, payload.jumlah);
    await this.updateKasSaldo(payload.toKasId, payload.jumlah, 'Masuk');
    await this.updateKasSaldo(payload.fromKasId, payload.jumlah, 'Keluar');
  }
}

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
import { MesjidService } from '../../mesjid/mesjid.service';
import { getHost } from 'src/common/utils/utils';
import { Request } from 'express';


@Injectable()
export class Helper {
  constructor(
    private prismaService: PrismaService,
    private mesjidService: MesjidService,
  ) { }

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
      bank: kas.kasBank?.userBank.bank.nama || null,
    };
  }

  toKasMutasiResponse(kasMutasi): KasMutasiResponse {
    return {
      id: kasMutasi.id,
      jumlah: Number(kasMutasi.jumlah),
      fromKas: this.toKasResponse(kasMutasi.kasSender),
      toKas: this.toKasResponse(kasMutasi.kasRecipient),
      createdAt: kasMutasi.createdAt,
    }
  }


  toKasArusResponse(kasArus, request: Request): KasArusResponse {
    return {
      id: kasArus.id,
      tipe: kasArus.tipe,
      kategori: kasArus.kategori,
      metode: kasArus.metode,
      keterangan: kasArus.keterangan,
      jumlah: Number(kasArus.jumlah),
      dokumen: kasArus.kasArusDokumen ? `${getHost(request)}/api/files/arus-kas/${kasArus.kasArusDokumen.nama}` : undefined,
      createdAt: kasArus.createdAt,
    };
  }

  toKasDashboardResponse(kasArus, kasTotal, request: Request): KasArusDashboardResponse {
    return {
      totalMasuk: kasTotal.masuk,
      totalKeluar: kasTotal.keluar,
      saldo: kasTotal.saldo,
      kasArus: kasArus.map((kas) => this.toKasArusResponse(kas, request)),
    }
  }

  toKasArus

  kasSelectionCondition() {
    return {
      id: true,
      nama: true,
      saldo: true,
      kasBank: {
        select: {
          userBank: {
            select: {
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
      }
    }
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
        }
      },
      createdAt: true,
    }
  }



  async updateKasSaldo(kasId: string, jumlah: number, tipe: string): Promise<void> {
    await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        saldo: tipe === 'Masuk' ? { increment: jumlah } : { decrement: jumlah },
      },
      select: {
        id: true,
      }
    });
  }

  async updateExistingArusKasSaldo(kasId: string, arusKasId: number, tipe: String) {
    let saldoUpdate;
    const result = await this.prismaService.kas_Arus.findUnique({
      where: {
        id: arusKasId,
      },
      select: {
        jumlah: true,
        tipe: true,
      }
    })

    if (tipe === 'Masuk' && result.tipe === 'Keluar') {
      saldoUpdate = { increment: result.jumlah };
    } else if (tipe === 'Keluar' && result.tipe === 'Masuk') {
      saldoUpdate = { decrement: result.jumlah };
    } else if (tipe === result.tipe) {
      saldoUpdate = tipe === 'Keluar' ? { increment: result.jumlah } : { decrement: result.jumlah };
    }
    await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        saldo: saldoUpdate,
      },
    })
  }

  async updateKasSaldoDelete(kasId: string, tipe: string, jumlah: number) {
    await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        saldo: tipe == "Masuk" ? { decrement: jumlah } : { increment: jumlah },
      }
    })
  }

  async verifyUserBank(mesjidUserId: string, userBankId: number): Promise<void> {
    const userBank = await this.prismaService.user_Bank.findUnique({
      where: {
        id: userBankId,
      },
      select: {
        userId: true,
      }
    });

    if (!userBank.userId) {
      throw new NotFoundException('Akun Bank Tidak Ditemukan');
    }
    if (userBank.userId !== mesjidUserId) {
      throw new HttpException('Akun Bank Ini Bukan Milik Anda', 403);
    }
  }

  async verifyKasBank(kasId: string, userBankId: number): Promise<void> {
    const kasBank = await this.prismaService.kas_Bank.count({
      where: {
        kasId: kasId,
        userBankId: userBankId,
      }
    });
    if (kasBank > 0) {
      throw new BadRequestException("Kas Sudah Terhubung Dengan Bank");
    }
  }

  async checkBank(bankId: number): Promise<void> {
    const bank = await this.prismaService.bank.count({
      where: {
        id: bankId
      }
    });
    if (bank < 0) {
      throw new NotFoundException("Bank Tidak Ditemukan");
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

  async checkKasSaldo(mesjidUserId: string, kasId: string, jumlah: number) {
    const kas = await this.checkKasOwner(mesjidUserId, kasId)
    if (kas.saldo < jumlah) {
      throw new BadRequestException('Saldo Tidak Cukup');
    }
  }

  async checkArusKas(kasId: string): Promise<void> {
    const kas = await this.prismaService.kas.findFirst({
      where: {
        id: kasId,
      },
      select: {
        kasArus: {
          select: {
            id: true,
          }
        }
      }
    })
    if (kas.kasArus.id) {
      throw new BadRequestException("Kas Sudah Memiliki Transaksi");
    }
  }

  async getOldArusKasFoto(arusKasId: number): Promise<{ path: string }> {
    const arusKas = await this.prismaService.kas_Arus_Dokumen.findUnique({
      where: {
        kasArusId: arusKasId,
      },
      select: {
        path: true
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
      },
    })

    const kasSaldo = await this.prismaService.kas.aggregate({
      where: {
        mesjidUserId: mesjidUserId,
      },
      _sum: {
        saldo: true,
      }
    })

    const [masuk, keluar] = groupKasArus.map(({ tipe, _sum }) => ({
      tipe: tipe,
      jumlah: _sum.jumlah,
    }));

    return {
      masuk: masuk?.jumlah || 0,
      keluar: keluar?.jumlah || 0,
      saldo: Number(kasSaldo._sum.saldo),
    }
  }
}

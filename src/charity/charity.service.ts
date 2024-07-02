import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateDonasiInfaqDto,
  CreateDonasiSedekahDto,
  CreateInfaqMesjidDto,
  CreatePenerimaSedekahDto,
} from './dto/create-charity.dto';
import { UpdatePenerimaSedekahDto } from './dto/update-charity.dto';
import { PrismaService } from '../common/prisma.service';
import { Auth } from '../model/user.model';
import { v4 as uuid } from 'uuid';
import { getHost } from '../common/utils/utils';
import { MidtransService } from '../midtrans/midtrans.service';
import { GetKasQueryDto } from '../kas/dto/get.dto';
import { Request } from 'express';

@Injectable()
export class CharityService {
  constructor(
    private prismaService: PrismaService,
    private midtransService: MidtransService,
  ) {}

  async verifyInfaqId(infaqId: string, mesjidUserId?: string): Promise<void> {
    const infaq = await this.prismaService.infaq.findUnique({
      where: {
        id: infaqId,
        // mesjidUserId,
      },
      select: {
        id: true,
      },
    });
    if (!infaq) {
      throw new NotFoundException('Target infaq tidak ditemukan');
    }
  }

  async verifyKategoriSedekahId(kategoriId: number): Promise<{ id: number }> {
    const kategoriSedekah =
      await this.prismaService.kategori_Sedekah.findUnique({
        where: {
          id: kategoriId,
        },
        select: {
          id: true,
        },
      });

    if (!kategoriSedekah) {
      throw new NotFoundException('Kategori sedekah tidak ditemukan');
    }
    return kategoriSedekah;
  }

  async verifyPenerimaSedekahId(userId: string, penerimaId: number) {
    const penerimaSedekah =
      await this.prismaService.penerima_Sedekah.findUnique({
        where: {
          id: penerimaId,
        },
        select: {
          id: true,
          mesjidUserId: true,
        },
      });

    if (!penerimaSedekah) {
      throw new NotFoundException('Penerima sedekah tidak ditemukan');
    }

    if (penerimaSedekah.mesjidUserId !== userId) {
      throw new HttpException(
        'Anda tidak berhak mengakses penerima sedekah ini',
        403,
      );
    }
    return penerimaSedekah;
  }

  async createDonasiInfaq(
    user: Auth,
    payload: CreateDonasiInfaqDto,
    infaqId?: string,
  ) {
    if (infaqId) {
      await this.verifyInfaqId(infaqId);
    }
    const transactionType = infaqId ? 1 : 2;
    const snap = await this.midtransService.createMidtransTransaction(
      transactionType,
      payload,
    );
    const result = await this.prismaService.user_Infaq.create({
      data: {
        midtransId: snap.id,
        userId: user.id,
        pesan: payload.pesan,
        ...(infaqId && {
          infaqTarget: {
            create: {
              infaqId,
            },
          },
        }),
      },
      select: {
        pesan: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!result || !snap) {
      throw new HttpException('Transaksi gagal dibuat', 500);
    }
    return {
      id: snap.id,
      pesan: result.pesan,
      amount: snap.amount,
      redirectUrl: snap.redirectUrl,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async createDonasiSedekah(
    user: Auth,
    payload: CreateDonasiSedekahDto,
    kategoriId: number,
  ) {
    await this.verifyKategoriSedekahId(kategoriId);
    const snap = await this.midtransService.createMidtransTransaction(
      3,
      payload,
    );
    const userSedekah = await this.prismaService.user_Sedekah.create({
      data: {
        userId: user.id,
        midtransId: snap.id,
        kategoriId,
        pesan: payload.pesan,
      },
      select: {
        kategori: {
          select: {
            nama: true,
          },
        },
        pesan: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!userSedekah || !snap) {
      throw new HttpException('Transaksi gagal dibuat', 500);
    }
    return {
      id: snap.id,
      pesan: userSedekah.pesan,
      kategori: userSedekah.kategori.nama,
      amount: snap.amount,
      redirectUrl: snap.redirectUrl,
      createdAt: userSedekah.createdAt,
      updatedAt: userSedekah.updatedAt,
    };
  }

  async createInfaq(
    request: any,
    payload: CreateInfaqMesjidDto,
    content: Express.Multer.File,
  ) {
    const user: Auth = request.user;
    const infaq = await this.prismaService.infaq.create({
      data: {
        id: `infaq-${uuid()}`,
        mesjidUserId: user.id,
        uraian: payload.uraian,
        foto: content.filename,
        path: content.path,
        targetNominal: payload.targetNominal,
      },
      select: {
        id: true,
        uraian: true,
        foto: true,
        targetNominal: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: infaq.id,
      uraian: infaq.uraian,
      foto: `${getHost(request)}/api/files/infaq/${infaq.foto}`,
      targetNominal: parseInt(String(infaq.targetNominal)),
      createdAt: infaq.createdAt,
      updatedAt: infaq.updatedAt,
    };
  }

  async createPenerimaSedekah(user: Auth, payload: CreatePenerimaSedekahDto) {
    const penerimaSedekah = await this.prismaService.penerima_Sedekah.create({
      data: {
        mesjidUserId: user.id,
        kategoriId: payload.kategoriId,
        namaPenerima: payload.namaPenerima,
        usia: payload.usia,
        jumlahKeluarga: payload.jumlahKeluarga,
        alamat: payload.alamat,
      },
      select: {
        id: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        namaPenerima: true,
        usia: true,
        jumlahKeluarga: true,
        alamat: true,
      },
    });
    return {
      id: penerimaSedekah.id,
      kategori: penerimaSedekah.kategori.nama,
      namaPenerima: penerimaSedekah.namaPenerima,
      usia: penerimaSedekah.usia,
      jumlahKeluarga: penerimaSedekah.jumlahKeluarga,
      alamat: penerimaSedekah.alamat,
    };
  }

  async updatePenerimaSedekah(
    user: Auth,
    payload: UpdatePenerimaSedekahDto,
    penerimaId: number,
  ) {
    await this.verifyPenerimaSedekahId(user.id, penerimaId);
    await this.verifyKategoriSedekahId(payload.kategoriId || 0);

    const penerimaSedekah = await this.prismaService.penerima_Sedekah.update({
      where: {
        id: penerimaId,
        mesjidUserId: user.id,
      },
      data: {
        ...payload,
      },
      select: {
        id: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        namaPenerima: true,
        usia: true,
        jumlahKeluarga: true,
        alamat: true,
      },
    });

    return {
      id: penerimaSedekah.id,
      kategori: penerimaSedekah.kategori.nama,
      namaPenerima: penerimaSedekah.namaPenerima,
      usia: penerimaSedekah.usia,
      jumlahKeluarga: penerimaSedekah.jumlahKeluarga,
      alamat: penerimaSedekah.alamat,
    };
  }

  async removePenerimaSedekah(user: Auth, penerimaId: number) {
    await this.verifyPenerimaSedekahId(user.id, penerimaId);
    const penerimaSedekah = await this.prismaService.penerima_Sedekah.delete({
      where: {
        id: penerimaId,
        mesjidUserId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!penerimaSedekah) {
      throw new HttpException('Penerima sedekah gagal dihapus', 500);
    }
  }

  async getTotalMesjidTransaction(userId: string): Promise<number> {
    const midtransTransaction =
      await this.prismaService.midtrans_Transactions.groupBy({
        by: ['recipientId'],
        where: {
          recipientId: userId,
          isInserted: true,
        },
        _sum: {
          netAmount: true,
        },
      });
    return midtransTransaction[0] ? midtransTransaction[0]._sum.netAmount : 0;
  }

  async getHistoryTransaksiMesjid(userId, query: GetKasQueryDto) {
    const midtransTransaction =
      await this.prismaService.midtrans_Transactions.findMany({
        where: {
          recipientId: userId,
          isInserted: true,
        },
        take: query.takeCount,
        skip: query.page ? (query.page - 1) * query.takeCount : undefined,
        select: {
          amount: true,
          netAmount: true,
          updatedAt: true,
          category: {
            select: {
              nama: true,
            },
          },
          userInfaq: {
            select: {
              pesan: true,
            },
          },
          userSedekah: {
            select: {
              pesan: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    return midtransTransaction.map((transaction) => ({
      amount: transaction.amount,
      netAmount: transaction.netAmount,
      kategori: transaction.category.nama,
      pesan:
        transaction.userInfaq?.pesan || transaction.userSedekah?.pesan || '',
      updatedAt: transaction.updatedAt,
    }));
  }

  async getInfaq(mesjidUserId: string, request: Request) {
    const result = await this.prismaService.infaq.findMany({
      where: {
        mesjidUserId,
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      select: {
        id: true,
        uraian: true,
        foto: true,
        targetNominal: true,
        saldoMasuk: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result.map((infaq) => ({
      id: infaq.id,
      uraian: infaq.uraian,
      foto: `${getHost(request)}/api/files/infaq/${infaq.foto}`,
      targetNominal: Number(infaq.targetNominal),
      saldoMasuk: Number(infaq.saldoMasuk),
      createdAt: infaq.createdAt,
      updatedAt: infaq.updatedAt,
    }));
  }

  async getDonaturInfaq(userId: string, query: GetKasQueryDto) {
    const result = await this.prismaService.user_Infaq.findMany({
      where: {
        userId,
      },
      take: query.takeCount,
      skip: query.page ? (query.page - 1) * query.takeCount : undefined,
      select: {
        pesan: true,
        midtrans: {
          select: {
            id: true,
            amount: true,
            netAmount: true,
            isInserted: true,
            redirectUrl: true,
            createdAt: true,
            updatedAt: true,
            recipient: {
              select: {
                detailUser: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return result.map((donatur) => ({
      id: donatur.midtrans.id,
      pesan: donatur.pesan,
      amount: donatur.midtrans.amount,
      netAmount: donatur.midtrans.netAmount,
      paidStatus: donatur.midtrans.isInserted,
      recipient: donatur.midtrans.recipient.detailUser.nama,
      redirectUrl: donatur.midtrans.redirectUrl,
      createdAt: donatur.midtrans.createdAt,
      updatedAt: donatur.midtrans.updatedAt,
    }));
  }

  async getPenerimaSedekah(userId: string, kategoriId?: number) {
    const penerimaSedekah = await this.prismaService.penerima_Sedekah.findMany({
      where: {
        mesjidUserId: userId,
        kategoriId: kategoriId || undefined,
      },
      select: {
        id: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        namaPenerima: true,
        usia: true,
        jumlahKeluarga: true,
        alamat: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return penerimaSedekah.map((penerima) => ({
      id: penerima.id,
      kategori: penerima.kategori.nama,
      namaPenerima: penerima.namaPenerima,
      usia: penerima.usia,
      jumlahKeluarga: penerima.jumlahKeluarga,
      alamat: penerima.alamat,
    }));
  }

  async getCountSedekah(userId: string) {
    const result = await this.prismaService.kategori_Sedekah.findMany({
      select: {
        nama: true,
        _count: {
          select: {
            penerimaSedekah: {
              where: {
                mesjidUserId: userId,
              },
            },
          },
        },
      },
    });
    return result.map((penerima) => ({
      kategori: penerima.nama,
      jumlah: penerima._count.penerimaSedekah,
    }));
  }

  async getSedekah(userId: string, query: GetKasQueryDto, kategoriId?: number) {
    const userSedekah = await this.prismaService.user_Sedekah.findMany({
      where: {
        userId,
        kategoriId: kategoriId || undefined,
      },
      take: query.takeCount,
      skip: query.page ? (query.page - 1) * query.takeCount : undefined,
      select: {
        pesan: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        midtrans: {
          select: {
            id: true,
            amount: true,
            netAmount: true,
            isInserted: true,
            redirectUrl: true,
            createdAt: true,
            updatedAt: true,
            recipient: {
              select: {
                detailUser: {
                  select: {
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return userSedekah.map((donatur) => ({
      id: donatur.midtrans.id,
      pesan: donatur.pesan,
      kategori: donatur.kategori.nama,
      amount: donatur.midtrans.amount,
      netAmount: donatur.midtrans.netAmount,
      paidStatus: donatur.midtrans.isInserted,
      recipient: donatur.midtrans.recipient.detailUser.nama,
      redirectUrl: donatur.midtrans.redirectUrl,
      createdAt: donatur.midtrans.createdAt,
      updatedAt: donatur.midtrans.updatedAt,
    }));
  }
}

import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ConnectKasBankDto,
  CreateKasArusDto,
  CreateKasDto,
  CreateKasMutasiDto,
} from './dto/create-kas.dto';
// import { UpdateKaDto } from './dto/update-ka.dto';
import { Auth } from '../model/user.model';
import { PrismaService } from '../common/prisma.service';
import { MesjidService } from '../mesjid/mesjid.service';
import {
  KasArusResponse,
  KasMutasiResponse,
  KasResponse,
  TotalKasResponse,
} from './dto/response.dto';
import {
  GetArusKasDashboardDto,
  GetKasArusDto,
  GetKasQueryDto,
  GetKasTotalDto,
  GetMutasiQueryDto,
} from './dto/get.dto';
import { FilesService } from '../files/files.service';
import {
  UpdateKasArusDto,
  UpdateKasDto,
} from './dto/update-kas.dto';
import { Helper } from './helper/helper';
import { KasArusParamDto } from './dto/params.dto';

@Injectable()
export class KasService {
  constructor(
    private prismaService: PrismaService,
    private mesjidService: MesjidService,
    private filesService: FilesService,
    private kasHelper: Helper,
  ) { }

  async createKas(
    user: Auth,
    payload: CreateKasDto,
  ): Promise<KasResponse> {
    const mesjidUserId: string = user.id;
    const kas = await this.prismaService.kas.create({
      data: this.kasHelper.createKasData(payload, mesjidUserId),
      select: this.kasHelper.kasSelectionCondition(),
    });
    if (!kas) {
      throw new HttpException('Kas Gagal Dibuat', 500);
    }
    return this.kasHelper.toKasResponse(kas);
  }

  async connectKasBank(
    user: Auth,
    payload: ConnectKasBankDto,
    kasId: string,
  ): Promise<void> {
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, kasId);
    await this.kasHelper.verifyUserBank(mesjidUserId, payload.userBankId);
    await this.kasHelper.verifyKasBank(kasId, payload.userBankId);
    const kasBank = await this.prismaService.kas_Bank.create({
      data: {
        userBankId: payload.userBankId,
        kasId: kasId,
      },
      select: {
        id: true,
      }
    });
    if (!kasBank) {
      throw new HttpException('Kas Gagal Dihubungkan', 500);
    }
  }

  async getKas(
    user: Auth,
    query: GetKasQueryDto
  ): Promise<KasResponse[] | []> {
    const mesjidUserId = user.id;
    const kas = await this.prismaService.kas.findMany({
      where: {
        mesjidUserId: mesjidUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: query.takeCount || undefined,
      skip: (query.page - 1) * query.takeCount || undefined,
      select: this.kasHelper.kasSelectionCondition(),
    });
    return kas.map((kas) => this.kasHelper.toKasResponse(kas));
  }

  async updateKas(
    user: Auth,
    payload: UpdateKasDto,
    kasId: string,
  ): Promise<KasResponse> {
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, kasId);
    if (payload.userBankId) {
      await this.kasHelper.verifyUserBank(mesjidUserId, payload.userBankId);
    }
    const kas = await this.prismaService.kas.update({
      where: {
        id: kasId,
      },
      data: {
        nama: payload.nama || undefined,
        kasBank: {
          update: {
            userBankId: payload.userBankId || undefined,
          }
        }
      },
      select: this.kasHelper.kasSelectionCondition(),
    });
    if (!kas) {
      throw new HttpException('Kas Gagal Dibuat', 500);
    }
    return this.kasHelper.toKasResponse(kas);
  }

  async removeKas(user: Auth, kasId: string): Promise<KasResponse> {
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, kasId);
    const kas = await this.prismaService.kas.delete({
      where: {
        id: kasId,
      },
      select: this.kasHelper.kasSelectionCondition(),
    });
    if (!kas) {
      throw new HttpException('Kas Gagal Dihapus', 500);
    }
    return this.kasHelper.toKasResponse(kas);
  }

  async createKasArus(
    request: any,
    kasId: string,
    payload: CreateKasArusDto,
    buktiKasArus?: Express.Multer.File,
  ): Promise<KasArusResponse> {
    const user: Auth = request.user;
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, kasId);
    const kasArus = await this.prismaService.kas_Arus.create({
      data: {
        kasId: kasId,
        ...payload,
        ...(buktiKasArus && {
          kasArusDokumen: {
            create: {
              nama: buktiKasArus.filename,
              path: buktiKasArus.path
            }
          }
        }),
      },
      select: this.kasHelper.kasArusSelectCondition(),
    });
    await this.kasHelper.updateKasSaldo(kasId, payload.jumlah, payload.tipe);
    if (!kasArus) {
      throw new HttpException('Arus Kas Gagal Dibuat', 500);
    }

    return this.kasHelper.toKasArusResponse(kasArus, request);
  }

  async getKasArus(
    request: any,
    kasId: string,
    query: GetKasArusDto,
  ): Promise<KasArusResponse[] | []> {
    const user: Auth = request.user;
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, kasId);
    const kasArus = await this.prismaService.kas_Arus.findMany({
      where: {
        kasId: kasId,
        createdAt: {
          gte: query.fromDate,
          lte: query.toDate,
        }
      },
      select: this.kasHelper.kasArusSelectCondition(),
    });
    return kasArus.map((kasArus) => this.kasHelper.toKasArusResponse(kasArus, request));
  }

  async updateKasArus(
    request: any,
    payload: UpdateKasArusDto,
    param: KasArusParamDto,
    buktiKasArus?: Express.Multer.File,
  ): Promise<KasArusResponse> {
    const user: Auth = request.user;
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, param.kasId);
    const oldBukti = await this.kasHelper.getOldArusKasFoto(param.arusKasId);
    const arusKas = await this.prismaService.kas_Arus.update({
      where: {
        id: param.arusKasId,
      },
      data: {
        ...payload,
        ...(buktiKasArus && {
          kasArusDokumen: {
            update: {
              nama: buktiKasArus.filename,
              path: buktiKasArus.path
            }
          }
        }),
      },
      select: this.kasHelper.kasArusSelectCondition(),
    });
    await this.kasHelper.updateExistingArusKasSaldo(param.kasId, param.arusKasId, payload.tipe)
    await this.kasHelper.updateKasSaldo(param.kasId, payload.jumlah, payload.tipe);
    if (oldBukti) {
      this.filesService.deleteSingleFile(oldBukti);
    }

    if (!arusKas) {
      throw new HttpException('Arus Kas Gagal Diperbaruri', 500);
    }

    return this.kasHelper.toKasArusResponse(arusKas, request);
  }

  async deleteKasArus(
    request: any,
    param: KasArusParamDto,
  ): Promise<KasArusResponse> {
    const user: Auth = request.user;
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, param.kasId);
    const arusKas = await this.prismaService.kas_Arus.delete({
      where: {
        id: param.arusKasId,
      },
      select: this.kasHelper.kasArusSelectCondition(),
    });

    if (!arusKas) {
      throw new HttpException('Arus Kas Gagal Dihapus', 500);
    }
    await this.kasHelper.updateKasSaldoDelete(param.kasId, arusKas.tipe, arusKas.jumlah)
    if (arusKas.kasArusDokumen) {
      this.filesService.deleteSingleFile(arusKas.kasArusDokumen);
    }
    return this.kasHelper.toKasArusResponse(arusKas, request);
  }

  async createKasMutasi(
    user: Auth,
    payload: CreateKasMutasiDto,
  ): Promise<KasMutasiResponse> {
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, payload.fromKasId);
    await this.kasHelper.checkKasOwner(mesjidUserId, payload.toKasId);
    await this.kasHelper.checkKasSaldo(mesjidUserId, payload.fromKasId, payload.jumlah);
    const kasMutasi = await this.prismaService.kas_Mutasi.create({
      data: {
        mesjidUserId: mesjidUserId,
        kasSenderId: payload.fromKasId,
        kasRecipientId: payload.toKasId,
        jumlah: payload.jumlah,
      },
      select: this.kasHelper.kasMutasiSelectionCondition(),
    })
    await this.kasHelper.updateKasSaldo(payload.toKasId, payload.jumlah, "Masuk")
    await this.kasHelper.updateKasSaldo(payload.fromKasId, payload.jumlah, "Keluar")
    return this.kasHelper.toKasMutasiResponse(kasMutasi);
  }

  async getKasMutasi(
    user: Auth,
    query: GetMutasiQueryDto,
  ): Promise<KasMutasiResponse[] | []> {
    const mesjidUserId: string = user.id;
    const kasMutasi = await this.prismaService.kas_Mutasi.findMany({
      where: {
        mesjidUserId: mesjidUserId,
      },
      take: query.takeCount || undefined,
      skip: (query.page - 1) * query.takeCount || undefined,
      orderBy: {
        createdAt: 'desc',
      },
      select: this.kasHelper.kasMutasiSelectionCondition(),
    });
    return kasMutasi.map((kasMutasi) => this.kasHelper.toKasMutasiResponse(kasMutasi));
  }

  //
  async getDashboardArusKas(
    userId: string,
    query: GetArusKasDashboardDto,
  ): Promise<ArusKasResponse[]> {
    const mesjidUserId: string = userId;
    const kas = await this.prismaService.kas.findMany({
      where: {
        mesjidId,
        ...((query.bulan || query.tahun) && {
          arusKas: {
            some: {
              bulan: query.bulan,
              tahun: query.tahun,
            },
          },
        }),
      },
      select: {
        arusKas: {
          take: query.takeCount,
          skip: query.page ? (query.page - 1) * query.takeCount : undefined,
          orderBy: {
            createdAt: 'desc',
          },
          select: this.kasHelper.arusKasSelectCondition('Keluar'),
        },
      },
    });
    return kas.flatMap((item) =>
      item.arusKas.map((arusKasItem) =>
        this.kasHelper.toArusKasResponse(arusKasItem, arusKasItem.status),
      ),
    );
  }

  async getTotalKas(
    userId: string,
    query: GetKasTotalDto,
  ): Promise<TotalKasResponse> {
    const mesjidUserId: string = userId;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);

    const { bulan, tahun } = query;
    const kas = await this.prismaService.kas.findMany({
      where: {
        mesjidId,
      },
      select: {
        arusKas: {
          where: {
            bulan,
            tahun,
          },
          select: {
            status: true,
            jumlah: true,
          },
        },
        rekapKasBulanan: {
          where: {
            bulan,
            tahun,
          },
          select: {
            totalKeluar: true,
            totalMasuk: true,
            // initialSaldo: true,
          },
        },
      },
    });
    const { totalKeluar, totalMasuk } = kas.reduce(
      (totals, item) => ({
        totalKeluar:
          totals.totalKeluar +
          item.arusKas.reduce(
            (acc, arus) =>
              acc + (arus.status === 'Keluar' ? Number(arus.jumlah) : 0),
            0,
          ) +
          item.rekapKasBulanan.reduce(
            (acc, rekap) => acc + Number(rekap.totalKeluar),
            0,
          ),
        totalMasuk:
          totals.totalMasuk +
          item.arusKas.reduce(
            (acc, arus) =>
              acc + (arus.status === 'Masuk' ? Number(arus.jumlah) : 0),
            0,
          ) +
          item.rekapKasBulanan.reduce(
            (acc, rekap) => acc + Number(rekap.totalMasuk),
            0,
          ),
      }),
      { totalKeluar: 0, totalMasuk: 0 },
    );

    return {
      totalMasuk,
      totalKeluar,
      totalInitial: totalMasuk - totalKeluar,
    };
  }
}

import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ConnectKasBankDto,
  CreateKasArusDto,
  CreateKasDto,
  CreateKasMutasiDto,
} from './dto/create-kas.dto';
import { Auth } from '../model/user.model';
import { PrismaService } from '../common/prisma.service';
import {
  KasArusDashboardResponse,
  KasArusResponse,
  KasMutasiResponse,
  KasResponse,
  KuotaResponse,
} from './dto/response.dto';
import {
  GetDashboardKasArusDto,
  GetKasArusDto,
  GetKasQueryDto,
  GetMutasiQueryDto,
} from './dto/get.dto';
import { FilesService } from '../files/files.service';
import { UpdateKasArusDto, UpdateKasDto } from './dto/update-kas.dto';
import { Helper } from './helper/helper';
import { KasArusParamDto } from './dto/params.dto';

@Injectable()
export class KasService {
  constructor(
    private prismaService: PrismaService,
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
    await this.kasHelper.verifyMaxKasBank(mesjidUserId);
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

  async getKuotaKasBank(
    user: Auth
  ): Promise<KuotaResponse> {
    const mesjidUserId = user.id;
    const kasBankLimit = await this.kasHelper.getKasBankLimit(mesjidUserId);
    const countKasBank = await this.kasHelper.countKasBank(mesjidUserId);
    return {
      kuota: kasBankLimit - countKasBank
    }
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

  async removeKas(user: Auth, kasId: string): Promise<void> {
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, kasId);
    await this.kasHelper.checkKasArus(kasId);
    const kas = await this.prismaService.kas.delete({
      where: {
        id: kasId,
      },
      select: {
        id: true,
      }
    });
    if (!kas) {
      throw new HttpException('Kas Gagal Dihapus', 500);
    }
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
    const kasArus = await this.prismaService.kas_Arus.findMany({
      where: {
        kasId: kasId,
        createdAt: {
          gte: query.fromDate,
          lte: query.toDate,
        }
      },
      orderBy: {
        createdAt: 'desc',
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
    await this.kasHelper.updateExistingArusKasSaldo(param.kasId, param.arusKasId, payload.tipe)
    await this.kasHelper.updateKasSaldo(param.kasId, payload.jumlah, payload.tipe);
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
  ): Promise<void> {
    const user: Auth = request.user;
    const mesjidUserId: string = user.id;
    await this.kasHelper.checkKasOwner(mesjidUserId, param.kasId);
    try {
      await this.deleteKasArusFromDb(param)
    } catch (e) {
      throw new NotFoundException("Kas Arus Tidak Ditemukan")
    }
  }

  async deleteKasArusFromDb(param: KasArusParamDto) {
    const arusKas = await this.prismaService.kas_Arus.delete({
      where: {
        id: param.arusKasId,
      },
      select: this.kasHelper.kasArusSelectCondition(),
    });
    await this.kasHelper.updateKasSaldoDelete(param.kasId, arusKas.tipe, arusKas.jumlah)
    if (arusKas.kasArusDokumen) {
      this.filesService.deleteSingleFile(arusKas.kasArusDokumen);
    }
  }

  async createKasMutasi(
    user: Auth,
    payload: CreateKasMutasiDto,
  ): Promise<KasMutasiResponse> {
    const mesjidUserId: string = user.id;
    await this.kasHelper.verifyKasMutasi(mesjidUserId, payload);
    const kasMutasi = await this.prismaService.kas_Mutasi.create({
      data: {
        mesjidUserId: mesjidUserId,
        kasSenderId: payload.fromKasId,
        kasRecipientId: payload.toKasId,
        jumlah: payload.jumlah,
      },
      select: this.kasHelper.kasMutasiSelectionCondition(),
    })
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

  async getDashboardArusKas(
    request: any,
    userId: string,
    query: GetDashboardKasArusDto,
  ): Promise<KasArusDashboardResponse> {
    const mesjidUserId: string = userId;
    const kasArus = await this.prismaService.kas.findMany({
      where: {
        mesjidUserId: mesjidUserId,
      },
      select: {
        kasArus: {
          where: {
            createdAt: {
              gte: query.fromDate,
              lte: query.toDate,
            }
          },
          take: query.takeCount || undefined,
          skip: (query.page - 1) * query.takeCount || undefined,
          orderBy: {
            createdAt: 'desc',
          },
          select: this.kasHelper.kasArusSelectCondition(),
        },
      },
    });
    const kasTotal = await this.kasHelper.getKasArusTotal(mesjidUserId);
    return this.kasHelper.toKasDashboardResponse(kasArus, kasTotal, request);
  }
}

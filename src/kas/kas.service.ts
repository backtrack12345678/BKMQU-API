import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateArusKasMasukDto,
  CreateKasBankDto,
  CreateKasMutasiDto,
  CreateKasTunaiDto,
} from './dto/create-kas.dto';
// import { UpdateKaDto } from './dto/update-ka.dto';
import { Auth } from '../model/user.model';
import { PrismaService } from '../common/prisma.service';
import { MesjidService } from '../mesjid/mesjid.service';
import {
  ArusKasResponse,
  ArusKasResult,
  GetAllKasResponse,
  GetKasMutasiResponse,
  KasMutasiResponse,
  KasResponse,
  TotalKasResponse,
} from './dto/response.dto';
import {
  GetArusKasDashboardDto,
  GetArusKasDto,
  GetKasQueryDto,
  GetKasTotalDto,
  GetMutasiQueryDto,
} from './dto/get.dto';
import { FilesService } from '../files/files.service';
import {
  UpdateArusKasKeluarDto,
  UpdateArusKasMasukDto,
  UpdateKasBankDto,
} from './dto/update-kas.dto';
import { CreateArusKasKeluarDto } from './dto/create-kas.dto';
import { Helper } from './helper/helper';
import { ArusKasParamDto } from './dto/params.dto';
import { DeleteArusKasDto } from './dto/delete.dto';

@Injectable()
export class KasService {
  constructor(
    private prismaService: PrismaService,
    private mesjidService: MesjidService,
    private filesService: FilesService,
    private kasHelper: Helper,
  ) {}

  async createKasTunai(
    user: Auth,
    payload: CreateKasTunaiDto,
  ): Promise<KasResponse> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);

    const kas = await this.prismaService.kas.create({
      data: this.kasHelper.createKasData(payload, mesjidId, 'Tunai'),
      select: {
        ...this.kasHelper.kasSelectConditions(),
        rekapKasBulanan: {
          select: {
            initialSaldo: true,
            bulan: true,
            tahun: true,
          },
        },
      },
    });

    if (!kas) {
      throw new HttpException('Kas Gagal Dibuat', 500);
    }

    return this.kasHelper.toKasResponse(kas);
  }

  async createKasBank(
    user: Auth,
    payload: CreateKasBankDto,
    fotoRek: Express.Multer.File,
  ): Promise<KasResponse> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    await this.kasHelper.verifyRekeningBank(payload.nomorRek);

    const kas = await this.prismaService.kas.create({
      data: this.kasHelper.createKasData(payload, mesjidId, 'Bank', fotoRek),
      select: {
        ...this.kasHelper.kasSelectConditions(),
        rekapKasBulanan: {
          select: {
            initialSaldo: true,
            bulan: true,
            tahun: true,
          },
        },
      },
    });

    if (!kas) {
      throw new HttpException('Kas Gagal Dibuat', 500);
    }

    return this.kasHelper.toKasResponse(kas);
  }

  async getKas(user: Auth, query: GetKasQueryDto): Promise<GetAllKasResponse> {
    const mesjidUserId = user.id;
    const result = await this.prismaService.user.findUnique({
      where: {
        id: mesjidUserId,
      },
      select: {
        detailUser: {
          select: {
            nama: true,
          },
        },
        mesjid: {
          select: {
            kas: {
              take: query.takeCount || undefined,
              skip: (query.page - 1) * query.takeCount || undefined,
              orderBy: {
                jenis: 'asc',
              },
              select: {
                ...this.kasHelper.kasSelectConditions(),
                rekapKasBulanan: {
                  select: {
                    initialSaldo: true,
                    bulan: true,
                    tahun: true,
                  },
                  orderBy: {
                    createdAt: 'desc',
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    return {
      namaMesjid: result.detailUser['nama'],
      kas: result.mesjid.kas.map((kas) => this.kasHelper.toKasResponse(kas)),
    };
  }

  async updateKasBank(
    user: Auth,
    payload: UpdateKasBankDto,
    kasId: string,
    fotoRek?: Express.Multer.File,
  ): Promise<void> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    await this.kasHelper.checkKasOwner(mesjidId, kasId);

    const oldFotoRek = fotoRek ? await this.kasHelper.getOldFotoRek(kasId) : '';

    this.prismaService.$transaction(async (p) => {
      const kas = await p.kas.update({
        where: {
          id: kasId,
        },
        data: {
          namaBank: payload.namaBank || '',
          namaRekening: payload.namaRek || '',
          nomorRekening: payload.nomorRek || '',
          fotoRekening: fotoRek.filename || undefined,
          path: fotoRek.path || undefined,
        },
        select: {
          id: true,
        },
      });

      if (!kas) {
        throw new HttpException('Kas Gagal Diperbaruri', 500);
      }

      if (oldFotoRek) {
        this.filesService.deleteSingleFile(oldFotoRek);
      }
    });
  }

  async removeKas(user: Auth, kasId: string): Promise<void> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    await this.kasHelper.checkKasOwner(mesjidId, kasId);

    const fotoRek = await this.kasHelper.getOldFotoRek(kasId);

    const result = await this.prismaService.$transaction([
      this.prismaService
        .$executeRaw`DELETE FROM arus_kas WHERE kas_id = ${kasId};`,
      this.prismaService
        .$executeRaw`DELETE FROM rekap_kas_bulanan WHERE kas_id = ${kasId};`,
      this.prismaService
        .$executeRaw`DELETE FROM mutasi WHERE sender_kas_id = ${kasId} OR recipient_kas_id = ${kasId};`,
      this.prismaService.$executeRaw`DELETE FROM kas WHERE id = ${kasId};`,
    ]);
    if (!result[3]) {
      throw new NotFoundException('Kas Tidak Ditemukan');
    }

    if (fotoRek) {
      this.filesService.deleteSingleFile(fotoRek);
    }
  }

  async createArusKasMasuk(
    user: Auth,
    kasId: string,
    payload: CreateArusKasMasukDto,
  ): Promise<ArusKasResponse> {
    await this.kasHelper.createArusKasHelper(user.id, kasId, payload);
    const arusKas: ArusKasResult = await this.prismaService.arus_Kas.create({
      data: {
        kasId: kasId,
        status: 'Masuk',
        ...payload,
      },
      select: this.kasHelper.arusKasSelectCondition('Masuk'),
    });

    if (!arusKas) {
      throw new HttpException('Arus Kas Masuk Gagal Dibuat', 500);
    }

    return this.kasHelper.toArusKasResponse(arusKas, 'Masuk');
  }

  async createArusKasKeluar(
    user: Auth,
    kasId: string,
    payload: CreateArusKasKeluarDto,
    buktiArusKas: Express.Multer.File,
  ): Promise<ArusKasResponse> {
    await this.kasHelper.createArusKasHelper(user.id, kasId, payload);
    const { nama, ...dataPayload } = payload;
    const arusKas: ArusKasResult = await this.prismaService.arus_Kas.create({
      data: {
        kasId: kasId,
        status: 'Keluar',
        ...dataPayload,
        namaPenerimaKeluar: nama,
        bukti: buktiArusKas.filename,
        path: buktiArusKas.path,
      },

      select: this.kasHelper.arusKasSelectCondition('Keluar'),
    });

    if (!arusKas) {
      throw new HttpException('Arus Kas Keluar Gagal Dibuat', 500);
    }

    return this.kasHelper.toArusKasResponse(arusKas, 'Keluar');
  }

  async getArusKas(
    user: Auth,
    kasId: string,
    query: GetArusKasDto,
  ): Promise<ArusKasResponse[] | []> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    await this.kasHelper.checkKasOwner(mesjidId, kasId);

    const filters = {
      bulan: query.bulan,
      tahun: query.tahun || new Date().getFullYear(),
    };

    const kas = await this.prismaService.kas.findUnique({
      where: {
        id: kasId,
      },
      select: {
        arusKas: {
          where: filters,
          select: this.kasHelper.arusKasSelectCondition('Keluar'),
        },
        rekapKasBulanan: {
          where: filters,
          select: {
            initialSaldo: true,
          },
        },
      },
    });

    let saldoAwal = parseInt(String(kas.rekapKasBulanan[0]?.initialSaldo)) || 0;
    return kas.arusKas.map((item) => {
      const jumlah = parseInt(String(item.jumlah));
      saldoAwal += item.status === 'Masuk' ? jumlah : -jumlah;
      return {
        ...this.kasHelper.toArusKasResponse(item, item.status),
        initialSaldo: saldoAwal,
      };
    });
  }

  async getDashboardArusKas(
    userId: string,
    query: GetArusKasDashboardDto,
  ): Promise<ArusKasResponse[]> {
    const mesjidUserId: string = userId;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);

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

  async updateArusKasMasuk(
    user: Auth,
    payload: UpdateArusKasMasukDto,
    param: ArusKasParamDto,
  ): Promise<ArusKasResponse> {
    const data = await this.kasHelper.updateArusKasHelper(
      payload,
      user.id,
      param,
    );

    const arusKas = await this.prismaService.arus_Kas.update({
      where: {
        id: param.arusKasId,
      },
      data: data.updatePayload,
      select: this.kasHelper.arusKasSelectCondition('Masuk'),
    });

    if (!arusKas) {
      throw new HttpException('Arus Kas Gagal Diperbaruri', 500);
    }

    return this.kasHelper.toArusKasResponse(arusKas, 'Masuk');
  }

  async updateArusKasKeluar(
    user: Auth,
    payload: UpdateArusKasKeluarDto,
    param: ArusKasParamDto,
    buktiArusKas: Express.Multer.File,
  ): Promise<ArusKasResponse> {
    const data = await this.kasHelper.updateArusKasHelper(
      payload,
      user.id,
      param,
    );
    const oldBukti = await this.kasHelper.getOldArusKasFoto(param.arusKasId);

    return this.prismaService.$transaction(async (p) => {
      const arusKas = await p.arus_Kas.update({
        where: {
          id: param.arusKasId,
        },
        data: {
          ...data.updatePayload,
          namaPenerimaKeluar: data.nama,
          bukti: buktiArusKas.filename,
          path: buktiArusKas.path,
        },
        select: this.kasHelper.arusKasSelectCondition('Keluar'),
      });

      if (!arusKas) {
        throw new HttpException('Arus Kas Gagal Diperbaruri', 500);
      }

      if (oldBukti) {
        this.filesService.deleteSingleFile(oldBukti);
      }

      return this.kasHelper.toArusKasResponse(arusKas, 'Keluar');
    });
  }

  async deleteArusKas(
    user: Auth,
    payload: DeleteArusKasDto,
    param: ArusKasParamDto,
  ): Promise<void> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    const date = {
      bulan: payload.bulan,
      tahun: payload.tahun,
    };

    await this.kasHelper.checkKasOwner(mesjidId, param.kasId);
    await this.kasHelper.checkArusKasOwner(param.kasId, param.arusKasId);
    await this.kasHelper.verifyKategoriKas(param.arusKasId);
    await this.kasHelper.verifyTimeLineKas(date, param.arusKasId, param.kasId);

    const arusKas = await this.prismaService.arus_Kas.delete({
      where: {
        id: param.arusKasId,
      },
      select: {
        path: true,
      },
    });

    if (!arusKas) {
      throw new HttpException('Arus Kas Gagal Dihapus', 500);
    }

    if (arusKas.path) {
      this.filesService.deleteSingleFile(arusKas);
    }
  }

  async createKasMutasi(
    user: Auth,
    payload: CreateKasMutasiDto,
  ): Promise<KasMutasiResponse> {
    const { fromKasId, toKasId, jumlah, ...data } = payload;
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    const date = {
      bulan: data.bulan,
      tahun: data.tahun,
    };

    await this.kasHelper.checkKasOwner(mesjidId, fromKasId);
    await this.kasHelper.checkKasOwner(mesjidId, toKasId);

    const getArusKas = await this.getArusKas(user, fromKasId, date);
    const checkSaldo: number = getArusKas[getArusKas.length - 1]?.initialSaldo;
    const initialSaldo = await this.kasHelper.checkInitialSaldo(
      fromKasId,
      date,
    );

    if (
      (checkSaldo !== undefined ? checkSaldo : initialSaldo) - payload.jumlah <
      0
    ) {
      throw new BadRequestException('Saldo Tidak Cukup');
    }

    await this.prismaService.arus_Kas.createMany({
      data: [
        {
          kasId: fromKasId,
          status: 'Keluar',
          jumlah: jumlah,
          ...data,
        },
        {
          kasId: toKasId,
          status: 'Masuk',
          jumlah: jumlah,
          ...data,
        },
      ],
    });

    await this.prismaService.mutasi.create({
      data: {
        mesjidId,
        senderKasId: fromKasId,
        recipientKasId: toKasId,
        jumlah: jumlah,
        tanggal: data.tanggal,
        ...date,
      },
      select: {
        id: true,
      },
    });

    return {
      status: 'Masuk',
      ...data,
      nama: '',
      debit: jumlah,
      kredit: 0,
    };
  }

  async getKasMutasi(
    user: Auth,
    query: GetMutasiQueryDto,
  ): Promise<GetKasMutasiResponse[] | []> {
    const mesjidUserId: string = user.id;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);

    const mutasi = await this.prismaService.mutasi.findMany({
      where: {
        mesjidId,
      },
      take: query.takeCount || undefined,
      skip: (query.page - 1) * query.takeCount || undefined,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        jumlah: true,
        tanggal: true,
        bulan: true,
        tahun: true,
        senderKas: {
          select: {
            jenis: true,
            namaBank: true,
            namaRekening: true,
            nomorRekening: true,
          },
        },
        recipientKas: {
          select: {
            jenis: true,
            namaBank: true,
            namaRekening: true,
            nomorRekening: true,
          },
        },
      },
    });
    return mutasi.map((data) => ({
      jumlah: parseInt(String(data.jumlah)),
      tanggal: data.tanggal,
      bulan: data.bulan,
      tahun: data.tahun,
      pengirim: data.senderKas,
      penerima: data.recipientKas,
    }));
  }
}

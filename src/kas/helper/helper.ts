import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { PrismaService } from '../../common/prisma.service';
import {
  ArusKasResponse,
  ArusKasResult,
  KasResponse,
} from '../dto/response.dto';
import { MesjidService } from '../../mesjid/mesjid.service';
import { ArusKas } from '../dto/create-kas.dto';

@Injectable()
export class Helper {
  constructor(
    private prismaService: PrismaService,
    private mesjidService: MesjidService,
  ) {}

  private months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  createKasData(payload, mesjidId, type, fotoRek?) {
    return {
      id: `kas-${createId()}`,
      jenis: type,
      namaBank: payload.namaBank || '',
      namaRekening: payload.namaRek || '',
      nomorRekening: payload.nomorRek || '',
      fotoRekening: fotoRek?.filename || '',
      path: fotoRek?.path || '',
      mesjidId: mesjidId,
      rekapKasBulanan: {
        create: {
          totalKeluar: 0,
          totalMasuk: payload.saldoAwal,
          initialSaldo: payload.saldoAwal,
          bulan: payload.bulan,
          tahun: payload.tahun,
        },
      },
    };
  }

  // arusKasData(payload: ArusKas, kasId: string, status: string) {
  //   return {
  //     kasId: kasId,
  //     status: status,
  //     uraian: payload.uraian,
  //     metode: payload.metode,
  //     jumlah: payload.jumlah,
  //     tanggal: payload.tanggal,
  //     bulan: payload.bulan,
  //     tahun: payload.tahun,
  //   };
  // }

  // createArusKasMasukData(payload: CreateArusKasMasukDto, kasId: string) {
  //   return {
  //     ...this.arusKasData(payload, kasId, 'Masuk'),
  //     kategori: payload.kategori,
  //   };
  // }

  // createArusKasKeluarData(
  //   payload: CreateArusKasKeluarDto,
  //   kasId: string,
  //   buktiArus: Express.Multer.File,
  // ) {
  //   return {
  //     ...this.arusKasData(payload, kasId, 'Keluar'),
  //     kategori: payload.kategori,
  //     namaPenerimaKeluar: payload.nama,
  //     bukti: buktiArus.filename,
  //     path: buktiArus.path,
  //   };
  // }

  toKasResponse(kas): KasResponse {
    return {
      id: kas.id,
      jenis: kas.jenis,
      namaBank: kas.namaBank,
      namaRek: kas.namaRekening,
      nomorRek: kas.nomorRekening,
      saldoAwal: parseInt(kas.rekapKasBulanan['initialSaldo']),
      bulan: kas.rekapKasBulanan['bulan'],
      tahun: kas.rekapKasBulanan['tahun'],
    };
  }

  kasSelectConditions() {
    return {
      id: true,
      jenis: true,
      namaBank: true,
      namaRekening: true,
      nomorRekening: true,
    };
  }

  toArusKasResponse(arusKas: ArusKasResult, status: string): ArusKasResponse {
    return {
      id: arusKas.id,
      status: arusKas.status,
      kategori: arusKas.kategori,
      uraian: arusKas.uraian,
      metode: arusKas.metode,
      nama: arusKas.namaPenerimaKeluar || '',
      tanggal: arusKas.tanggal,
      bulan: arusKas.bulan,
      tahun: arusKas.tahun,
      debit: status === 'Masuk' ? Number(arusKas.jumlah) : 0,
      kredit: status === 'Keluar' ? Number(arusKas.jumlah) : 0,
    };
  }

  arusKasSelectCondition(status: string) {
    return {
      id: true,
      status: true,
      kategori: true,
      uraian: true,
      metode: true,
      namaPenerimaKeluar: status === 'Keluar' || undefined,
      tanggal: true,
      bulan: true,
      tahun: true,
      jumlah: true,
    };
  }

  async verifyRekeningBank(nomorRek: string): Promise<void> {
    const rekening = await this.prismaService.kas.count({
      where: {
        nomorRekening: nomorRek,
      },
    });

    if (rekening > 0) {
      throw new BadRequestException('Nomor Rekening Sudah Terdaftar');
    }
  }

  async checkKasOwner(mesjidId: number, kasId: string): Promise<void> {
    const kas: { mesjidId: number } = await this.prismaService.kas.findUnique({
      where: {
        id: kasId,
      },
      select: {
        mesjidId: true,
      },
    });

    if (!kas) {
      throw new NotFoundException('Kas Tidak Ditemukan');
    }

    if (kas.mesjidId !== mesjidId) {
      throw new HttpException('Kas Ini Bukan Milik Anda', 403);
    }
  }

  async createArusKasHelper(userId: string, kasId: string, payload: ArusKas) {
    const mesjidUserId: string = userId;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);
    await this.checkKasOwner(mesjidId, kasId);

    const { bulanKasAkhir, totalMasuk, totalKeluar } =
      await this.checkArusKasAkhir(kasId, payload.bulan);
    const currentMonthIndex = this.months.indexOf(bulanKasAkhir);
    const nextMonthIndex = (currentMonthIndex + 1) % 12;
    const currentMonth =
      nextMonthIndex > 12
        ? this.months[nextMonthIndex - 12]
        : this.months[nextMonthIndex];
    if (currentMonth === payload.bulan) {
      const { keluar, masuk } = await this.groupKas(
        kasId,
        bulanKasAkhir,
        payload.tahun,
      );
      await this.createRekapKas(
        kasId,
        payload.bulan,
        payload.tahun,
        masuk,
        keluar,
        parseInt(totalMasuk),
        parseInt(totalKeluar),
      );
    }
  }

  async checkArusKasOwner(kasId: string, arusKasId: number) {
    const arusKas = await this.prismaService.arus_Kas.findUnique({
      where: {
        id: arusKasId,
      },
      select: {
        kasId: true,
      },
    });

    if (!arusKas) {
      throw new NotFoundException('Arus Kas Tidak Ditemukan');
    }

    if (arusKas.kasId !== kasId) {
      throw new HttpException('Arus Kas Ini Bukan Milik Anda', 403);
    }
  }
  async checkArusKasAkhir(kasId, bulan) {
    const kas = await this.prismaService.kas.findUnique({
      where: {
        id: kasId,
      },
      select: {
        arusKas: {
          select: {
            bulan: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        rekapKasBulanan: {
          select: {
            totalKeluar: true,
            totalMasuk: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
    if (!kas.arusKas[0] || !kas.arusKas[0].bulan) {
      return bulan;
    }
    return {
      bulanKasAkhir: kas.arusKas[0].bulan,
      totalKeluar: kas.rekapKasBulanan[0].totalKeluar,
      totalMasuk: kas.rekapKasBulanan[0].totalMasuk,
    };
  }

  async groupKas(kasId: string, bulanKasAkhir, tahun: number) {
    const result = await this.prismaService.arus_Kas.groupBy({
      where: {
        kasId,
        bulan: bulanKasAkhir,
        tahun,
      },
      by: ['status'],
      _sum: {
        jumlah: true,
      },
    });
    const masuk = parseInt(
      String(result.find((item) => item.status === 'Masuk')?._sum?.jumlah) ||
        '0',
    );
    const keluar = parseInt(
      String(result.find((item) => item.status === 'Keluar')?._sum?.jumlah) ||
        '0',
    );
    const total = masuk - keluar;
    return {
      masuk,
      keluar,
      total,
    };
  }

  async createRekapKas(
    kasId: string,
    bulan: string,
    tahun: number,
    masuk: number,
    keluar: number,
    totalMasuk,
    totalKeluar,
  ) {
    const Masuk = masuk + totalMasuk;
    const Keluar = keluar + totalKeluar;
    const Initial = masuk + totalMasuk - (keluar + totalKeluar);
    const result = await this.prismaService.rekap_Kas_Bulanan.create({
      data: {
        kasId,
        bulan,
        tahun,
        totalMasuk: Masuk,
        totalKeluar: Keluar,
        initialSaldo: Initial,
      },
    });
    if (!result) {
      throw new HttpException('Rekap Kas Gagal Dibuat', 500);
    }
  }

  async getOldFotoRek(kasId: string): Promise<{ path: string }> {
    const kas = await this.prismaService.kas.findUnique({
      where: {
        id: kasId,
      },
      select: {
        path: true,
      },
    });
    return kas;
  }

  async verifyTimeLineKas(date, arusKasId, kasId) {
    const result = await this.prismaService.kas.findFirst({
      where: {
        id: kasId,
      },
      select: {
        arusKas: {
          where: {
            id: arusKasId,
          },
          select: {
            bulan: true,
            tahun: true,
          },
        },
      },
    });
    if (
      result.arusKas[0].bulan !== date.bulan ||
      result.arusKas[0].tahun !== date.tahun
    ) {
      throw new BadRequestException(
        'Kas yang dapat diubah hanya kas di bulan dan tahun ini',
      );
    }
    if (!result.arusKas[0]) {
      throw new NotFoundException('Arus Kas Tidak Ditemukan');
    }
  }

  async verifyKategoriKas(arusKasId: number): Promise<void> {
    const arusKas = await this.prismaService.arus_Kas.findUnique({
      where: {
        id: arusKasId,
      },
      select: {
        kategori: true,
      },
    });
    if (arusKas.kategori === 'Mutasi') {
      throw new BadRequestException(
        'Kategori Mutasi Tidak Boleh Diubah / Dihapus',
      );
    }
  }

  async getOldArusKasFoto(arusKasId: number): Promise<{ path: string }> {
    const arusKas = await this.prismaService.arus_Kas.findUnique({
      where: {
        id: arusKasId,
      },
      select: {
        path: true,
      },
    });
    return arusKas;
  }

  async checkInitialSaldo(kasId, { bulan, tahun }) {
    const rekapKasBulanan = await this.prismaService.rekap_Kas_Bulanan.findMany(
      {
        where: {
          kasId,
          bulan,
          tahun,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          initialSaldo: true,
        },
      },
    );
    return rekapKasBulanan.map((saldo) =>
      parseInt(String(saldo.initialSaldo)),
    )[0];
  }

  async updateArusKasHelper(payload, userId: string, param) {
    const {
      bulan = '',
      tahun = '',
      tanggal = '',
      nama = '',
      ...data
    } = payload;

    if (!bulan || !tahun) {
      throw new BadRequestException('Bulan Atau Tahun Tidak Boleh Kosong');
    }

    if (tanggal) {
      throw new BadRequestException('Tanggal Tidak Diizinkan');
    }

    const date = {
      bulan: payload.bulan,
      tahun: payload.tahun,
    };
    const mesjidUserId: string = userId;
    const mesjidId: number =
      await this.mesjidService.getMesjidIdByUserId(mesjidUserId);

    await this.checkKasOwner(mesjidId, param.kasId);
    await this.checkArusKasOwner(param.kasId, param.arusKasId);
    await this.verifyKategoriKas(param.arusKasId);
    await this.verifyTimeLineKas(date, param.arusKasId, param.kasId);

    return {
      updatePayload: data,
      nama: nama || undefined,
    };
  }
}

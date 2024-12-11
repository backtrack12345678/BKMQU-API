import { Injectable } from '@nestjs/common';
import {
  AlquranQuery,
  BankQuery,
  KecamatanQuery,
  MesjidQuery,
  PenceramahQuery,
} from './dto/get.dto';
import { Request } from 'express';
import { PrismaService } from '../common/prisma.service';
import { getHost } from '../common/utils/utils';
import {
  AlquranResponse,
  BankResponse,
  KategoriSedekahResponse,
  KecamatanResponse,
  MesjidResponse,
  PenceramahResponse,
} from './dto/response.dto';

@Injectable()
export class MasterService {
  constructor(private prismaService: PrismaService) {}

  async getMesjid(
    request: Request,
    query?: MesjidQuery,
  ): Promise<MesjidResponse[]> {
    const filters = query.location
      ? [
          {
            OR: [
              {
                kecamatan: {
                  nama: {
                    contains: query.location,
                  },
                },
              },
              {
                kota_kab: {
                  nama: {
                    contains: query.location,
                  },
                },
              },
            ],
          },
        ]
      : [];
    const mesjid = await this.prismaService.detail_User.findMany({
      where: {
        status: 'DITERIMA',
        user: {
          isVerified: true,
          role: 'mesjid',
        },
        AND: filters,
      },
      select: {
        nama: true,
        userId: true,
        user: {
          select: {
            mesjid: {
              select: {
                id: true,
                noRegister: true,
              },
            },
            photo: {
              select: {
                nama: true,
              },
            },
          },
        },
        alamat: true,
      },
    });

    return mesjid.map((m) => ({
      id: m.userId,
      mesjidId: m.user.mesjid.id,
      nama: m.nama,
      noRegister: m.user.mesjid.noRegister,
      alamat: m.alamat,
      photo: `${getHost(request)}/api/files/users/${m.user.photo.nama}`,
    }));
  }

  async getPenceramah(
    request: Request,
    query?: PenceramahQuery,
  ): Promise<PenceramahResponse[] | []> {
    const penceramah = await this.prismaService.user.findMany({
      where: {
        isVerified: true,
        role: 'penceramah',
        detailUser: {
          status: 'DITERIMA',
          nama: {
            contains: query.nama || undefined,
          },
        },
      },
      take: query.size,
      ...(query.cursor && {
        skip: 1,
        cursor: {
          id: query.cursor,
        },
      }),
      select: {
        id: true,
        detailUser: {
          select: {
            nama: true,
          },
        },
        penceramah: {
          select: {
            id: true,
            keahlian: true,
          },
        },
        photo: {
          select: {
            nama: true,
          },
        },
      },
    });

    return penceramah.map((p) => ({
      id: p.id,
      penceramahId: p.penceramah.id,
      nama: p.detailUser.nama,
      keahlian: p.penceramah.keahlian,
      photo: `${getHost(request)}/api/files/users/${p.photo.nama}`,
    }));
  }

  async getKecamatan(query: KecamatanQuery): Promise<KecamatanResponse[]> {
    return this.prismaService.kecamatan.findMany({
      ...(query.nama && {
        where: {
          OR: [
            {
              nama: {
                contains: query.nama,
              },
            },
            {
              kota_kab: {
                nama: {
                  contains: query.nama,
                },
              },
            },
          ],
        },
      }),
      take: !query.nama ? 10 : undefined,
      select: {
        id: true,
        kode: true,
        nama: true,
        kota_kab: {
          select: {
            nama: true,
          },
        },
        provinsi: {
          select: {
            nama: true,
          },
        },
      },
    });
  }

  async getBank(query: BankQuery): Promise<BankResponse[]> {
    return this.prismaService.bank.findMany({
      ...(query.nama && {
        where: {
          OR: [
            {
              nama: {
                contains: query?.nama,
              },
            },
            {
              kode: {
                contains: query?.nama,
              },
            },
          ],
        },
      }),
      select: {
        id: true,
        nama: true,
      },
    });
  }

  async getAlquran(
    query: AlquranQuery,
  ): Promise<AlquranResponse | AlquranResponse[]> {
    const result = await this.prismaService.surah.findMany({
      ...(query.surahId && {
        where: {
          id: query.surahId,
        },
        include: {
          ayat: true,
        },
      }),
    });
    return result[0].ayat ? result[0] : result;
  }

  async getKategoriSedekah(): Promise<KategoriSedekahResponse[]> {
    const result = await this.prismaService.kategori_Sedekah.findMany({
      select: {
        id: true,
        nama: true,
      },
    });
    return result.map((kategori) => ({
      kategoriId: kategori.id,
      nama: kategori.nama,
    }));
  }
}

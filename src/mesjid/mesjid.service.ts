import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePengurusStatusParamDto } from './dto/update-mesjid.dto';
import { PengurusQueryDto } from './dto/get.dto';
import { PrismaService } from '../common/prisma.service';
import { Auth } from '../model/user.model';
import { getHost } from '../common/utils/utils';
import { GetPengurusResponse } from './dto/response.dto';

@Injectable()
export class MesjidService {
  constructor(private prismaService: PrismaService) {}

  async checkPengurusOwner(
    mesjidUserId: string,
    pengurusUserId: string,
  ): Promise<void> {
    const pengurus = await this.prismaService.pengurus.findUnique({
      where: {
        userId: pengurusUserId,
      },
      select: {
        id: true,
        mesjid: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!pengurus) {
      throw new NotFoundException('Pengurus Tidak Ditemukan');
    }

    if (mesjidUserId !== pengurus.mesjid.userId) {
      throw new HttpException('Tidak Dapat Memverifikasi Pengurus Ini', 403);
    }
  }

  async findAllPengurus(
    request,
    query?: PengurusQueryDto,
  ): Promise<GetPengurusResponse[] | []> {
    const mesjidUserId: string = request.user.id;
    const filters = query.status
      ? [
          {
            user: {
              detailUser: {
                status: query.status === 'PENDING' ? 'DIPENDING' : query.status,
              },
            },
          },
        ]
      : [];

    const pengurus = await this.prismaService.pengurus.findMany({
      where: {
        mesjid: {
          userId: mesjidUserId,
        },
        AND: filters,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            detailUser: {
              select: {
                nama: true,
                status: true,
              },
            },
            photo: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });

    if (!pengurus) {
      throw new NotFoundException('Pengurus Tidak Ditemukan');
    }

    return pengurus.map((p) => ({
      id: p.id,
      userId: p.userId,
      nama: p.user.detailUser.nama,
      status: p.user.detailUser.status,
      photo: `${getHost(request)}/api/files/users/${p.user.photo.nama}`,
    }));
  }

  async updateStatusPengurus(
    user: Auth,
    param: UpdatePengurusStatusParamDto,
  ): Promise<void> {
    const mesjidUserId: string = user.id;
    await this.checkPengurusOwner(mesjidUserId, param.pengurusUserId);

    const update: { id: number } = await this.prismaService.detail_User.update({
      where: {
        userId: param.pengurusUserId,
      },
      data: {
        status: param.status,
        user: {
          update: {
            isVerified: param.status === 'DITERIMA',
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!update) {
      throw new HttpException('Gagal Memperbarui Status Pengurus', 500);
    }
  }

  async getMesjidIdByUserId(userId: string): Promise<number> {
    const mesjid = await this.prismaService.mesjid.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!mesjid) {
      throw new NotFoundException('Data Mesjid Tidak Ditemukan');
    }

    return mesjid.id;
  }
}

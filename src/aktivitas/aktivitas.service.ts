import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAktivitasDto } from './dto/create-aktivita.dto';
// import { UpdateAktivitaDto } from './dto/update-aktivita.dto';
import { PrismaService } from '../common/prisma.service';
import { Auth } from '../model/user.model';
import { AktivitasResponse, AktivitasResult } from './dto/response.dto';
import { getHost } from '../common/utils/utils';
import { Request } from 'express';
import { FilesService } from '../files/files.service';
import { GetAktivitasQueryDto } from './dto/query.dto';
import { NotificationService } from '../common/notification/notification.service';

@Injectable()
export class AktivitasService {
  constructor(
    private prismaService: PrismaService,
    private filesService: FilesService,
    private notificationService: NotificationService,
  ) {}

  toAktivitasResponse(
    aktivitas: AktivitasResult,
    host: string,
  ): AktivitasResponse {
    return {
      id: aktivitas.id,
      userId: aktivitas.userId,
      judul: aktivitas.judul,
      captions: aktivitas.captions,
      media: aktivitas.media.map(
        (m) => `${host}/api/files/aktivitas/media/${m.nama}`,
      ),
      dokumen: aktivitas.dokumen.map(
        (d) => `${host}/api/files/aktivitas/document/${d.nama}`,
      ),
      createdAt: aktivitas.createdAt,
    };
  }

  aktivitasSelectCondition() {
    return {
      id: true,
      userId: true,
      judul: true,
      captions: true,
      media: {
        select: {
          nama: true,
        },
      },
      dokumen: {
        select: {
          nama: true,
        },
      },
      createdAt: true,
    };
  }

  async checkAktivitasOwner(
    userId: string,
    aktivitasId: string,
  ): Promise<void> {
    const aktivitas: { userId: string } =
      await this.prismaService.aktivitas.findUnique({
        where: {
          id: aktivitasId,
        },
        select: {
          userId: true,
        },
      });

    if (!aktivitas) {
      throw new NotFoundException('Aktivitas Tidak Ditemukan');
    }

    if (aktivitas.userId !== userId) {
      throw new HttpException('Aktivitas Ini Bukan Milik Anda', 403);
    }
  }

  async createAktivitas(
    request,
    payload: CreateAktivitasDto,
    files?: { [fieldname: string]: Express.Multer.File[] },
  ): Promise<AktivitasResponse | any> {
    const media = files?.media
      ? await Promise.all(
          files.media.map(async (m) => {
            const { filename, url } = await this.filesService.uploadFileToAWS(
              m,
              'aktivitas',
            );
            return {
              nama: filename,
              path: url,
            };
          }),
        )
      : [];

    const dokumen = files?.dokumen
      ? await Promise.all(
          files.dokumen.map(async (d) => {
            const { filename, url } = await this.filesService.uploadFileToAWS(
              d,
              'aktivitas',
            );
            return {
              nama: filename,
              path: url,
            };
          }),
        )
      : [];

    const aktivitas = await this.prismaService.aktivitas.create({
      data: {
        userId: request.user.id,
        ...payload,
        media: {
          create: media,
        },
        dokumen: {
          create: dokumen,
        },
      },
      select: {
        ...this.aktivitasSelectCondition(),
        user: {
          select: {
            detailUser: {
              select: {
                nama: true,
              },
            },
            mesjid: {
              select: {
                jamaah: {
                  select: {
                    user: {
                      select: {
                        refreshToken: {
                          select: {
                            notificationToken: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const jamaahNotifToken =
      aktivitas.user.mesjid.jamaah.length === 0
        ? []
        : aktivitas.user.mesjid.jamaah
            .filter((j) => j.user.refreshToken !== null)
            .map((j) => j.user.refreshToken.notificationToken)
            .filter((token) => token !== null);

    if (jamaahNotifToken.length > 0) {
      const notificationOptions = {
        aktivitasId: aktivitas.id,
        mesjid: aktivitas.user.detailUser.nama,
      };
      await this.notificationService.aktivitas(
        jamaahNotifToken,
        notificationOptions,
      );
    }

    return this.toAktivitasResponse(aktivitas, getHost(request));
  }

  async findAllAktivitas(
    request: any,
    query: GetAktivitasQueryDto,
    type: string,
    userId?: string,
  ): Promise<AktivitasResponse[] | []> {
    const aktivitas: AktivitasResult[] | [] =
      await this.prismaService.aktivitas.findMany({
        where: {
          userId: userId || undefined,
        },
        take: query.size,
        orderBy: { createdAt: 'desc' },
        ...(query.cursor && {
          skip: 1,
          cursor: {
            id: query.cursor,
          },
        }),
        select: this.aktivitasSelectCondition(),
      });

    return aktivitas.map((a) => this.toAktivitasResponse(a, getHost(request)));
  }

  async findOneAktivitas(
    id: string,
    request: Request,
  ): Promise<AktivitasResponse> {
    const aktivitas: AktivitasResult =
      await this.prismaService.aktivitas.findUnique({
        where: {
          id: id,
        },
        select: this.aktivitasSelectCondition(),
      });

    if (!aktivitas) {
      throw new NotFoundException('Aktivitas Tidak Ditemukan');
    }

    return this.toAktivitasResponse(aktivitas, getHost(request));
  }

  // update(id: number, updateAktivitaDto: UpdateAktivitaDto) {
  //   return `This action updates a #${id} aktivita`;
  // }

  async removeAktivitas(user: Auth, id: string): Promise<void> {
    await this.checkAktivitasOwner(user.id, id);

    const aktivitas = await this.prismaService.aktivitas.delete({
      where: {
        id: id,
      },
      select: {
        media: {
          select: {
            path: true,
            nama: true,
          },
        },
        dokumen: {
          select: {
            path: true,
            nama: true,
          },
        },
      },
    });

    if (aktivitas.media.length > 0) {
      try {
        await Promise.all(
          aktivitas.media.map((am) =>
            this.filesService.deleteFileFromAWS(am.nama, 'aktivitas'),
          ),
        );
      } catch (error) {
        console.error('Gagal menghapus salah satu file:', error);
      }
    }

    if (aktivitas.dokumen.length > 0) {
      try {
        await Promise.all(
          aktivitas.dokumen.map((ad) =>
            this.filesService.deleteFileFromAWS(ad.nama, 'aktivitas'),
          ),
        );
      } catch (error) {
        console.error('Gagal menghapus salah satu file:', error);
      }
    }
  }
}

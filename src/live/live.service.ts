import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLiveDto } from './dto/create-live.dto';
import { UpdateLiveDto } from './dto/update-live.dto';
import { Auth } from '../model/user.model';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { getHost } from '../common/utils/utils';
import { GetLiveQueryDto } from './dto/query..dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class LiveService {
  constructor(
    private prismaService: PrismaService,
    private filesService: FilesService,
  ) {}

  liveSelectCondition = {
    id: true,
    userId: true,
    link: true,
    mulai: true,
    selesai: true,
    createdAt: true,
    thumbnail: {
      select: {
        nama: true,
        path: true,
      },
    },
  };

  toLiveResponse(live, request) {
    return {
      id: live.id,
      userId: live.userId,
      link: live.link,
      mulai: live.mulai,
      selesai: live.selesai,
      thumbnail: `${getHost(request)}/api/files/kajian/${live.thumbnail.nama}`,
      createdAt: live.createdAt,
    };
  }

  async checkLiveOwner(userId: string, liveId: string): Promise<void> {
    const live = await this.prismaService.live.findUnique({
      where: {
        id: liveId,
      },
      select: {
        userId: true,
      },
    });

    if (!live) {
      throw new NotFoundException('Siaran Langsung Tidak Ditemukan');
    }

    if (userId !== live.userId) {
      throw new HttpException('Kajian Ini Bukan Milik Anda', 403);
    }
  }

  async createLive(
    request: any,
    payload: CreateLiveDto,
    thumbnail: Express.Multer.File,
  ) {
    const user: Auth = request.user;
    const live = await this.prismaService.live.create({
      data: {
        id: `live-${uuid().toString()}`,
        userId: user.id,
        ...payload,
        thumbnail: {
          create: {
            nama: thumbnail.filename,
            path: thumbnail.path,
          },
        },
      },
      select: this.liveSelectCondition,
    });

    return this.toLiveResponse(live, request);
  }

  async findAllLives(
    request: any,
    query: GetLiveQueryDto,
    type: string,
    userId?: string,
  ) {
    const lives = await this.prismaService.live.findMany({
      where: {
        userId: userId || undefined, // jika ada userId atau kredensial
      },
      take: query.size,
      orderBy: { mulai: 'asc' },
      skip: query.cursor ? 1 : undefined,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      select: this.liveSelectCondition,
    });

    return lives.map((live) => this.toLiveResponse(live, request));
  }

  async findOneLive(request: any, liveId: string) {
    const live = await this.prismaService.live.findUnique({
      where: {
        id: liveId,
      },
      select: this.liveSelectCondition,
    });

    if (!live) {
      throw new NotFoundException('Siaran Langsung Tidak Ditemukan');
    }

    return this.toLiveResponse(live, request);
  }

  updateLive(id: number, updateLiveDto: UpdateLiveDto) {
    return `This action updates a #${id} live`;
  }

  async removeLive(user: Auth, liveId: string) {
    await this.checkLiveOwner(user.id, liveId);

    const live = await this.prismaService.live.delete({
      where: {
        id: liveId,
      },
      select: {
        thumbnail: {
          select: {
            path: true,
          },
        },
      },
    });

    this.filesService.deleteSingleFile(live.thumbnail);
  }
}

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateKajianContentDto,
  CreateKajianDto,
} from './dto/create-kajian.dto';
import {
  UpdateKajianContentDto,
  UpdateKajianDto,
} from './dto/update-kajian.dto';
import { Auth } from '../model/user.model';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { getHost } from '../common/utils/utils';
import { Request } from 'express';
import {
  KajianContentResponse,
  KajianContentResult,
  KajianResponse,
  KajianResult,
} from './dto/response.dto';
import { FilesService } from '../files/files.service';
import { GetKajianContentsQueryDto, GetKajianQueryDto } from './dto/query.dto';
import { TimeSort } from '../common/enum/sort.enum';
import { KajianContentParam } from './dto/param.dto';

@Injectable()
export class KajianService {
  constructor(
    private prismaService: PrismaService,
    private filesService: FilesService,
  ) {}

  kajianSelectCondition = {
    id: true,
    userId: true,
    judul: true,
    deskripsi: true,
    createdAt: true,
    thumbnail: {
      select: {
        nama: true,
        path: true,
      },
    },
  };

  toKajianResponse(kajian: KajianResult, request: Request): KajianResponse {
    return {
      id: kajian.id,
      userId: kajian.userId,
      judul: kajian.judul,
      deskripsi: kajian.deskripsi,
      thumbnail: `${getHost(request)}/api/files/kajian/${kajian.thumbnail.nama}`,
      createdAt: kajian.createdAt,
    };
  }

  kajianContentSelectCondition = {
    id: true,
    kajianId: true,
    judul: true,
    captions: true,
    createdAt: true,
    kajian: {
      select: {
        userId: true,
      },
    },
    media: {
      select: {
        nama: true,
        path: true,
      },
    },
    thumbnail: {
      select: {
        nama: true,
        path: true,
      },
    },
  };

  toKajianContentResponse(
    kajianContent: KajianContentResult,
    request: Request,
  ): KajianContentResponse {
    return {
      id: kajianContent.id,
      kajianId: kajianContent.kajianId,
      userId: kajianContent.kajian.userId,
      judul: kajianContent.judul,
      captions: kajianContent.captions,
      thumbnail: `${getHost(request)}/api/files/kajian/${kajianContent.thumbnail.nama}`,
      media: `${getHost(request)}/api/files/kajian/${kajianContent.media.nama}`,
      createdAt: kajianContent.createdAt,
    };
  }

  async checkKajianOwner(userId: string, kajianId: string): Promise<void> {
    const kajian = await this.prismaService.kajian.findUnique({
      where: {
        id: kajianId,
      },
      select: {
        userId: true,
      },
    });

    if (!kajian) {
      throw new NotFoundException('Kajian Tidak Ditemukan');
    }

    if (userId !== kajian.userId) {
      throw new HttpException('Kajian Ini Bukan Milik Anda', 403);
    }
  }

  async checkKajianContentOwner(
    userId: string,
    kajianId: string,
    kajianContentId: string,
  ) {
    const kajianContent = await this.prismaService.kajian_Konten.findUnique({
      where: {
        id: kajianContentId,
      },
      select: {
        kajian: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!kajianContent) {
      throw new NotFoundException('Konten Kajian Tidak Ditemukan');
    }

    if (
      userId !== kajianContent.kajian.userId ||
      kajianId !== kajianContent.kajian.id
    ) {
      throw new HttpException('Konten Kajian Ini Bukan Milik Anda', 403);
    }
  }

  async getOldThumbnail(kajianId: string): Promise<{ path: string }> {
    const kajian = await this.prismaService.kajian.findUnique({
      where: {
        id: kajianId,
      },
      select: {
        thumbnail: {
          select: {
            path: true,
          },
        },
      },
    });

    if (!kajian) {
      throw new NotFoundException('Kajian Tidak Ditemukan');
    }

    return kajian.thumbnail;
  }

  async getKajianContentFile(
    kajianContentId: string,
    type: string = 'all',
  ): Promise<{ [fieldname: string]: { path: string } | null }> {
    const selectCondition: any = {};

    if (type === 'media' || type === 'all') {
      selectCondition.media = { select: { path: true } };
    }
    if (type === 'thumbnail' || type === 'all') {
      selectCondition.thumbnail = { select: { path: true } };
    }

    const kajianContent = await this.prismaService.kajian_Konten.findUnique({
      where: {
        id: kajianContentId,
      },
      select: selectCondition,
    });

    if (!kajianContent) {
      throw new NotFoundException('Konten Kajian Tidak Ditemukan');
    }

    return kajianContent;
  }

  async createKajian(
    request: any,
    payload: CreateKajianDto,
    thumbnail: Express.Multer.File,
  ): Promise<KajianResponse> {
    const user: Auth = request.user;
    const kajian: KajianResult = await this.prismaService.kajian.create({
      data: {
        id: `kajian-${uuid().toString()}`,
        userId: user.id,
        ...payload,
        thumbnail: {
          create: {
            nama: thumbnail.filename,
            path: thumbnail.path,
          },
        },
      },
      select: this.kajianSelectCondition,
    });

    return this.toKajianResponse(kajian, request);
  }

  async findAllKajian(
    request: any,
    query: GetKajianQueryDto,
    type: string,
    userId?: string,
  ): Promise<KajianResponse[] | []> {
    const kajian = await this.prismaService.kajian.findMany({
      where: {
        userId: userId || undefined, // jika ada userId atau kredensial
      },
      take: query.size,
      orderBy: { createdAt: 'desc' },
      skip: query.cursor ? 1 : undefined,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      select: this.kajianSelectCondition,
    });

    return kajian.map((k) => this.toKajianResponse(k, request));
  }

  async findOneKajian(request: any, kajianId: string): Promise<KajianResponse> {
    const kajian: KajianResult = await this.prismaService.kajian.findUnique({
      where: {
        id: kajianId,
      },
      select: this.kajianSelectCondition,
    });

    if (!kajian) {
      throw new NotFoundException('Kajian Tidak Ditemukan');
    }

    return this.toKajianResponse(kajian, request);
  }

  async updateKajian(
    request: any,
    kajianId: string,
    payload: UpdateKajianDto,
    thumbnail?: Express.Multer.File,
  ): Promise<KajianResponse> {
    const user: Auth = request.user;
    await this.checkKajianOwner(user.id, kajianId);

    const oldThumbnail = thumbnail ? await this.getOldThumbnail(kajianId) : '';

    const kajian: KajianResult = await this.prismaService.kajian.update({
      where: {
        id: kajianId,
      },
      data: {
        ...payload,
        ...(thumbnail && {
          thumbnail: {
            update: {
              where: {
                kajianId: kajianId,
              },
              data: {
                nama: thumbnail.filename,
                path: thumbnail.path,
              },
            },
          },
        }),
      },
      select: this.kajianSelectCondition,
    });

    if (oldThumbnail) {
      this.filesService.deleteSingleFile(oldThumbnail);
    }

    return this.toKajianResponse(kajian, request);
  }

  async removeKajian(user: Auth, kajianId: string): Promise<void> {
    await this.checkKajianOwner(user.id, kajianId);

    const kajian = await this.prismaService.kajian.delete({
      where: {
        id: kajianId,
      },
      select: {
        ...this.kajianSelectCondition,
        contents: {
          select: {
            media: { select: { path: true } },
            thumbnail: { select: { path: true } },
          },
        },
      },
    });

    this.filesService.deleteSingleFile(kajian.thumbnail);

    if (kajian.contents.length > 0) {
      const mediaPaths: { path: string }[] = kajian.contents?.map(
        (content) => ({
          path: content.media.path,
        }),
      );
      this.filesService.deleteMultiFiles(mediaPaths);
      const thumbnailPaths: { path: string }[] = kajian.contents?.map(
        (content) => ({
          path: content.thumbnail.path,
        }),
      );
      this.filesService.deleteMultiFiles(thumbnailPaths);
    }
  }

  async createKajianContent(
    request: any,
    kajianId: string,
    payload: CreateKajianContentDto,
    files: { media: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ): Promise<KajianContentResponse> {
    const user: Auth = request.user;
    await this.checkKajianOwner(user.id, kajianId);

    const kajianContent: KajianContentResult =
      await this.prismaService.kajian_Konten.create({
        data: {
          kajianId: kajianId,
          ...payload,
          media: {
            create: {
              nama: files.media[0].filename,
              path: files.media[0].path,
            },
          },
          thumbnail: {
            create: {
              nama: files.thumbnail[0].filename,
              path: files.thumbnail[0].path,
            },
          },
        },
        select: this.kajianContentSelectCondition,
      });

    return this.toKajianContentResponse(kajianContent, request);
  }

  async findAllKajianContents(
    request: Request,
    kajianId: string,
    query?: GetKajianContentsQueryDto,
  ): Promise<KajianContentResponse[] | []> {
    const kajianContents = await this.prismaService.kajian_Konten.findMany({
      where: {
        kajianId: kajianId,
      },
      take: query.size,
      orderBy: { createdAt: TimeSort[query.timeSort] },
      skip: query.cursor ? 1 : undefined,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      select: this.kajianContentSelectCondition,
    });

    return kajianContents.map((content) =>
      this.toKajianContentResponse(content, request),
    );
  }

  async findOneKajianContent(
    request: Request,
    param: KajianContentParam,
  ): Promise<KajianContentResponse> {
    const kajianContent = await this.prismaService.kajian_Konten.findUnique({
      where: {
        id: param.kajianContentId,
        kajianId: param.kajianId,
      },
      select: this.kajianContentSelectCondition,
    });

    if (!kajianContent) {
      throw new NotFoundException('Kontent Kajian Tidak Ditemukan');
    }

    return this.toKajianContentResponse(kajianContent, request);
  }

  async updateKajianContent(
    request: any,
    payload: UpdateKajianContentDto,
    param: KajianContentParam,
    files?: {
      media?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    const user: Auth = request.user;
    await this.checkKajianContentOwner(
      user.id,
      param.kajianId,
      param.kajianContentId,
    );

    const oldMedia = files?.media
      ? await this.getKajianContentFile(param.kajianContentId, 'media')
      : '';
    const oldThumbnail = files?.thumbnail
      ? await this.getKajianContentFile(param.kajianContentId, 'thumbnail')
      : '';

    const updateData: any = { ...payload };

    if (files?.media) {
      updateData.media = {
        update: {
          nama: files.media[0].filename,
          path: files.media[0].path,
        },
      };
    }

    if (files?.thumbnail) {
      updateData.thumbnail = {
        update: {
          nama: files.thumbnail[0].filename,
          path: files.thumbnail[0].path,
        },
      };
    }

    const kajianContent = await this.prismaService.kajian_Konten.update({
      where: {
        id: param.kajianContentId,
      },
      data: updateData,
      select: this.kajianContentSelectCondition,
    });

    if (oldMedia) {
      this.filesService.deleteSingleFile(oldMedia.media);
    }
    if (oldThumbnail) {
      this.filesService.deleteSingleFile(oldThumbnail.thumbnail);
    }

    return this.toKajianContentResponse(kajianContent, request);
  }

  async removeKajianContent(user: Auth, param: KajianContentParam) {
    await this.checkKajianContentOwner(
      user.id,
      param.kajianId,
      param.kajianContentId,
    );

    const kajianContent = await this.prismaService.kajian_Konten.delete({
      where: { id: param.kajianContentId },
      select: {
        media: { select: { path: true } },
        thumbnail: { select: { path: true } },
      },
    });

    this.filesService.deleteSingleFile(kajianContent.media);
    this.filesService.deleteSingleFile(kajianContent.thumbnail);
  }
}

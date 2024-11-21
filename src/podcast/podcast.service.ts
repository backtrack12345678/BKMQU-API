import { Injectable } from '@nestjs/common';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { PrismaService } from '../common/prisma.service';
import { v4 as uuid } from 'uuid';
import { Auth } from '../model/user.model';
import { getHost } from '../common/utils/utils';
import { Request } from 'express';

@Injectable()
export class PodcastService {
  constructor(private prismaService: PrismaService) {}

  podcastSelectCondtion = {
    id: true,
    userId: true,
    judul: true,
    captions: true,
    createdAt: true,
    thumbnail: {
      select: {
        nama: true,
      },
    },
    video: {
      select: {
        nama: true,
      },
    },
  };

  toPodcastResponse(podcast: PodcastResult, request): PodcastResponse {
    return {
      id: podcast.id,
      userId: podcast.userId,
      judul: podcast.judul,
      captions: podcast.captions,
      thumbnail: `${getHost(request)}/api/files/podcast/${podcast.thumbnail.nama}`,
      video: `${getHost(request)}/api/files/podcast/${podcast.video.nama}`,
      createdAt: podcast.createdAt,
    };
  }

  async createPodcast(
    request: any,
    payload: CreatePodcastDto,
    files: { thumbnail: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    const user: Auth = request.user;
    const podcast: PodcastResult = await this.prismaService.podcast.create({
      data: {
        id: `podcast-${uuid().toString()}`,
        userId: user.id,
        ...payload,
        video: {
          create: {
            nama: files.video[0].filename,
            path: files.video[0].path,
          },
        },
        thumbnail: {
          create: {
            nama: files.thumbnail[0].filename,
            path: files.thumbnail[0].path,
          },
        },
      },
      select: this.podcastSelectCondtion,
    });

    return this.toPodcastResponse(podcast, request);
  }

  findAll() {
    return `This action returns all podcast`;
  }

  findOnePodcast(request: Request, podcastId: string) {
    // return `This action returns a #${id} podcast`;
  }

  update(id: number, updatePodcastDto: UpdatePodcastDto) {
    return `This action updates a #${id} podcast`;
  }

  remove(id: number) {
    return `This action removes a #${id} podcast`;
  }
}

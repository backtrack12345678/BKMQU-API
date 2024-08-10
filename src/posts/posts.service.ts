import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../common/prisma.service';
import { PostResponse, PostResult } from './dto/response.dto';
import { getHost } from '../common/utils/utils';
import { Request } from 'express';
import { GetPostsQueryDto } from './dto/get.dto';
import { Auth } from '../model/user.model';
import { FilesService } from '../files/files.service';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private filesService: FilesService,
  ) {}

  toPostResponse(post: PostResult, host: string): PostResponse {
    return {
      id: post.id,
      userId: post.userId,
      captions: post.captions,
      media: post.media.map((m) => ({
        url: `${host}/api/files/posts/${m.nama}`,
        type: m.type,
      })),
      createdAt: post.createdAt,
    };
  }

  postSelectCondition() {
    return {
      id: true,
      userId: true,
      captions: true,
      createdAt: true,
      media: {
        select: {
          nama: true,
          type: true,
        },
      },
    };
  }

  async checkPostOwner(userId, postId): Promise<void> {
    const post: { userId: string } = await this.prismaService.posts.findUnique({
      where: {
        id: postId,
      },
      select: {
        userId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Postingan Tidak Ditemukan');
    }

    if (post.userId !== userId) {
      throw new HttpException('Postingan Ini Bukan Milik Anda', 403);
    }
  }

  async createPost(
    request,
    payload: CreatePostDto,
    media: Express.Multer.File[] | undefined,
  ): Promise<PostResponse> {
    if (Object.keys(payload).length === 0 && !media) {
      throw new BadRequestException(['Payload Cannot Be Empty']);
    }

    const post: PostResult = await this.prismaService.posts.create({
      data: {
        userId: request.user.id,
        ...payload,
        ...(media &&
          media.length > 0 && {
            media: {
              create: media.map((m) => ({
                nama: m.filename,
                path: m.path,
                type: m.mimetype,
              })),
            },
          }),
      },
      select: this.postSelectCondition(),
    });

    if (!post) {
      throw new HttpException('Postingan Gagal Dibuat', 500);
    }

    return this.toPostResponse(post, getHost(request));
  }

  async findAllPosts(
    query: GetPostsQueryDto,
    request: Request,
    type: string,
    userId?: string,
  ): Promise<PostResponse[] | []> {
    const posts: PostResult[] = await this.prismaService.posts.findMany({
      where: {
        userId: userId || undefined, //jika ada userId atau kredensial
      },
      take: query.size,
      orderBy: { createdAt: 'desc' },
      ...(query.cursor && {
        skip: 1,
        cursor: {
          id: query.cursor,
        },
      }),
      select: this.postSelectCondition(),
    });

    return posts.map((post) => this.toPostResponse(post, getHost(request)));
  }

  async findOnePost(id: string, request: Request): Promise<PostResponse> {
    const post = await this.prismaService.posts.findUnique({
      where: {
        id: id,
      },
      select: this.postSelectCondition(),
    });

    if (!post) {
      throw new NotFoundException('Postingan Tidak Ditemukan');
    }

    return this.toPostResponse(post, getHost(request));
  }

  // update(id: string, updatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  async removePost(user: Auth, id: string): Promise<void> {
    await this.checkPostOwner(user.id, id);

    const post = await this.prismaService.posts.delete({
      where: {
        id: id,
      },
      select: {
        media: {
          select: {
            path: true,
          },
        },
      },
    });

    if (post.media.length > 0) {
      this.filesService.deleteMultiFiles(post.media);
    }
  }
}

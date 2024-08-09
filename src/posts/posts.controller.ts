import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
  Req,
  Query,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Auth } from '../common/auth.decorator';
import { Role } from '../common/role/role.enum';
import { Roles } from '../common/role/role.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { WebResponse } from '../model/web.model';
import { PostResponse } from './dto/response.dto';
import { Request } from 'express';
import { GetPostsQueryDto } from './dto/get.dto';
import { FileTypesValidator } from '../common/pipes/file-types.validator';

const allowedMimeTypes = {
  media: ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4'],
};

@Controller('/api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @Roles(Role.MESJID, Role.PENCERAMAH)
  @UseInterceptors(
    FilesInterceptor('media', Infinity, {
      dest: './uploads/posts',
    }),
  )
  async createPost(
    @Req() request,
    @Body() payload: CreatePostDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build({
          fileIsRequired: false,
        }),
    )
    media?: Express.Multer.File[],
  ): Promise<WebResponse<PostResponse>> {
    const result = await this.postsService.createPost(request, payload, media);
    return {
      status: 'success',
      message: 'Postingan Berhasil Dibuat',
      data: result,
    };
  }

  @Get()
  async findAllPosts(
    @Req() request: Request,
    @Query() query: GetPostsQueryDto,
  ): Promise<WebResponse<PostResponse[]>> {
    const result = await this.postsService.findAllPosts(
      query,
      request,
      'public',
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:id')
  async findOnePost(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<WebResponse<PostResponse>> {
    const result = await this.postsService.findOnePost(id, request);
    return {
      status: 'success',
      data: result,
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(id, updatePostDto);
  // }

  @Delete('/:id')
  @Auth()
  @Roles(Role.MESJID, Role.PENCERAMAH)
  async remove(
    @Param('id') id: string,
    @Req() request,
  ): Promise<WebResponse<boolean>> {
    await this.postsService.removePost(request.user, id);
    return {
      status: 'success',
      message: 'Postingan Berhasil Dihapus',
      data: true,
    };
  }
}

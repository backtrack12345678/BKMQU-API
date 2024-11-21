import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { Request } from 'express';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesTypeValidator } from '../common/pipes/files-type.validator';

const allowedMimeTypes = {
  thumbnail: ['image/png', 'image/jpg', 'image/jpeg'],
  video: ['video/mp4'],
};

@Controller('/api/podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post('/')
  @Auth()
  @Roles(Role.ADMIN)
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        dest: './uploads/podcast',
      },
    ),
  )
  async create(
    @Req() request,
    @Body() payload: CreatePodcastDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new FilesTypeValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    files: { thumbnail: Express.Multer.File[]; video: Express.Multer.File[] },
  ) {
    const result = await this.podcastService.createPodcast(
      request,
      payload,
      files,
    );
    return {
      status: 'success',
      message: 'Podcast Berhasil Dibuat',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.podcastService.findAll();
  }

  @Get('/:podcastId')
  findOneKajian(
    @Req() request: Request,
    @Param('podcastId') podcastId: string,
  ) {
    return this.podcastService.findOnePodcast(request, podcastId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePodcastDto: UpdatePodcastDto) {
    return this.podcastService.update(+id, updatePodcastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastService.remove(+id);
  }
}

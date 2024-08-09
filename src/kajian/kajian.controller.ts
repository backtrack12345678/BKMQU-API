import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
  Query,
  UploadedFiles,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { KajianService } from './kajian.service';
import {
  CreateKajianContentDto,
  CreateKajianDto,
} from './dto/create-kajian.dto';
import {
  UpdateKajianContentDto,
  UpdateKajianDto,
} from './dto/update-kajian.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { WebResponse } from '../model/web.model';
import { KajianContentResponse, KajianResponse } from './dto/response.dto';
import { GetKajianContentsQueryDto, GetKajianQueryDto } from './dto/query.dto';
import { Request } from 'express';
import { KajianContentParam } from './dto/param.dto';
import { FileTypesValidator } from '../common/pipes/file-types.validator';

const allowedMimeTypes = {
  thumbnail: ['image/png', 'image/jpg', 'image/jpeg'],
  media: ['video/mp4'],
};

@Controller('/api/kajian')
export class KajianController {
  constructor(private readonly kajianService: KajianService) {}

  @Post('/')
  @Auth()
  @Roles(Role.PENCERAMAH)
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      dest: './uploads/kajian',
    }),
  )
  async createKajian(
    @Req() request: any,
    @Body() payload: CreateKajianDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    thumbnail: Express.Multer.File,
  ): Promise<WebResponse<KajianResponse>> {
    const result: KajianResponse = await this.kajianService.createKajian(
      request,
      payload,
      thumbnail,
    );
    return {
      status: 'success',
      message: 'Kajian Berhasil Dibuat',
      data: result,
    };
  }

  @Get('/')
  async findAllKajian(
    @Req() request: any,
    @Query() query?: GetKajianQueryDto,
  ): Promise<WebResponse<KajianResponse[] | []>> {
    const result = await this.kajianService.findAllKajian(
      request,
      query,
      'public',
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:kajianId')
  async findOneKajian(
    @Req() request: any,
    @Param('kajianId') kajianId: string,
  ): Promise<WebResponse<KajianResponse>> {
    const result: KajianResponse = await this.kajianService.findOneKajian(
      request,
      kajianId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:kajianId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      dest: './uploads/kajian',
    }),
  )
  async updateKajian(
    @Req() request: any,
    @Param('kajianId') kajianId: string,
    @Body() payload: UpdateKajianDto,
    @UploadedFile(
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
    thumbnail?: Express.Multer.File,
  ): Promise<WebResponse<KajianResponse>> {
    const result = await this.kajianService.updateKajian(
      request,
      kajianId,
      payload,
      thumbnail,
    );
    return {
      status: 'success',
      message: 'Kajian Berhasil Diperbarui',
      data: result,
    };
  }

  @Delete('/:kajianId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  async removeKajian(
    @Req() request: any,
    @Param('kajianId') kajianId: string,
  ): Promise<WebResponse<boolean>> {
    await this.kajianService.removeKajian(request.user, kajianId);
    return {
      status: 'success',
      message: 'Kajian Berhasil Dihapus',
      data: true,
    };
  }

  @Post('/:kajianId/contents')
  @Auth()
  @Roles(Role.PENCERAMAH)
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'media', maxCount: 1 },
      ],
      {
        dest: './uploads/kajian',
      },
    ),
  )
  async createKajianContent(
    @Req() request: any,
    @Param('kajianId') kajianId: string,
    @Body() payload: CreateKajianContentDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    files: { media: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ) {
    const result = await this.kajianService.createKajianContent(
      request,
      kajianId,
      payload,
      files,
    );
    return {
      status: 'success',
      message: 'Konten Kajian Berhasil Dibuat',
      data: result,
    };
  }

  @Get('/:kajianId/contents')
  async findAllKajianContents(
    @Req() request: Request,
    @Param('kajianId') kajianId: string,
    @Query() query?: GetKajianContentsQueryDto,
  ): Promise<WebResponse<KajianContentResponse[] | []>> {
    const result = await this.kajianService.findAllKajianContents(
      request,
      kajianId,
      query,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:kajianId/contents/:kajianContentId')
  async findOneKajianContent(
    @Req() request: Request,
    @Param() param: KajianContentParam,
  ): Promise<WebResponse<KajianContentResponse>> {
    const result = await this.kajianService.findOneKajianContent(
      request,
      param,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:kajianId/contents/:kajianContentId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'media', maxCount: 1 },
      ],
      {
        dest: './uploads/kajian',
      },
    ),
  )
  async updateKajianContent(
    @Req() request: any,
    @Param() param: KajianContentParam,
    @Body() payload: UpdateKajianContentDto,
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
    files: { media?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ): Promise<WebResponse<KajianContentResponse>> {
    const result = await this.kajianService.updateKajianContent(
      request,
      payload,
      param,
      files,
    );
    return {
      status: 'success',
      message: 'Konten Kajian Berhasil Diperbarui',
      data: result,
    };
  }

  @Delete('/:kajianId/contents/:kajianContentId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  async removeKajianContent(
    @Req() request: any,
    @Param() param: KajianContentParam,
  ): Promise<WebResponse<true>> {
    await this.kajianService.removeKajianContent(request.user, param);
    return {
      status: 'success',
      message: 'Konten Kajian Berhasil DiHapus',
      data: true,
    };
  }
}

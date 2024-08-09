import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  UploadedFiles,
  Req,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { AktivitasService } from './aktivitas.service';
import { CreateAktivitasDto } from './dto/create-aktivita.dto';
// import { UpdateAktivitaDto } from './dto/update-aktivita.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { WebResponse } from '../model/web.model';
import { AktivitasResponse } from './dto/response.dto';
import { Request } from 'express';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { FileTypesValidator } from '../common/pipes/file-types.validator';

const allowedMimeTypes = {
  media: ['image/png', 'image/jpg', 'image/jpeg'],
  dokumen: ['application/pdf'],
};

@Controller('/api/aktivitas')
export class AktivitasController {
  constructor(private readonly aktivitasService: AktivitasService) {}

  @Post()
  @Auth()
  @Roles(Role.MESJID, Role.PENCERAMAH)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'media' }, { name: 'dokumen' }], {
      dest: './uploads/aktivitas',
    }),
  )
  @HttpCode(201)
  async createAktivitas(
    @Body() payload: CreateAktivitasDto,
    @Req() request,
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
    files?: { media?: Express.Multer.File[]; dokumen?: Express.Multer.File[] },
  ): Promise<WebResponse<AktivitasResponse>> {
    const result: AktivitasResponse =
      await this.aktivitasService.createAktivitas(request, payload, files);
    return {
      status: 'success',
      message: 'Aktivitas Berhasil Dibuat',
      data: result,
    };
  }

  // @Get()
  // findAll() {
  //   return this.aktivitasService.findAll();
  // }

  @Get('/:id')
  async findOneAktivitas(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<WebResponse<AktivitasResponse>> {
    const result = await this.aktivitasService.findOneAktivitas(id, request);
    return {
      status: 'success',
      data: result,
    };
  }

  // @Patch('/:id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAktivitaDto: UpdateAktivitaDto,
  // ) {
  //   return this.aktivitasService.update(+id, updateAktivitaDto);
  // }

  @Delete('/:id')
  @Auth()
  @Roles(Role.MESJID, Role.PENCERAMAH)
  async removeAktivitas(
    @Param('id') id: string,
    @Req() request,
  ): Promise<WebResponse<boolean>> {
    await this.aktivitasService.removeAktivitas(request.user, id);
    return {
      status: 'success',
      message: 'Aktivitas Berhasil Dihapus',
      data: true,
    };
  }
}

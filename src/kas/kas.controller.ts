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
  ParseFilePipeBuilder,
  Put,
} from '@nestjs/common';
import { KasService } from './kas.service';
import {
  ConnectKasBankDto,
  CreateKasArusDto,
  CreateKasDto,
  CreateKasMutasiDto,
} from './dto/create-kas.dto';
// import { UpdateKaDto } from './dto/update-ka.dto';
import { Auth } from '../common/auth.decorator';
import { Role } from '../common/role/role.enum';
import { Roles } from '../common/role/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { WebResponse } from '../model/web.model';
import {
  KasArusResponse,
  KasResponse,
  KasMutasiResponse,
} from './dto/response.dto';
import {
  GetKasArusDto,
  GetKasQueryDto,
  GetMutasiQueryDto,
} from './dto/get.dto';
import {
  UpdateKasArusDto,
  UpdateKasDto,
} from './dto/update-kas.dto';
import { KasArusParamDto } from './dto/params.dto';
import { FileTypesValidator } from '../common/pipes/file-types.validator';

const allowedMimeTypes = {
  fotoRek: ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'],
  buktiArus: ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'],
};

@Controller('/api/kas')
export class KasController {
  constructor(private readonly kasService: KasService) { }

  @Post()
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  async createKas(
    @Req() request,
    @Body() payload: CreateKasDto,
  ): Promise<WebResponse<KasResponse>> {
    const result = await this.kasService.createKas(request.user, payload);
    return {
      status: 'success',
      message: 'Kas Berhasil Dibuat',
      data: result,
    };
  }

  @Patch('/:kasId/bank')
  @Auth()
  @Roles(Role.MESJID)
  async connectKasBank(
    @Req() request,
    @Param('kasId') kasId: string,
    @Body() payload: ConnectKasBankDto,
  ): Promise<WebResponse<boolean>> {
    await this.kasService.connectKasBank(request.user, payload, kasId);
    return {
      status: 'success',
      message: 'Kas Berhasil Dihubungkan Dengan Bank',
      data: true,
    };
  }

  @Get()
  @Auth()
  @Roles(Role.MESJID)
  async getKas(
    @Query() query: GetKasQueryDto,
    @Req() request: any,
  ): Promise<WebResponse<KasResponse[] | []>> {
    const result = await this.kasService.getKas(request.user, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:kasId')
  @Auth()
  @Roles(Role.MESJID)
  async updateKas(
    @Req() request: any,
    @Body() payload: UpdateKasDto,
    @Param('kasId') kasId: string,
  ): Promise<WebResponse<KasResponse>> {
    const result = await this.kasService.updateKas(request.user, payload, kasId);
    return {
      status: 'success',
      message: 'Kas Berhasil Diperbarui',
      data: result,
    };
  }

  @Delete('/:kasId')
  @Auth()
  @Roles(Role.MESJID)
  async removeKas(
    @Req() request: any,
    @Param('kasId') kasId: string,
  ): Promise<WebResponse<boolean>> {
    await this.kasService.removeKas(request.user, kasId);
    return {
      status: 'success',
      message: 'Kas Berhasil Dihapus',
      data: true,
    };
  }

  @Post('/:kasId/arus')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('buktiKasArus', {
      dest: './uploads/arus-kas',
    }),
  )
  async createKasArus(
    @Req() request: any,
    @Param('kasId') kasId: string,
    @Body() payload: CreateKasArusDto,
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
    buktiKasArus?: Express.Multer.File,
  ): Promise<WebResponse<KasArusResponse>> {
    const result = await this.kasService.createKasArus(
      request,
      kasId,
      payload,
      buktiKasArus,
    );
    return {
      status: 'success',
      message: 'Arus Kas Berhasil Dibuat',
      data: result,
    };
  }

  @Get('/:kasId/arus')
  @Auth()
  @Roles(Role.MESJID)
  async getKasArus(
    @Req() request: any,
    @Param('kasId') kasId: string,
    @Query() query: GetKasArusDto,
  ): Promise<WebResponse<KasArusResponse[] | []>> {
    const result = await this.kasService.getKasArus(request, kasId, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:kasId/arus/:arusKasId')
  @Auth()
  @Roles(Role.MESJID)
  @UseInterceptors(
    FileInterceptor('buktiKasArus', {
      dest: './uploads/arus-kas',
    }),
  )
  async updateKasArus(
    @Req() request: any,
    @Body() payload: UpdateKasArusDto,
    @Param() param: KasArusParamDto,
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
    buktiKasArus?: Express.Multer.File,
  ): Promise<WebResponse<KasArusResponse>> {
    const result = await this.kasService.updateKasArus(
      request.user,
      payload,
      param,
      buktiKasArus,
    );
    return {
      status: 'success',
      message: 'Arus Kas Berhasil Diperbarui',
      data: result,
    };
  }

  @Delete('/:kasId/arus/:arusKasId')
  @Auth()
  @Roles(Role.MESJID)
  async deleteKasArus(
    @Req() request: any,
    @Param() param: KasArusParamDto,
  ): Promise<WebResponse<boolean>> {
    await this.kasService.deleteKasArus(request.user, param);
    return {
      status: 'success',
      message: 'Arus Kas Berhasil Dihapus',
      data: true,
    };
  }

  @Post('/mutasi')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  async createKasMutasi(
    @Body() payload: CreateKasMutasiDto,
    @Req() request: any,
  ): Promise<WebResponse<KasMutasiResponse>> {
    const result = await this.kasService.createKasMutasi(request.user, payload);
    return {
      status: 'success',
      message: 'Mutasi Kas Berhasil Dibuat',
      data: result,
    };
  }

  @Get('/mutasi')
  @Auth()
  @Roles(Role.MESJID)
  async getKasMutasi(
    @Req() request: any,
    @Query() query: GetMutasiQueryDto,
  ): Promise<WebResponse<KasMutasiResponse[] | []>> {
    const result = await this.kasService.getKasMutasi(request.user, query);
    return {
      status: 'success',
      data: result,
    };
  }
}

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
} from '@nestjs/common';
import { KasService } from './kas.service';
import {
  CreateArusKasKeluarDto,
  CreateArusKasMasukDto,
  CreateKasBankDto,
  CreateKasMutasiDto,
  CreateKasTunaiDto,
} from './dto/create-kas.dto';
// import { UpdateKaDto } from './dto/update-ka.dto';
import { Auth } from '../common/auth.decorator';
import { Role } from '../common/role/role.enum';
import { Roles } from '../common/role/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { WebResponse } from '../model/web.model';
import {
  ArusKasResponse,
  GetKasMutasiResponse,
  KasMutasiResponse,
  KasResponse,
} from './dto/response.dto';
import {
  GetArusKasDto,
  GetKasQueryDto,
  GetMutasiQueryDto,
} from './dto/get.dto';
import {
  UpdateArusKasKeluarDto,
  UpdateArusKasMasukDto,
  UpdateKasBankDto,
} from './dto/update-kas.dto';
import { ArusKasParamDto } from './dto/params.dto';
import { DeleteArusKasDto } from './dto/delete.dto';
import { FileTypesValidator } from '../common/pipes/file-types.validator';

const allowedMimeTypes = {
  fotoRek: ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'],
  buktiArus: ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'],
};

@Controller('/api/kas')
export class KasController {
  constructor(private readonly kasService: KasService) {}

  @Post('/bank')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('fotoRek', {
      dest: './uploads/rekening',
    }),
  )
  async createKasBank(
    @Req() request,
    @Body() payload: CreateKasBankDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    fotoRek: Express.Multer.File,
  ): Promise<WebResponse<KasResponse>> {
    const result = await this.kasService.createKasBank(
      request.user,
      payload,
      fotoRek,
    );
    return {
      status: 'success',
      message: 'Kas Berhasil Dibuat',
      data: result,
    };
  }

  @Post('/tunai')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  async createKasTunai(
    @Req() request,
    @Body() payload: CreateKasTunaiDto,
  ): Promise<WebResponse<KasResponse>> {
    const result = await this.kasService.createKasTunai(request.user, payload);
    return {
      status: 'success',
      message: 'Kas Berhasil Dibuat',
      data: result,
    };
  }

  @Get()
  @Auth()
  @Roles(Role.MESJID)
  async getKas(@Query() query: GetKasQueryDto, @Req() request: any) {
    const result = await this.kasService.getKas(request.user, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:kasId')
  @Auth()
  @Roles(Role.MESJID)
  @UseInterceptors(
    FileInterceptor('fotoRek', {
      dest: './uploads/rekening',
    }),
  )
  async updateKasBank(
    @Req() request: any,
    @Body() payload: UpdateKasBankDto,
    @Param('kasId') kasId: string,
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
    fotoRek?: Express.Multer.File,
  ): Promise<WebResponse<boolean>> {
    await this.kasService.updateKasBank(request.user, payload, kasId, fotoRek);
    return {
      status: 'success',
      message: 'Kas Bank Berhasil Diperbarui',
      data: true,
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

  @Post('/:kasId/arus-kas/masuk')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  async createArusKasMasuk(
    @Req() request: any,
    @Param('kasId') kasId: string,
    @Body() payload: CreateArusKasMasukDto,
  ): Promise<WebResponse<ArusKasResponse>> {
    const result = await this.kasService.createArusKasMasuk(
      request.user,
      kasId,
      payload,
    );
    return {
      status: 'success',
      message: 'Arus Kas Masuk Berhasil Dibuat',
      data: result,
    };
  }

  @Post('/:kasId/arus-kas/keluar')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('buktiArus', {
      dest: './uploads/arus-kas',
    }),
  )
  async createArusKasKeluar(
    @Req() request: any,
    @Param('kasId') kasId: string,
    @Body() payload: CreateArusKasKeluarDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    buktiArusKas: Express.Multer.File,
  ): Promise<WebResponse<ArusKasResponse>> {
    const result = await this.kasService.createArusKasKeluar(
      request.user,
      kasId,
      payload,
      buktiArusKas,
    );
    return {
      status: 'success',
      message: 'Arus Kas Keluar Berhasil Dibuat',
      data: result,
    };
  }

  @Get('/:kasId/arus-kas')
  @Auth()
  @Roles(Role.MESJID)
  @UseInterceptors()
  async getArusKas(
    @Req() request: any,
    @Param('kasId') kasId: string,
    @Query() query: GetArusKasDto,
  ): Promise<WebResponse<ArusKasResponse[] | []>> {
    const result = await this.kasService.getArusKas(request.user, kasId, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:kasId/arus-kas/:arusKasId/masuk')
  @Auth()
  @Roles(Role.MESJID)
  @UseInterceptors()
  async updateArusKasMasuk(
    @Req() request: any,
    @Body() payload: UpdateArusKasMasukDto,
    @Param() param: ArusKasParamDto,
  ): Promise<WebResponse<ArusKasResponse>> {
    const result = await this.kasService.updateArusKasMasuk(
      request.user,
      payload,
      param,
    );
    return {
      status: 'success',
      message: 'Arus Kas Berhasil Diperbarui',
      data: result,
    };
  }

  @Patch('/:kasId/arus-kas/:arusKasId/keluar')
  @Auth()
  @Roles(Role.MESJID)
  @UseInterceptors(
    FileInterceptor('buktiArus', {
      dest: './uploads/arus-kas',
    }),
  )
  async updateArusKasKeluar(
    @Req() request: any,
    @Body() payload: UpdateArusKasKeluarDto,
    @Param() param: ArusKasParamDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    buktiArusKas: Express.Multer.File,
  ): Promise<WebResponse<ArusKasResponse>> {
    const result = await this.kasService.updateArusKasKeluar(
      request.user,
      payload,
      param,
      buktiArusKas,
    );
    return {
      status: 'success',
      message: 'Arus Kas Berhasil Diperbarui',
      data: result,
    };
  }

  @Delete('/:kasId/arus-kas/:arusKasId')
  @Auth()
  @Roles(Role.MESJID)
  async deleteArusKas(
    @Req() request: any,
    @Param() param: ArusKasParamDto,
    @Body() payload: DeleteArusKasDto,
  ): Promise<WebResponse<true>> {
    await this.kasService.deleteArusKas(request.user, payload, param);
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
  ): Promise<WebResponse<GetKasMutasiResponse[] | []>> {
    const result = await this.kasService.getKasMutasi(request.user, query);
    return {
      status: 'success',
      data: result,
    };
  }
}

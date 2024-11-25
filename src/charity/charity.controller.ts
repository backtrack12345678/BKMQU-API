import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  ParseFilePipeBuilder,
  UploadedFiles,
  Get,
} from '@nestjs/common';
import { CharityService } from './charity.service';
import {
  CreateDonasi,
  CreateDonasiInfaqDto,
  CreateDonasiPenceramahDto,
  CreateDonasiSedekahDto,
  CreateInfaqMesjidDto,
  CreatePenerimaSedekahDto,
  CreateTransaksiEnchanceKasBank,
  UpdateInfaqMesjidDto,
} from './dto/create-charity.dto';
import { UpdatePenerimaSedekahDto } from './dto/update-charity.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { FileTypesValidator } from '../common/pipes/file-types.validator';

const allowedMimeTypes = {
  content: ['image/jpeg', 'image/jpg', 'image/png'],
};

@Controller('/api/charity')
export class CharityController {
  constructor(private readonly charityService: CharityService) { }

  @Post('/donasi')
  @Auth()
  @HttpCode(201)
  async createDonasi(
    @Req() request: any,
    @Body() payload: CreateDonasi,
  ) {
    const result = await this.charityService.createDonasi(request.user, payload);
    return {
      status: 'success',
      message: 'Donasi Berhasil',
      data: result,
    };
  }

  @Get('/donasi')
  @Auth()
  async getAllDonasi(
    @Req() request: any,
  ) {
    const result = await this.charityService.getAllDonasi(request.user);
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('/infaq')
  @Auth()
  @HttpCode(201)
  async createDonasiInfaq(
    @Req() request: any,
    @Body() payload: CreateDonasiInfaqDto,
  ) {
    const result = await this.charityService.createDonasiInfaq(
      request.user,
      payload,
    );
    return {
      status: 'success',
      message: 'Donasi Infaq Berhasil Dibuat',
      data: result,
    };
  }

  @Post('/kafalah')
  @Auth()
  @HttpCode(201)
  async createDonasiKafalah(
    @Req() request: any,
    @Body() payload: CreateDonasiPenceramahDto,
  ) {
    const result = await this.charityService.createDonasiKafalah(
      request.user,
      payload,
    );
    return {
      status: 'success',
      message: 'Donasi Kafalah Berhasil Dibuat',
      data: result,
    }
  }

  @Post('/infaq/:infaqId')
  @Auth()
  @HttpCode(201)
  async createDonasiInfaqById(
    @Req() request: any,
    @Param('infaqId') infaqId: string,
    @Body() payload: CreateDonasiInfaqDto,
  ) {
    const result = await this.charityService.createDonasiInfaq(
      request.user,
      payload,
      infaqId,
    );
    return {
      status: 'success',
      message: 'Donasi Infaq Berhasil Dibuat',
      data: result,
    };
  }

  @Post('/sedekah/:kategoriId')
  @Auth()
  @HttpCode(201)
  async createDonasiSedekah(
    @Req() request: any,
    @Param('kategoriId', ParseIntPipe) kategoriId: number,
    @Body() payload: CreateDonasiSedekahDto,
  ) {
    const result = await this.charityService.createDonasiSedekah(
      request.user,
      payload,
      kategoriId,
    );
    return {
      status: 'success',
      message: 'Donasi Sedekah Berhasil Dibuat',
      data: result,
    };
  }

  @Post('/mesjid/infaq')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('content', Infinity, {
      dest: './uploads/infaq',
    }),
  )
  async createInfaqMesjid(
    @Req() request: any,
    @Body() payload: CreateInfaqMesjidDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    content: Express.Multer.File[],
  ) {
    const result = await this.charityService.createInfaq(
      request,
      payload,
      content,
    );
    return {
      status: 'success',
      message: 'Program Infaq Berhasil Dibuat',
      data: result,
    };
  }

  @Patch('/mesjid/infaq/:infaqId')
  @Auth()
  @Roles(Role.MESJID)
  async updateInfaqMesjid(
    @Req() request: any,
    @Param('infaqId') infaqId: string,
    @Body() payload: UpdateInfaqMesjidDto,
  ) {
    const result = await this.charityService.updateInfaq(
      request,
      infaqId,
      payload
    );
    return {
      status: 'success',
      message: 'Program Infaq Berhasil Diupdate',
      data: result,
    };
  }

  @Delete('/mesjid/infaq/:infaqId')
  @Auth()
  @Roles(Role.MESJID)
  async removeInfaqMesjid(
    @Req() request: any,
    @Param('infaqId') infaqId: string,
  ) {
    await this.charityService.removeInfaq(
      request,
      infaqId
    );
    return {
      status: 'success',
      message: 'Program Infaq Berhasil Dihapus',
      data: true,
    };
  }

  @Post('/mesjid/sedekah')
  @Auth()
  @Roles(Role.MESJID)
  @HttpCode(201)
  async createPenerimaSedekah(
    @Req() request: any,
    @Body() payload: CreatePenerimaSedekahDto,
  ) {
    const result = await this.charityService.createPenerimaSedekah(
      request.user,
      payload,
    );
    return {
      status: 'success',
      message: 'Penerima Sedekah Berhasil Dibuat',
      data: result,
    };
  }

  @Patch('/mesjid/sedekah/:penerimaId')
  @Auth()
  @Roles(Role.MESJID)
  async updatePenerimaSedekah(
    @Req() request: any,
    @Param('penerimaId', ParseIntPipe) penerimaId: number,
    @Body() payload: UpdatePenerimaSedekahDto,
  ) {
    const result = await this.charityService.updatePenerimaSedekah(
      request.user,
      payload,
      penerimaId,
    );
    return {
      status: 'success',
      message: 'Penerima Sedekah Berhasil Di Perbarui',
      data: result,
    };
  }

  @Delete('/mesjid/sedekah/:penerimaId')
  @Auth()
  @Roles(Role.MESJID)
  async removePenerimaSedekah(
    @Req() request: any,
    @Param('penerimaId', ParseIntPipe) penerimaId: number,
  ): Promise<WebResponse<true>> {
    await this.charityService.removePenerimaSedekah(request.user, penerimaId);
    return {
      status: 'success',
      message: 'Penerima Sedekah Berhasil Dihapus',
      data: true,
    };
  }


  // @Post('/mesjid/kas/enchance')
  // @Auth()
  // @Roles(Role.MESJID)
  // @HttpCode(201)
  // async createKasBankEnchance(
  //   @Req() request: any,
  //   @Body() payload: CreateTransaksiEnchanceKasBank,
  // ): Promise<WebResponse<true>> {
  //   await this.charityService.createKasBankEnchance(request.user, payload);
  //   return {
  //     status: 'success',
  //     message: 'Transaksi Penaikan Limit Kas Bank Berhasil',
  //     data: true,
  //   };
  // }
}

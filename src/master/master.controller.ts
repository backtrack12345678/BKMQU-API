import { Controller, Get, Query, Req } from '@nestjs/common';
import { MasterService } from './master.service';
import {
  AlquranQuery,
  KecamatanQuery,
  MesjidQuery,
  PenceramahQuery,
} from './dto/get.dto';
import { Request } from 'express';
import {
  AlquranResponse,
  BankResponse,
  KategoriSedekahResponse,
  KecamatanResponse,
  MesjidResponse,
} from './dto/response.dto';
import { WebResponse } from '../model/web.model';

@Controller('/api/master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  // @Post()
  // create(@Body() createMasterDto: CreateMasterDto) {
  //   return this.masterService.create(createMasterDto);
  // }
  @Get('/mesjid')
  async getMesjid(
    @Query() query: MesjidQuery,
    @Req() request: Request,
  ): Promise<WebResponse<MesjidResponse[]>> {
    const result = await this.masterService.getMesjid(request, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/penceramah')
  async getPenceramah(
    @Query() query: PenceramahQuery,
    @Req() request: Request,
  ): Promise<WebResponse<PenceramahQuery[]>> {
    const result = await this.masterService.getPenceramah(request, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/kecamatan')
  async getKecamatan(
    @Query() query: KecamatanQuery,
  ): Promise<WebResponse<KecamatanResponse[]>> {
    const result = await this.masterService.getKecamatan(query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/bank')
  async getBank(): Promise<WebResponse<BankResponse[]>> {
    const result = await this.masterService.getBank();
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/quran')
  async getAlquran(
    @Query() query: AlquranQuery,
  ): Promise<WebResponse<AlquranResponse | AlquranResponse[]>> {
    const result = await this.masterService.getAlquran(query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/kategori-sedekah')
  async getKategoriSedekah(): Promise<WebResponse<KategoriSedekahResponse[]>> {
    const result = await this.masterService.getKategoriSedekah();
    return {
      status: 'success',
      data: result,
    };
  }
}

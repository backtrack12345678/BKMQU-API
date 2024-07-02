import { Controller, Get, Patch, Param, Query, Req } from '@nestjs/common';
import { MesjidService } from './mesjid.service';
import { UpdatePengurusStatusParamDto } from './dto/update-mesjid.dto';
import { WebResponse } from '../model/web.model';
import { PengurusQueryDto } from './dto/get.dto';
import { GetPengurusResponse } from './dto/response.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';

@Controller('/api/mesjid')
export class MesjidController {
  constructor(private readonly mesjidService: MesjidService) {}

  @Get('/pengurus')
  @Auth()
  @Roles(Role.MESJID)
  async findAllPengurus(
    @Req() request,
    @Query() query: PengurusQueryDto,
  ): Promise<WebResponse<GetPengurusResponse[] | []>> {
    const result = await this.mesjidService.findAllPengurus(request, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/pengurus/:pengurusUserId/verify/:status')
  @Auth()
  @Roles(Role.MESJID)
  async updateStatusPengurus(
    @Req() request,
    @Param() param: UpdatePengurusStatusParamDto,
  ): Promise<WebResponse<boolean>> {
    await this.mesjidService.updateStatusPengurus(request.user, param);
    const formattedStatus = param.status
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
    return {
      status: 'success',
      message: `Pengurus Berhasil ${formattedStatus}`,
      data: true,
    };
  }
}

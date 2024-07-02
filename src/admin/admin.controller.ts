import { Controller, Get, Patch, Param, Query, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateMesjidStatusParamDto } from './dto/update-admin.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { MesjidQueryDto } from './dto/get.dto';
import { Request } from 'express';
import { WebResponse } from '../model/web.model';
import { GetMesjidResponse } from './dto/response.dto';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/mesjid')
  @Auth()
  @Roles(Role.ADMIN)
  async findAllMesjid(
    @Query() query: MesjidQueryDto,
    @Req() request: Request,
  ): Promise<WebResponse<GetMesjidResponse[] | []>> {
    const result = await this.adminService.findAllMesjid(request, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/mesjid/:mesjidUserId/verify/:status')
  @Auth()
  @Roles(Role.ADMIN)
  async updateStatusMesjid(
    @Param() param: UpdateMesjidStatusParamDto,
  ): Promise<WebResponse<boolean>> {
    await this.adminService.updateMesjidStatus(param);
    const formattedStatus = param.status
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
    return {
      status: 'success',
      message: `Mesjid Berhasil ${formattedStatus}`,
      data: true,
    };
  }
}

import { Controller, Get, Patch, Param, Query, Req, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateMesjidStatusParamDto, WithdrawParamDto } from './dto/update-admin.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { MesjidQueryDto, UserBankQueryDto, UserDeactivationQueryDto, UserWithdrawQueryDto } from './dto/get.dto';
import { Request } from 'express';
import { WebResponse } from '../model/web.model';
import { GetMesjidResponse, GetUserBankResponse, GetUserDeactivationResponse } from './dto/response.dto';
import { SaldoResponse, WithdrawResponse } from 'src/withdraw/dto/response.dto';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('/saldo')
  @Auth()
  @Roles(Role.ADMIN)
  async sumAllUserSaldo(): Promise<WebResponse<SaldoResponse>> {
    const result = await this.adminService.sumAllUserSaldo();
    return {
      status: 'success',
      data: result,
    }
  }

  @Get('/withdraw')
  @Auth()
  @Roles(Role.ADMIN)
  async findAllUserWithdraw(
    @Query() query: UserWithdrawQueryDto,
  ): Promise<WebResponse<WithdrawResponse[]>> {
    const result = await this.adminService.findAllUserWithdraw(query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/withdraw/:withdrawId/:status')
  @Auth()
  @Roles(Role.ADMIN)
  async acceptUserWithdraw(
    @Param() param: WithdrawParamDto,
  ): Promise<WebResponse<boolean>> {
    await this.adminService.acceptUserWithdraw(param);
    return {
      status: 'success',
      message: 'Permintaan Withdraw Berhasil Diterima',
      data: true,
    };
  }

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

  @Get('/user/bank')
  @Auth()
  @Roles(Role.ADMIN)
  async findAllUserBank(
    @Query() query: UserBankQueryDto,
  ): Promise<WebResponse<GetUserBankResponse[] | []>> {
    const result = await this.adminService.findAllUserBank(query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/user/bank/:userBankId')
  @Auth()
  @Roles(Role.ADMIN)
  async updateUserBankStatus(
    @Param('userBankId', ParseIntPipe) userBankId: number,
  ): Promise<WebResponse<boolean>> {
    await this.adminService.updateUserBankStatus(userBankId);
    return {
      status: 'success',
      message: 'Akun Bank Berhasil Diterima',
      data: true,
    };
  }

  @Get('/user/deactivate')
  @Auth()
  @Roles(Role.ADMIN)
  async findAllUserDeactivation(
    @Query() query: UserDeactivationQueryDto,
  ): Promise<WebResponse<GetUserDeactivationResponse[]>> {
    const result = await this.adminService.findAllUserDeactivation(query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/user/:userId/deactivate')
  @Auth()
  @Roles(Role.ADMIN)
  async acceptUserDeactivation(
    @Param('userId') userId: string,
  ): Promise<WebResponse<boolean>> {
    await this.adminService.acceptUserDeactivation(userId);
    return {
      status: 'success',
      message: 'Akun User Berhasil Dinonaktifkan',
      data: true,
    };
  }
}

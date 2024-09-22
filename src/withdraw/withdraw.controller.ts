import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { Auth } from 'src/common/auth.decorator';
import { WebResponse } from 'src/model/web.model';
import { WithdrawResponse } from './dto/response.dto';

@Controller('api/withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) { }

  @Post()
  @Auth()
  @HttpCode(201)
  async createWithdraw(
    @Req() request: any,
    @Body() payload: CreateWithdrawDto
  ): Promise<WebResponse<WithdrawResponse>> {
    const result = await this.withdrawService.createWithdraw(request.user, payload);
    return {
      status: 'success',
      message: 'Withdraw Berhasil Diajukan',
      data: result,
    }
  }

  @Get()
  @Auth()
  async findAllWithdraw(
    @Req() request: any,
  ): Promise<WebResponse<WithdrawResponse[]>> {
    const result = await this.withdrawService.findAllWithdraw(request.user);
    return {
      status: 'success',
      data: result,
    };
  }

  @Delete(':id')
  async removeWithdraw(
    @Req() request: any,
    @Param('id') id: string
  ): Promise<WebResponse<boolean>> {
    await this.withdrawService.removeWithdraw(request.user, id);
    return {
      status: 'success',
      message: 'Withdraw Berhasil Dihapus',
      data: true,
    }
  }
}

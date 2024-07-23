import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { MidtransService } from './midtrans.service';
import { Auth } from '../common/auth.decorator';
import { UpdateWebhookDto } from './dto/update-midtrans.dto';
import { WebResponse } from '../model/web.model';
import { MidtransInterceptor } from './midtrans.interceptor';

@Controller('/api/midtrans')
export class MidtransController {
  constructor(private readonly midtransService: MidtransService) {}

  @Get('/transaction/:orderId')
  @Auth()
  async getDetailTransaction(
    @Req() request: any,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.midtransService.getDetailTransaction(
      request.user,
      orderId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('/transaction/:orderId')
  @Auth()
  async cancelTransaction(
    @Req() request: any,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.midtransService.cancelTransaction(
      request.user,
      orderId,
    );
    return {
      status: 'success',
      message: result,
      data: true,
    };
  }

  @Post('/transaction/webhook')
  @UseInterceptors(MidtransInterceptor)
  async updateSaldoWebHook(
    @Body() payload: UpdateWebhookDto,
  ): Promise<WebResponse<true>> {
    await this.midtransService.updateSaldoWebhook(payload);
    return {
      status: 'success',
      message: 'Saldo Berhasil Ditambahkan',
      data: true,
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  SubscriptionsTransactionDto,
} from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { WebResponse } from '../model/web.model';
import { SubscriptionResponse } from './dto/response.dto';
import { SubscriptionsTransactionParamDto } from './dto/params.dto';

@Controller('/api/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('/')
  @Auth()
  @Roles(Role.ADMIN)
  async createSubscription(
    @Body() payload: CreateSubscriptionDto,
  ): Promise<WebResponse<SubscriptionResponse>> {
    const result = await this.subscriptionsService.createSubscription(payload);
    return {
      status: 'success',
      message: 'Paket Langganan Berhasil Dibuat',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subscriptionsService.remove(+id);
  // }

  @Post(':jenis/:subscriptionId/buy')
  @Auth()
  async createSubscriptionTransaction(
    @Req() request: any,
    @Body() payload: SubscriptionsTransactionDto,
    @Param() param: SubscriptionsTransactionParamDto,
  ) {
    const result =
      await this.subscriptionsService.createSubscriptionTransaction(
        request.user,
        payload,
        param,
      );
    return {
      status: 'success',
      message: 'Pembayaran Paket Langganan Berhasil Dibuat',
      data: result,
    };
  }
}

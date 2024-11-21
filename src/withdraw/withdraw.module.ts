import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { WithdrawHelper } from './helper/helper.service';

@Module({
  controllers: [WithdrawController],
  providers: [WithdrawService, WithdrawHelper],
  exports: [WithdrawService],
})
export class WithdrawModule {}

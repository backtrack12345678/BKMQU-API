import { Module } from '@nestjs/common';
import { CharityService } from './charity.service';
import { CharityController } from './charity.controller';
import { MidtransModule } from '../midtrans/midtrans.module';

@Module({
  imports: [MidtransModule],
  controllers: [CharityController],
  providers: [CharityService],
  exports: [CharityService],
})
export class CharityModule {}

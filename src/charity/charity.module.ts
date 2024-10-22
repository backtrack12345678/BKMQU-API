import { Module } from '@nestjs/common';
import { CharityService } from './charity.service';
import { CharityController } from './charity.controller';
import { MidtransModule } from '../midtrans/midtrans.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [MidtransModule,FilesModule],
  controllers: [CharityController],
  providers: [CharityService],
  exports: [CharityService],
})
export class CharityModule {}

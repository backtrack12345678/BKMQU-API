import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MidtransModule } from 'src/midtrans/midtrans.module';
import { AdminHelper } from './helper/admin.helper';

@Module({
  imports: [MidtransModule],
  controllers: [AdminController],
  providers: [AdminService, AdminHelper],
})
export class AdminModule { }

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OtpModule } from '../otp/otp.module';
import { UserHelper } from './helper/user.helper';
import { PostsModule } from '../posts/posts.module';
import { AktivitasModule } from '../aktivitas/aktivitas.module';
import { KasModule } from '../kas/kas.module';
import { CharityModule } from '../charity/charity.module';
import { KajianModule } from '../kajian/kajian.module';
import { FilesModule } from '../files/files.module';
import { LiveModule } from '../live/live.module';
import { MidtransModule } from 'src/midtrans/midtrans.module';

@Module({
  imports: [
    OtpModule,
    PostsModule,
    AktivitasModule,
    KasModule,
    CharityModule,
    KajianModule,
    FilesModule,
    LiveModule,
  ],
  providers: [UserService, UserHelper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

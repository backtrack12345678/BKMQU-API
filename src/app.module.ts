import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { OtpModule } from './otp/otp.module';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';
import { MasterModule } from './master/master.module';
import { AktivitasModule } from './aktivitas/aktivitas.module';
import { AdminModule } from './admin/admin.module';
import { MesjidModule } from './mesjid/mesjid.module';
import { KasModule } from './kas/kas.module';
import { MidtransModule } from './midtrans/midtrans.module';
import { KajianModule } from './kajian/kajian.module';
import { CharityModule } from './charity/charity.module';
import { LiveModule } from './live/live.module';
import { PodcastModule } from './podcast/podcast.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    OtpModule,
    FilesModule,
    PostsModule,
    MasterModule,
    AktivitasModule,
    AdminModule,
    MesjidModule,
    KasModule,
    MidtransModule,
    KajianModule,
    CharityModule,
    LiveModule,
    PodcastModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

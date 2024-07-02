import { Module } from '@nestjs/common';
import { MesjidService } from './mesjid.service';
import { MesjidController } from './mesjid.controller';

@Module({
  controllers: [MesjidController],
  providers: [MesjidService],
  exports: [MesjidService],
})
export class MesjidModule {}

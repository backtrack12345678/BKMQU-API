import { Module } from '@nestjs/common';
import { KajianService } from './kajian.service';
import { KajianController } from './kajian.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [KajianController],
  providers: [KajianService],
  exports: [KajianService],
})
export class KajianModule {}

import { Module } from '@nestjs/common';
import { KasService } from './kas.service';
import { KasController } from './kas.controller';
import { FilesModule } from '../files/files.module';
import { Helper } from './helper/helper';

@Module({
  imports: [FilesModule],
  controllers: [KasController],
  providers: [KasService, Helper],
  exports: [KasService],
})
export class KasModule { }

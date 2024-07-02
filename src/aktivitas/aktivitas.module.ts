import { Module } from '@nestjs/common';
import { AktivitasService } from './aktivitas.service';
import { AktivitasController } from './aktivitas.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [AktivitasController],
  providers: [AktivitasService],
  exports: [AktivitasService],
})
export class AktivitasModule {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateAktivitasDto } from './create-aktivita.dto';

export class UpdateAktivitaDto extends PartialType(CreateAktivitasDto) {}

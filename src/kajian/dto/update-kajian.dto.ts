import { PartialType } from '@nestjs/mapped-types';
import { CreateKajianContentDto, CreateKajianDto } from './create-kajian.dto';

export class UpdateKajianDto extends PartialType(CreateKajianDto) {}

export class UpdateKajianContentDto extends PartialType(
  CreateKajianContentDto,
) {}

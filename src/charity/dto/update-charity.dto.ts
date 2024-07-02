import { PartialType } from '@nestjs/mapped-types';
import {
  CreateCharityDto,
  CreatePenerimaSedekahDto,
} from './create-charity.dto';

export class UpdateCharityDto extends PartialType(CreateCharityDto) {}

export class UpdatePenerimaSedekahDto extends PartialType(
  CreatePenerimaSedekahDto,
) {}

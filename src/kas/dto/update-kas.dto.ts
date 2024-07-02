import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  CreateArusKasKeluarDto,
  CreateArusKasMasukDto,
} from './create-kas.dto';
import { Transform } from 'class-transformer';

export class UpdateKasBankDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  namaRek: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  namaBank: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nomorRek: string;
}

export class UpdateArusKasMasukDto extends PartialType(CreateArusKasMasukDto) {}

export class UpdateArusKasKeluarDto extends PartialType(
  CreateArusKasKeluarDto,
) {}

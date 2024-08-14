import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import {

  CreateKasArusDto,
} from './create-kas.dto';

export class UpdateKasDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nama: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  userBankId: number;
}

export class UpdateKasArusDto extends PartialType(CreateKasArusDto) { }
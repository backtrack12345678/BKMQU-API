import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ValidOptions } from './create-kas.dto';
import { Transform } from 'class-transformer';

export class DeleteArusKasDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(ValidOptions.MONTH)
  bulan: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(new Date().getFullYear() - 1)
  @Max(new Date().getFullYear() + 1)
  @Transform(({ value }) => parseInt(value, 10))
  tahun: number;
}

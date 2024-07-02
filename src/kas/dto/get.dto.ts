import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ValidOptions } from './create-kas.dto';

export class GetKasQueryDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  takeCount?: number = 3;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;
}

export class GetArusKasDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(ValidOptions.MONTH)
  bulan: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(new Date().getFullYear() - 1)
  @Max(new Date().getFullYear() + 1)
  @Transform(({ value }) => parseInt(value, 10))
  tahun?: number;
}

export class GetArusKasDashboardDto extends GetKasQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(ValidOptions.MONTH)
  bulan?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(new Date().getFullYear() - 1)
  @Max(new Date().getFullYear() + 1)
  @Transform(({ value }) => parseInt(value, 10))
  tahun?: number;
}

export class GetKasTotalDto {
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

export class GetMutasiQueryDto extends GetKasQueryDto {}

import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MinDate,
  ValidateIf,
} from 'class-validator';
// import { ValidOptions } from './create-kas.dto';

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

export class GetKasArusDto {
  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : new Date(value).setMonth(value.getMont() - 1))
  @IsDateString()
  @IsDate()
  fromDate: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDateString()
  @IsDate()
  // @ValidateIf((o) => o.toDate > o.fromDate)
  toDate: Date;
}

export class GetArusKasDashboardDto extends GetKasQueryDto {
  @IsOptional()
  @IsString()
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
  bulan: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(new Date().getFullYear() - 1)
  @Max(new Date().getFullYear() + 1)
  @Transform(({ value }) => parseInt(value, 10))
  tahun: number;
}

export class GetMutasiQueryDto extends GetKasQueryDto { }

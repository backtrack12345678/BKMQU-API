import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
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

export class GetMutasiQueryDto extends GetKasQueryDto { }

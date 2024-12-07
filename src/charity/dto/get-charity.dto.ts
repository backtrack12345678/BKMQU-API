import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class GetAllDonasiQueryDto {
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
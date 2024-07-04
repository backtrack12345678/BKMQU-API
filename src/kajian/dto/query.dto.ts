import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class GetKajianQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 5;
}
export class GetKajianContentsQueryDto extends GetKajianQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['Terbaru', 'Terlama'])
  timeSort?: string = 'Terbaru';
}

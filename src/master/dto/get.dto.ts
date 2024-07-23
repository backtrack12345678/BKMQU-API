import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class MesjidQuery {
  @IsOptional()
  @IsString()
  location?: string;
}

export class KecamatanQuery {
  @IsOptional()
  @IsString()
  nama?: string;

  // @Transform(({ value }) => parseInt(value, 10))
  // @IsOptional()
  // @IsNumber()
  // @IsPositive()
  // size?: number = 10;
}

export class PenceramahQuery {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 5;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class AlquranQuery {
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  @IsPositive()
  surahId?: number;
}

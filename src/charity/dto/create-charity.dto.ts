import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateCharityDto {}

export class CreateDonasiInfaqDto {
  @IsOptional()
  @IsString()
  pesan?: string;

  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(10000)
  @Max(50000000)
  @Transform(({ value }) => parseInt(value, 10))
  amount: number;
}

export class CreateDonasiSedekahDto extends CreateDonasiInfaqDto {}

export class CreateInfaqMesjidDto {
  @IsNotEmpty()
  @IsString()
  uraian: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  targetNominal: number;
}

export class CreatePenerimaSedekahDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  kategoriId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  namaPenerima: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  usia: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  jumlahKeluarga: number;

  @IsNotEmpty()
  @IsString()
  alamat: string;
}

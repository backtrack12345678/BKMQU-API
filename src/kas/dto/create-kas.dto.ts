import { Transform } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  MaxLength,
  NotEquals,
} from 'class-validator';
export class CreateKasDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nama: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999999999999999)
  @Transform(({ value }) => parseInt(value, 10))
  saldo: number;
}
export class ConnectKasBankDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  userBankId: number;
}
export class CreateKasArusDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @IsIn(['Masuk', 'Keluar'])
  tipe: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(999999999999999)
  @Transform(({ value }) => parseInt(value, 10))
  jumlah: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  kategori: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  metode: string;

  @IsNotEmpty()
  @IsString()
  keterangan: string;
}
export class CreateKasMutasiDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(999999999999999)
  @Transform(({ value }) => parseInt(value, 10))
  jumlah: number;
  
  @IsNotEmpty()
  @IsString()
  fromKasId: string;

  @IsNotEmpty()
  @IsString()
  @NotEquals('fromKasId', {
    message: 'toKasId tidak boleh sama dengan fromKasId',
  })
  toKasId: string;
}

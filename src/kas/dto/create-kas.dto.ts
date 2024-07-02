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
  Matches,
  NotEquals,
} from 'class-validator';

export class ValidOptions {
  static MONTH: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
}

export class CreateKasTunaiDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(999999999999999)
  @Transform(({ value }) => parseInt(value, 10))
  saldoAwal: number;

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

export class CreateKasBankDto extends CreateKasTunaiDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  namaRek: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  namaBank: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nomorRek: string;
}

export class ArusKas {
  @IsNotEmpty()
  @IsString()
  uraian: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  metode: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(999999999999999)
  @Transform(({ value }) => parseInt(value, 10))
  jumlah: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(31)
  @Transform(({ value }) => parseInt(value, 10))
  tanggal: number;

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

export class CreateArusKasMasukDto extends ArusKas {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @IsIn(['Infaq', 'Sadaqah'])
  kategori: string;
}

export class CreateArusKasKeluarDto extends ArusKas {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(/^(?!.*Mutasi).*$/, { message: 'Kategori cannot contain Mutasi' })
  kategori: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nama: string;
}

export class CreateKasMutasiDto extends ArusKas {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @IsIn(['Mutasi'])
  kategori: string;

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

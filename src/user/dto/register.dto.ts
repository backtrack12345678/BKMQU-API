import {
  IsString,
  IsNumber,
  IsBoolean,
  Matches,
  IsIn,
  IsEmail,
  MinLength,
  MaxLength,
  ValidateIf,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'phone must be digit' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([Math.random()], {
    message: 'Passwords do not match',
  })
  @ValidateIf((o) => o.password !== o.confirmPassword)
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nama: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  kecamatanId: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsIn([true], { message: 'Accept term must be true' })
  acceptTerm: boolean;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;
}

export class RegisterMesjidDto extends RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  noRegister: string;
}

export class RegisterPengurusDto extends RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  jabatan: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  uraianJabatan: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  mesjidId: number;
}

export class RegisterJamaahDto extends RegisterDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  mesjidId: number;
}

export class RegisterPenceramahDto extends RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  keahlian: string;
}

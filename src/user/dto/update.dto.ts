import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  imam: string;
}

export class UpdateUserImageDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Photo', 'Sampul'])
  type: string;
}

export class CreateUserBankDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nama: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  noRekening: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  bankId: number;
}

export class UpdateUserBankDto extends PartialType(CreateUserBankDto) {}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'phone must be digit' })
  phone: string;

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
  @Matches(/^[0-9]{6}$/, { message: 'OTP must be a 6-digit number' })
  otp: string;
}

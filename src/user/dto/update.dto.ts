import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
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
  bankId: number
}

export class UpdateUserBankDto extends PartialType(CreateUserBankDto) { }

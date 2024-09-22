import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateWithdrawDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  userBankId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(10000)
  @Max(999999999999999)
  @Transform(({ value }) => parseInt(value, 10))
  jumlah: number;

  @IsOptional()
  @IsString()
  pesan: string;
}

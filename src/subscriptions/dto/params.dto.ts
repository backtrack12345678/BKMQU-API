import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class SubscriptionsTransactionParamDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @IsIn(['mesjid', 'jamaah', 'pengurus', 'penceramah', 'semua'])
  jenis: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  subscriptionId: number;
}

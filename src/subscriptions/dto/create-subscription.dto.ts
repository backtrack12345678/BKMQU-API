import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  nama: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @IsIn(['mesjid', 'jamaah', 'pengurus', 'penceramah', 'semua'])
  jenis: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1) // Ensure the value is greater than 0
  @Max(100000000)
  harga: number;

  @IsNotEmpty()
  @IsString()
  deskripsi: string;
}

export class SubscriptionsTransactionDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1) // Ensure the value is greater than 0
  @Max(12)
  durasi: number;
}

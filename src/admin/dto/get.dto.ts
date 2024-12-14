import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  // IsNumber,
  // IsPositive,
} from 'class-validator';

export class MesjidQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: string;
}

export class UserBankQueryDto extends MesjidQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(['mesjid', 'jamaah', 'penceramah', 'pengurus'], {
    message: 'Role harus "mesjid", "pengurus", "penceramah", atau "jamaah"',
  })
  role?: string;
}
export class UserWithdrawQueryDto extends MesjidQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(['DITERIMA', 'DITOLAK'], {
    message: 'Status harus "DITERIMA" atau "DITOLAK"',
  })
  status?: string;
}

export class UserDeactivationQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  acceptTerm: boolean;
}

// export class GetPaginationQueryDto {
//   @IsOptional()
//   @IsNumber()
//   @IsPositive()
//   @Transform(({ value }) => parseInt(value, 10))
//   size?: number = 3;

//   @IsOptional()
//   @IsNumber()
//   @IsPositive()
//   @Transform(({ value }) => parseInt(value, 10))
//   page?: number = 1;
// }
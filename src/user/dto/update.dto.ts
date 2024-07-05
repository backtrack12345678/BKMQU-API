import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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

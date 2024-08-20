import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MesjidQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: string;
}

export class UserBankQueryDto extends MesjidQueryDto { }
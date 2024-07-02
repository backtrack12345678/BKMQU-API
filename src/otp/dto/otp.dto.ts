import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class OtpRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'phone must be digit' })
  phone: string;
}

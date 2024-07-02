import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[0-9]+$/, { message: 'phone must be digit' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^ExponentPushToken/, {
    message: 'notificationToken must start with "ExponentPushToken"',
  })
  notificationToken: string;
}

export class LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRequestDto } from './dto/otp.dto';
import { WebResponse } from '../model/web.model';

@Controller('/api/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() request: OtpRequestDto,
  ): Promise<WebResponse<boolean>> {
    const result = await this.otpService.createOTP('register', request);
    return {
      status: 'success',
      message: result,
      data: true,
    };
  }
}

import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRequestDto } from './dto/otp.dto';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';
import { Auth as userAuth } from '../model/user.model';

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

  @Auth()
  @Get('/change-password')
  async changePassword(@Req() request: any) {
    const user: userAuth = request.user;
    const result = await this.otpService.createOTP(
      'changePassword',
      null,
      user.id,
    );
    return {
      status: 'success',
      message: result,
      data: true,
    };
  }

  @Post('/forgot-password')
  @HttpCode(201)
  async forgotPassword(@Body() payload: OtpRequestDto) {
    const result = await this.otpService.createOTP('forgotPassword', payload);
    return {
      status: 'success',
      message: result,
      data: true,
    };
  }
}

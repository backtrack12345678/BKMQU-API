import { generate } from 'otp-generator';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { HttpException } from '@nestjs/common';

export function generateOTP() {
  const OTPNumber: string = generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const expired = Date.now() + 2 * 60 * 1000;

  return {
    OTPNumber,
    expired,
  };
}

export async function hashOTP(otpNumber: string): Promise<string> {
  return bcrypt.hash(otpNumber, 10);
}

export async function sendOTPToWA(
  otpNumber: string,
  phone: string,
): Promise<string> {
  const options = {
    instance_key: process.env.OTP_INSTANCE_KEY,
    jid: phone,
    message: `Halo! Ini adalah kode OTP Anda: *${otpNumber}*. Berlaku Selama 2 Menit. Mohon jangan memberikan kode ini kepada siapa pun. Terima kasih!
      `,
  };

  const result = await axios.post(
    'https://whatsva.id/api/sendMessageText',
    options,
  );

  if (result.data.success === false) {
    console.log(result.data.message);
    throw new HttpException('OTP Gagal Dikirim', 500);
  }

  return 'OTP Berhasil Dikirim';
}

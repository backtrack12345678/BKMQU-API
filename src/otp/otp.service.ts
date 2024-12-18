import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { OtpRequestDto } from './dto/otp.dto';
import { generateOTP, hashOTP, sendOTPToWA } from '../common/utils/otpManager';
import * as bcrypt from 'bcrypt';
import { OTP } from './model/otp.model';
import { Otp } from '@prisma/client';
import { Auth } from '../model/user.model';

@Injectable()
export class OtpService {
  constructor(private prismaService: PrismaService) {}

  async verifyUnregisteredPhone(phone: string) {
    const countPhone: number = await this.prismaService.user.count({
      where: {
        phone: phone,
      },
    });

    if (countPhone !== 0) {
      throw new HttpException('Pengguna Sudah Terdaftar', 400);
    }
  }

  async verifyRegisteredPhone(phone: string) {
    const countPhone = await this.prismaService.user.count({
      where: {
        phone: phone,
      },
    });

    if (countPhone <= 0) {
      throw new HttpException('Pengguna Tidak Ditemukan', 404);
    }
  }

  async getUserPhone(userId: string): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        phone: true,
      },
    });

    if (!user) {
      throw new HttpException('Pengguna Tidak Ditemukan', 404);
    }

    return user.phone;
  }

  async createOTP(
    type: string,
    request?: OtpRequestDto,
    userId?: string,
  ): Promise<string> {
    const { OTPNumber, expired } = generateOTP(type);
    const hashedOTP: string = await hashOTP(OTPNumber);
    const messageTime: string = type === 'register' ? '2 menit' : '15 menit';
    let userPhone;

    if (type === 'register') {
      await this.verifyUnregisteredPhone(request.phone);
    }

    if (type === 'forgotPassword') {
      await this.verifyRegisteredPhone(request.phone);
    }

    if (type === 'changePassword') {
      userPhone = await this.getUserPhone(userId);
    }

    const OTP = await this.prismaService.otp.upsert({
      where: {
        phone: request?.phone || userPhone,
      },
      update: {
        otp_hashed: hashedOTP,
        type: type,
        expired_otp: expired.toString(),
      },
      create: {
        phone: request?.phone || userPhone,
        otp_hashed: hashedOTP,
        type: type,
        expired_otp: expired.toString(),
      },
    });

    if (!OTP) {
      throw new HttpException('OTP Gagal Disimpan', 400);
    }

    return sendOTPToWA(OTPNumber, OTP.phone, messageTime);
  }

  async verifyOTP(OTP: OTP, phone: string) {
    const userOTP: Otp = await this.prismaService.otp.findUnique({
      where: {
        phone: phone,
        type: OTP.type,
      },
    });

    if (!userOTP) {
      throw new HttpException('OTP Tidak Valid Atau Kedaluwarsa', 400);
    }

    const isOTPValid: boolean = await bcrypt.compare(
      OTP.number,
      userOTP.otp_hashed,
    );

    if (!isOTPValid) {
      throw new HttpException('OTP Tidak Valid Atau Kedaluwarsa', 400);
    }

    const currentTimestamp: number = Date.now();
    const isOTPExpired: boolean =
      currentTimestamp > parseInt(userOTP.expired_otp);

    if (isOTPExpired) {
      throw new HttpException('OTP Tidak Valid Atau Kedaluwarsa', 400);
    }
  }
}

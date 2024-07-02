import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Auth } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import {
  RegisterJamaahDto,
  RegisterMesjidDto,
  RegisterPenceramahDto,
  RegisterPengurusDto,
} from './dto/register.dto';
import { OtpService } from '../otp/otp.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { User } from '@prisma/client';
import { Token } from '../common/token/token';
import { UserHelper } from './helper/user.helper';
import { UserResponse, UserResult } from './dto/response.dto';
import { UpdateProfileDto, UpdateUserImageDto } from './dto/update.dto';
import { FilesService } from '../files/files.service';
import { getHost } from '../common/utils/utils';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private otpService: OtpService,
    private tokenManager: Token,
    private userHelper: UserHelper,
    private filesService: FilesService,
  ) {}

  async registerMesjid(
    payload: RegisterMesjidDto,
    bukti: Express.Multer.File,
  ): Promise<{ id: string }> {
    await this.userHelper.registerHelper(payload);
    await this.userHelper.verifyNoRegisterMesjid(payload.noRegister);
    const wilayah = await this.userHelper.getWilayah(payload.kecamatanId);

    const user = await this.prismaService.user.create({
      data: {
        ...(await this.userHelper.dataRegister(payload, 'mesjid', wilayah)),
        mesjid: { create: { noRegister: payload.noRegister } },
        dokumenBukti: { create: { nama: bukti.filename, path: bukti.path } },
      },
      select: {
        id: true,
      },
    });

    await this.userHelper.deleteOtp(payload.phone);

    return {
      id: user.id,
    };
  }

  async registerPengurus(
    payload: RegisterPengurusDto,
    bukti: Express.Multer.File,
  ): Promise<{ id: string }> {
    await this.userHelper.registerHelper(payload);
    await this.userHelper.verifyRegisteredMesjid(payload.mesjidId);
    const wilayah = await this.userHelper.getWilayah(payload.kecamatanId);

    const user = await this.prismaService.user.create({
      data: {
        ...(await this.userHelper.dataRegister(payload, 'pengurus', wilayah)),
        pengurus: {
          create: {
            mesjidId: payload.mesjidId,
            jabatan: payload.jabatan,
            uraianJabatan: payload.uraianJabatan,
          },
        },
        dokumenBukti: { create: { nama: bukti.filename, path: bukti.path } },
      },
      select: {
        id: true,
      },
    });

    await this.userHelper.deleteOtp(payload.phone);

    return {
      id: user.id,
    };
  }

  async registerJamaah(payload: RegisterJamaahDto): Promise<{ id: string }> {
    await this.userHelper.registerHelper(payload);
    await this.userHelper.verifyRegisteredMesjid(payload.mesjidId);
    const wilayah = await this.userHelper.getWilayah(payload.kecamatanId);

    const user = await this.prismaService.user.create({
      data: {
        ...(await this.userHelper.dataRegister(payload, 'jamaah', wilayah)),
        jamaah: { create: { mesjidId: payload.mesjidId } },
      },
      select: {
        id: true,
      },
    });

    await this.userHelper.deleteOtp(payload.phone);

    return {
      id: user.id,
    };
  }

  async registerPenceramah(
    payload: RegisterPenceramahDto,
  ): Promise<{ id: string }> {
    await this.userHelper.registerHelper(payload);
    const wilayah = await this.userHelper.getWilayah(payload.kecamatanId);

    const user = await this.prismaService.user.create({
      data: {
        ...(await this.userHelper.dataRegister(payload, 'penceramah', wilayah)),
        penceramah: { create: { keahlian: payload.keahlian } },
      },
      select: {
        id: true,
      },
    });

    await this.userHelper.deleteOtp(payload.phone);

    return {
      id: user.id,
    };
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        phone: payload.phone,
      },
    });

    if (!user) {
      throw new HttpException('Kredensial Tidak Valid', 401);
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Kredensial Tidak Valid', 401);
    }

    if (!user.isVerified) {
      throw new HttpException('Pengguna Belum Terverifikasi', 401);
    }
    const accessToken: string = await this.tokenManager.generateToken(
      user,
      'accessToken',
    );
    const refreshToken: string = await this.tokenManager.generateToken(
      user,
      'refreshToken',
    );
    // const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.refresh_Token.upsert({
      where: {
        userId: user.id,
      },
      update: {
        refreshToken,
        notificationToken: payload.notificationToken || null,
      },
      create: {
        userId: user.id,
        refreshToken,
        notificationToken: payload.notificationToken || null,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateAccessToken(refreshToken?: string): Promise<string> {
    if (!refreshToken) {
      throw new HttpException(
        'Kredensial Tidak Valid. Silahkan Login Kembali',
        401,
      );
    }

    let payload;
    try {
      payload = await this.tokenManager.validateToken(
        refreshToken,
        'refreshToken',
      );
    } catch {
      throw new HttpException(
        'Kredensial Tidak Valid. Silahkan Login Kembali',
        401,
      );
    }

    const token = await this.prismaService.refresh_Token.findFirst({
      where: {
        userId: payload.id,
        refreshToken,
      },
      include: {
        user: true,
      },
    });

    if (!token) {
      throw new HttpException(
        'Kredensial Tidak Valid. Silahkan Login Kembali',
        401,
      );
    }

    return this.tokenManager.generateToken(token.user, 'accessToken');
  }

  async getProfile(
    user: Auth,
    type: string,
    request: any,
  ): Promise<UserResponse> {
    const userData: UserResult = await this.prismaService.user.findUnique({
      where: { id: user.id },
      select: this.userHelper.userSelectCondition(user.role),
    });

    if (!userData) {
      throw new NotFoundException('Pengguna Tidak Ditemukan');
    }

    return this.userHelper.toUserResponse(userData, request, type);
  }

  async updateProfile(
    user: Auth,
    payload: UpdateProfileDto,
  ): Promise<{ alamat: string; imam?: string }> {
    const updateData: any = {
      alamat: payload.alamat || undefined,
    };

    if (user.role !== 'mesjid' && payload.imam) {
      throw new BadRequestException(['property imam should not exist']);
    }

    updateData.user = {
      update: {
        mesjid: {
          update: {
            imam: payload.imam || undefined,
          },
        },
      },
    };

    const userUpdate = await this.prismaService.detail_User.update({
      where: {
        userId: user.id,
      },
      data: updateData,
      select: {
        alamat: true,
        ...(user.role === 'mesjid' && {
          user: {
            select: {
              mesjid: {
                select: {
                  imam: true,
                },
              },
            },
          },
        }),
      },
    });

    return {
      alamat: userUpdate.alamat,
      imam: userUpdate.user?.mesjid?.imam || undefined,
    };
  }

  async updateUserImage(
    request: any,
    param: UpdateUserImageDto,
    image: Express.Multer.File,
  ): Promise<{ photo?: string; sampul?: string }> {
    const user: Auth = request.user;
    const oldImage = await this.userHelper.getUserImage(user.id, param.type);
    let updateImage;

    const updateConditons = {
      where: { userId: user.id },
      data: {
        nama: image.filename,
        path: image.path,
      },
      select: { nama: true },
    };

    if (param.type === 'Photo') {
      updateImage = await this.prismaService.photo_User.update(updateConditons);
    }

    if (param.type === 'Sampul') {
      updateImage =
        await this.prismaService.sampul_User.update(updateConditons);
    }

    if (!updateImage) {
      throw new HttpException(`Gagal Memperbarui ${param.type} Pengguna`, 500);
    }

    if (
      oldImage &&
      !['default_user.jpg', 'default_sampul.jpg'].includes(oldImage.nama)
    ) {
      this.filesService.deleteSingleFile(oldImage);
    }

    return {
      ...(param.type === 'Photo' && {
        photo: `${getHost(request)}/api/files/users/${updateImage.nama}`,
      }),
      ...(param.type === 'Sampul' && {
        sampul: `${getHost(request)}/api/files/users/${updateImage.nama}`,
      }),
    };
  }

  async logout(logoutRequest): Promise<void> {
    const deleteRefreshToken = await this.prismaService.refresh_Token.delete({
      where: {
        userId: logoutRequest.id,
      },
    });

    if (!deleteRefreshToken) {
      throw new HttpException('Gagal Logout', 500);
    }
  }
}

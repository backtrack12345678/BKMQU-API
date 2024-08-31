import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  RegisterJamaahDto,
  RegisterMesjidDto,
  RegisterPenceramahDto,
  RegisterPengurusDto,
} from './dto/register.dto';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { Request, Response } from 'express';
import { Auth } from '../common/auth.decorator';
import { UserHelper } from './helper/user.helper';
import { CreateUserBankDto, UpdateProfileDto, UpdateUserBankDto, UpdateUserImageDto } from './dto/update.dto';
import { UserBankResponse, UserResponse } from './dto/response.dto';
import { PostsService } from '../posts/posts.service';
import { GetPostsQueryDto } from '../posts/dto/get.dto';
import { PostResponse } from '../posts/dto/response.dto';
import { GetAktivitasQueryDto } from '../aktivitas/dto/query.dto';
import { AktivitasService } from '../aktivitas/aktivitas.service';
import { AktivitasResponse } from '../aktivitas/dto/response.dto';
import { KasService } from '../kas/kas.service';
import {
  GetDashboardKasArusDto,
  GetKasQueryDto,
} from '../kas/dto/get.dto';
import { KasArusDashboardResponse } from '../kas/dto/response.dto';
import { CharityService } from '../charity/charity.service';
import { GetKajianQueryDto } from '../kajian/dto/query.dto';
import { KajianService } from '../kajian/kajian.service';
import { KajianResponse } from '../kajian/dto/response.dto';
import { GetLiveQueryDto } from '../live/dto/query..dto';
import { LiveService } from '../live/live.service';
import { FileTypesValidator } from '../common/pipes/file-types.validator';
import { LiveResponse } from '../live/dto/response.dto';

const allowedMimeTypes = {
  bukti: ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'],
  image: ['image/jpg', 'image/jpeg', 'image/png'],
};

@Controller('/api/users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelper: UserHelper,
    private postsService: PostsService,
    private aktivitasService: AktivitasService,
    private kajianService: KajianService,
    private liveService: LiveService,
    private kasService: KasService,
    private charityService: CharityService,
  ) { }

  @Post('/register/mesjid')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('bukti', {
      dest: './uploads/bukti/mesjid',
    }),
  )
  async registerMesjid(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .addMaxSizeValidator({
          maxSize: 50000000,
        })
        .build(),
    )
    bukti: Express.Multer.File,
    @Body() payload: RegisterMesjidDto,
  ): Promise<WebResponse<{ id: string }>> {
    const result: { id: string } = await this.userService.registerMesjid(
      payload,
      bukti,
    );
    return {
      status: 'success',
      message: 'Registrasi Mesjid Berhasil',
      data: result,
    };
  }

  @Post('/register/pengurus')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('bukti', {
      dest: './uploads/bukti/pengurus',
    }),
  )
  async registerPengurus(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .addMaxSizeValidator({
          maxSize: 50000000,
        })
        .build(),
    )
    bukti: Express.Multer.File,
    @Body() payload: RegisterPengurusDto,
  ): Promise<WebResponse<{ id: string }>> {
    const result: { id: string } = await this.userService.registerPengurus(
      payload,
      bukti,
    );
    return {
      status: 'success',
      message: 'Registrasi Pengurus Berhasil',
      data: result,
    };
  }

  @Post('/register/jamaah')
  @HttpCode(201)
  async registerJamaah(
    @Body() payload: RegisterJamaahDto,
  ): Promise<WebResponse<{ id: string }>> {
    const result: { id: string } =
      await this.userService.registerJamaah(payload);
    return {
      status: 'success',
      message: 'Registrasi Jamaah Berhasil',
      data: result,
    };
  }

  @Post('/register/penceramah')
  @HttpCode(201)
  async registerPenceramah(
    @Body() payload: RegisterPenceramahDto,
  ): Promise<WebResponse<{ id: string }>> {
    const result: { id: string } =
      await this.userService.registerPenceramah(payload);
    return {
      status: 'success',
      message: 'Registrasi Penceramah Berhasil',
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() payload: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<WebResponse<LoginResponse>> {
    const result = await this.userService.login(payload);
    response.cookie('refresh_token', result.refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    return {
      status: 'success',
      message: 'Login Berhasil',
      data: {
        accessToken: result.accessToken,
      },
    };
  }

  @Post('/refresh-token')
  async updateAccessToken(
    @Req() request: Request,
  ): Promise<WebResponse<LoginResponse>> {
    const result: string = await this.userService.updateAccessToken(
      request.cookies?.refresh_token,
    );
    return {
      status: 'success',
      message: 'Access Token Berhasil Dibuat',
      data: {
        accessToken: result,
      },
    };
  }

  //profile private
  @Get('/profile')
  @Auth()
  async getProfilePrivate(@Req() request): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.getProfile(
      request.user,
      'private',
      request,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  //profile public
  @Get('/:userId/profile')
  async getProfilePublic(
    @Req() request: any,
    @Param('userId') userId: string,
  ): Promise<WebResponse<UserResponse>> {
    const user = {
      id: userId,
      role: await this.userHelper.getUserRole(userId),
    };
    const result = await this.userService.getProfile(user, 'public', request);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/profile')
  @Auth()
  async updateProfile(
    @Req() request: any,
    @Body() payload: UpdateProfileDto,
  ): Promise<WebResponse<{ alamat: string; imam?: string }>> {
    const result = await this.userService.updateProfile(request.user, payload);
    return {
      status: 'success',
      message: 'Profile Berhasil Diperbarui',
      data: result,
    };
  }

  @Patch('/image/:type')
  @Auth()
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads/users',
    }),
  )
  async updateUserImage(
    @Req() request: any,
    @Param() param: UpdateUserImageDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    image: Express.Multer.File,
  ): Promise<WebResponse<{ photo?: string; sampul?: string }>> {
    const result = await this.userService.updateUserImage(
      request,
      param,
      image,
    );
    return {
      status: 'success',
      message: `${param.type} Pengguna Berhasil Diperbarui`,
      data: result,
    };
  }

  @Delete('/logout')
  @HttpCode(200)
  @Auth()
  async logout(
    @Req() request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<WebResponse<boolean>> {
    await this.userService.logout(request.user);
    response.cookie('refresh_token', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    return {
      status: 'success',
      message: 'Logout Berhasil',
      data: true,
    };
  }

  // private posts
  @Get('/posts')
  @Auth()
  async findAllUserPrivatePosts(
    @Req() request: any,
    @Query() query: GetPostsQueryDto,
  ): Promise<WebResponse<PostResponse[] | []>> {
    const userId: string = request.user?.id;
    const result = await this.postsService.findAllPosts(
      query,
      request,
      'private',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  // public posts
  @Get('/:userId/posts')
  async findAllUserPublicPosts(
    @Req() request: any,
    @Param('userId') userId: string,
    @Query() query: GetPostsQueryDto,
  ): Promise<WebResponse<PostResponse[] | []>> {
    const result = await this.postsService.findAllPosts(
      query,
      request,
      'public',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  // aktivitas privat
  @Get('/aktivitas')
  @Auth()
  async findAllUserPrivateAktivitas(
    @Req() request: any,
    @Query() query: GetAktivitasQueryDto,
  ): Promise<WebResponse<AktivitasResponse[] | []>> {
    const userId: string = request.user?.id;
    const result = await this.aktivitasService.findAllAktivitas(
      request,
      query,
      'private',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  //aktivitas public
  @Get('/:userId/aktivitas')
  async findAllUserPublicAktivitas(
    @Req() request: any,
    @Param('userId') userId: string,
    @Query() query: GetAktivitasQueryDto,
  ): Promise<WebResponse<AktivitasResponse[] | []>> {
    const result = await this.aktivitasService.findAllAktivitas(
      request,
      query,
      'public',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  // kajian privat
  @Get('/kajian')
  @Auth()
  async findAllUserPrivateKajian(
    @Req() request: any,
    @Query() query: GetKajianQueryDto,
  ): Promise<WebResponse<KajianResponse[] | []>> {
    const userId: string = request.user?.id;
    const result = await this.kajianService.findAllKajian(
      request,
      query,
      'private',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  //kajian public
  @Get('/:userId/kajian')
  async findAllUserPublicKajian(
    @Req() request: any,
    @Param('userId') userId: string,
    @Query() query: GetKajianQueryDto,
  ): Promise<WebResponse<KajianResponse[] | []>> {
    const result = await this.kajianService.findAllKajian(
      request,
      query,
      'public',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  // live privat
  @Get('/live')
  @Auth()
  async findAllUserPrivatelives(
    @Req() request: any,
    @Query() query: GetLiveQueryDto,
  ): Promise<WebResponse<LiveResponse[] | []>> {
    const userId: string = request.user?.id;
    const result = await this.liveService.findAllLives(
      request,
      query,
      'private',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  //live public
  @Get('/:userId/live')
  async findAllUserPublicLive(
    @Req() request: any,
    @Param('userId') userId: string,
    @Query() query: GetLiveQueryDto,
  ) {
    const result = await this.liveService.findAllLives(
      request,
      query,
      'public',
      userId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:userId/arus-kas')
  async getDashboardArusKas(
    @Req() request: any,
    @Param('userId') userId: string,
    @Query() query: GetDashboardKasArusDto,
  ): Promise<WebResponse<KasArusDashboardResponse>> {
    const result = await this.kasService.getDashboardArusKas(request, userId, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:userId/histori/transaksi')
  async getHistoryTransaksiMesjid(
    @Param('userId') userId: string,
    @Query() query: GetKasQueryDto,
  ) {
    const total = await this.charityService.getTotalMesjidTransaction(userId);
    const history = await this.charityService.getHistoryTransaksiMesjid(
      userId,
      query,
    );
    return {
      status: 'success',
      data: {
        total,
        history,
      },
    };
  }

  @Get('/:userId/infaq')
  async getInfaq(@Req() request: Request, @Param('userId') userId: string) {
    const result = await this.charityService.getInfaq(userId, request);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('infaq/donatur')
  @Auth()
  async getDonaturInfaq(@Req() request: any, @Query() query: GetKasQueryDto) {
    const result = await this.charityService.getDonaturInfaq(
      request.user.id,
      query,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('kafalah/donatur')
  @Auth()
  async getDonaturKafalah(@Req() request: any, @Query() query: GetKasQueryDto) {
    const result = await this.charityService.getDonaturKafalah(
      request.user.id,
      query,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:userId/sedekah/penerima')
  async getPenerimaSedekah(@Param('userId') userId: string) {
    const result = await this.charityService.getPenerimaSedekah(userId);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:userId/sedekah/penerima/:kategoriId')
  async getPenerimaSedekahByCategory(
    @Param('userId') userId: string,
    @Param('kategoriId', ParseIntPipe) kategoriId: number,
  ) {
    const result = await this.charityService.getPenerimaSedekah(
      userId,
      kategoriId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:userId/sedekah')
  async getCountSedekah(@Param('userId') userId: string) {
    const result = await this.charityService.getCountSedekah(userId);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/sedekah/donatur')
  @Auth()
  async getDonaturSedekah(@Req() request: any, @Query() query: GetKasQueryDto) {
    const result = await this.charityService.getSedekah(request.user.id, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/sedekah/donatur/:kategoriId')
  @Auth()
  async getDonaturSedekahByCategory(
    @Req() request: any,
    @Param('kategoriId', ParseIntPipe) kategoriId: number,
    @Query() query: GetKasQueryDto,
  ) {
    const result = await this.charityService.getSedekah(
      request.user.id,
      query,
      kategoriId,
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('/bank')
  @Auth()
  async addUserBank(
    @Req() request: any,
    @Body() payload: CreateUserBankDto,
  ): Promise<WebResponse<UserBankResponse>> {
    const result = await this.userService.addUserBank(request.user, payload);
    return {
      status: 'success',
      message: 'Akun Bank Berhasil Ditambahkan',
      data: result
    }
  }

  @Patch('/bank/:userBankId')
  @Auth()
  async updateUserBank(
    @Param('userBankId', ParseIntPipe) userBankId: number,
    @Req() request: any,
    @Body() payload: UpdateUserBankDto,
  ): Promise<WebResponse<UserBankResponse>> {
    const result = await this.userService.updateUserBank(request.user, userBankId, payload);
    return {
      status: 'success',
      message: 'Akun Bank Berhasil Diubah',
      data: result
    }
  }

  @Get('/bank')
  @Auth()
  async getUserBank(
    @Req() request: any,
  ): Promise<WebResponse<UserBankResponse[]>> {
    const result = await this.userService.getUserBank(request.user);
    return {
      status: 'success',
      data: result
    }
  }
}

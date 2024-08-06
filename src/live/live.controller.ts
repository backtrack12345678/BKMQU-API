import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  Req,
  UploadedFile,
  ParseFilePipe,
  Query,
} from '@nestjs/common';
import { LiveService } from './live.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { UpdateLiveDto } from './dto/update-live.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateFileType } from '../common/pipes/file-validator';
import { GetLiveQueryDto } from './dto/query..dto';

const allowedMimeTypes = {
  thumbnail: ['image/png', 'image/jpg', 'image/jpeg'],
};

@Controller('/api/live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Post('/')
  @Auth()
  @Roles(Role.PENCERAMAH)
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      dest: './uploads/live',
      fileFilter(req, file, cb) {
        validateFileType(allowedMimeTypes, file, cb);
      },
    }),
  )
  async createLive(
    @Req() request: any,
    @Body() payload: CreateLiveDto,
    @UploadedFile(ParseFilePipe)
    thumbnail: Express.Multer.File,
  ) {
    const result = await this.liveService.createLive(
      request,
      payload,
      thumbnail,
    );
    return {
      status: 'success',
      message: 'Siaran Langsung Berhasil Dibuat',
      data: result,
    };
  }

  @Get('/')
  async findAllLives(@Req() request: any, @Query() query?: GetLiveQueryDto) {
    const result = await this.liveService.findAllLives(
      request,
      query,
      'public',
    );
    return {
      status: 'success',
      data: result,
    };
  }

  @Get('/:liveId')
  async findOneLive(@Req() request: any, @Param('liveId') liveId: string) {
    const result = await this.liveService.findOneLive(request, liveId);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:liveId')
  updateLive(@Param('id') id: string, @Body() updateLiveDto: UpdateLiveDto) {
    return this.liveService.updateLive(+id, updateLiveDto);
  }

  @Delete('/:liveId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  async removeLive(@Req() request: any, @Param('liveId') liveId: string) {
    await this.liveService.removeLive(request.user, liveId);
    return {
      status: 'success',
      message: 'Siaran Langsung Berhasil Dihapus',
      data: true,
    };
  }
}

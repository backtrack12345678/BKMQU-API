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
  Query,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { LiveService } from './live.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { UpdateLiveDto } from './dto/update-live.dto';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetLiveQueryDto } from './dto/query..dto';
import { FileTypesValidator } from '../common/pipes/file-types.validator';
import { WebResponse } from '../model/web.model';
import { LiveResponse } from './dto/response.dto';

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
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createLive(
    @Req() request: any,
    @Body() payload: CreateLiveDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FileTypesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    thumbnail: Express.Multer.File,
  ): Promise<WebResponse<LiveResponse>> {
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
  async findAllLives(
    @Req() request: any,
    @Query() query?: GetLiveQueryDto,
  ): Promise<WebResponse<LiveResponse[] | []>> {
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
  async findOneLive(
    @Req() request: any,
    @Param('liveId') liveId: string,
  ): Promise<WebResponse<LiveResponse>> {
    const result = await this.liveService.findOneLive(request, liveId);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('/:liveId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  updateLive(@Param('id') id: string, @Body() updateLiveDto: UpdateLiveDto) {
    return this.liveService.updateLive(+id, updateLiveDto);
  }

  @Delete('/:liveId')
  @Auth()
  @Roles(Role.PENCERAMAH)
  async removeLive(
    @Req() request: any,
    @Param('liveId') liveId: string,
  ): Promise<WebResponse<boolean>> {
    await this.liveService.removeLive(request.user, liveId);
    return {
      status: 'success',
      message: 'Siaran Langsung Berhasil Dihapus',
      data: true,
    };
  }
}

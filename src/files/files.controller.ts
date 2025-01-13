import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import * as fs from 'fs';

@Controller('/api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/users/:filename')
  async getUserPhoto(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'users',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/bukti/mesjid/:filename')
  @Auth()
  @Roles(Role.ADMIN)
  async getMesjidBukti(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'bukti/mesjid',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/bukti/pengurus/:filename')
  @Auth()
  async getPengurusBukti(
    @Req() request: any,
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    await this.filesService.checkBuktiPengurusOwner(request.user.id, filename);
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'bukti/pengurus',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/posts/:filename')
  async getPostsMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'posts',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/aktivitas/:filename')
  async getAktivitasMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'aktivitas',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/kajian/:filename')
  async getKajianMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'kajian',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/infaq/:filename')
  async getInfaqFile(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'infaq',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/arus-kas/:filename')
  async getArusKasPhoto(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'arus-kas',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }

  @Get('/live/:filename')
  async getLiveThumbnail(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.filesService.getFileFromAWS(
      filename,
      'live',
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }
}

import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { Auth } from '../common/auth.decorator';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';

@Controller('/api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/users/:filename')
  getUserPhoto(@Param('filename') filename: string, @Res() response: Response) {
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'users',
    );
    response.setHeader('Content-Type', mimeType);
    fileStream.pipe(response);
  }

  @Get('/bukti/mesjid/:filename')
  @Auth()
  @Roles(Role.ADMIN)
  getMesjidBukti(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'bukti/mesjid',
    );
    response.setHeader('Content-Type', mimeType);
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
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'bukti/pengurus',
    );
    response.setHeader('Content-Type', mimeType);
    fileStream.pipe(response);
  }

  @Get('/posts/:filename')
  getPostsMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'posts',
    );
    response.setHeader('Content-Type', mimeType);
    fileStream.pipe(response);
  }

  @Get('/aktivitas/:filename')
  getAktivitasMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'aktivitas',
    );
    response.setHeader('Content-Type', mimeType);
    fileStream.pipe(response);
  }

  @Get('/kajian/:filename')
  getKajianMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'kajian',
    );
    response.setHeader('Content-Type', mimeType);
    fileStream.pipe(response);
  }

  @Get('/infaq/:filename')
  getInfaqFile(@Param('filename') filename: string, @Res() response: Response) {
    const { fileStream, mimeType } = this.filesService.serveFiles(
      filename,
      'infaq',
    );
    response.setHeader('Content-Type', mimeType);
    fileStream.pipe(response);
  }
}

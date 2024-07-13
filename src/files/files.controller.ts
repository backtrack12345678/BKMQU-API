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
    const file = this.filesService.serveFiles(filename, 'users');
    file.pipe(response);
  }

  @Get('/bukti/mesjid/:filename')
  @Auth()
  @Roles(Role.ADMIN)
  getMesjidBukti(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const file = this.filesService.serveFiles(filename, 'bukti/mesjid');
    file.pipe(response);
  }

  @Get('/bukti/pengurus/:filename')
  @Auth()
  async getPengurusBukti(
    @Req() request: any,
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    await this.filesService.checkBuktiPengurusOwner(request.user.id, filename);
    const file = this.filesService.serveFiles(filename, 'bukti/pengurus');
    file.pipe(response);
  }

  @Get('/posts/:filename')
  getPostsMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const file = this.filesService.serveFiles(filename, 'posts');
    file.pipe(response);
  }

  @Get('/aktivitas/:filename')
  getAktivitasMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const file = this.filesService.serveFiles(filename, 'aktivitas');
    file.pipe(response);
  }

  @Get('/kajian/:filename')
  getKajianMedia(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const file = this.filesService.serveFiles(filename, 'kajian');
    file.pipe(response);
  }

  @Get('/infaq/:filename')
  getInfaqFile(@Param('filename') filename: string, @Res() response: Response) {
    const file = this.filesService.serveFiles(filename, 'infaq');
    file.pipe(response);
  }
}

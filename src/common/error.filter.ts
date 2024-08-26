import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from '../files/files.service';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(private filesService: FilesService) { }

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    //single file
    if (request.file) {
      this.filesService.deleteSingleFile(request.file);
    }

    //multi file
    if (request.files) {
      this.filesService.deleteMultiFiles(request.files);
    }

    // const getFiles = (
    //   files:
    //     | Express.Multer.File
    //     | Express.Multer.File[]
    //     | Record<string, Express.Multer.File>
    //     | undefined,
    // ) => {
    //   if (!files) return [];
    //   if (Array.isArray(files)) return files;
    //   return Object.values(files);
    // };

    // const filePaths = getFiles(request.files);
    // console.log(filePaths);

    // filePaths.forEach((file) => {
    //   fs.unlink(file.path, (err) => {
    //     if (err) {
    //       console.error(`Failed to delete file: ${file}`, err);
    //     }
    //   });
    // });

    if (exception instanceof BadRequestException) {
      response.status(exception.getStatus()).json({
        status: 'error',
        message: exception.getResponse()['message'],
      });
    } else if (exception instanceof NotFoundException) {
      response.status(exception.getStatus()).json({
        status: 'error',
        message: exception.getResponse()['message'],
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        status: 'error',
        message: exception.getResponse(),
      });
    } else {
      console.log(exception);
      response.status(500).json({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
    }
  }
}

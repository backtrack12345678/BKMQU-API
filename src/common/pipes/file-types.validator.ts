// import { MimeType } from 'file-type/core';
// import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';
// import * as FileType from 'file-type';

// @Injectable()
// export class FileTypePipe implements PipeTransform {
//   constructor(private readonly allowedMimeTypes: string[]) {}

//   async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
//     const fileExt: string = extname(file.originalname).toLowerCase();
//     const allowedExtensions: string[] = this.mimeTypesToExtensions(
//       this.allowedMimeTypes,
//     );

//     if (!allowedExtensions.includes(fileExt)) {
//       throw new BadRequestException('File type not allowed');
//     }
//     console.log(file);

//     // const buffer = file.buffer.slice(0, 4100); // Read the first 4100 bytes
//     // const fileType = await FileType.fromBuffer(buffer);

//     // if (!fileType || !this.allowedMimeTypes.includes(fileType.mime)) {
//     //   throw new BadRequestException('File type not allowed');
//     // }

//     return file;
//   }

//   private mimeTypesToExtensions(mimeTypes: string[]): string[] {
//     const extensions: string[] = [];
//     mimeTypes.forEach((mimeType) => {
//       const ext = mimeType.split('/')[1];
//       extensions.push(ext);
//     });
//     return extensions;
//   }
// }

import { Injectable } from '@nestjs/common';
import { FileValidator } from '@nestjs/common';

@Injectable()
export class FileTypesValidator extends FileValidator {
  validationOptions: Record<string, any>;

  async isValid(file: Express.Multer.File): Promise<boolean> {
    const fileExt: string = extname(file.originalname).toLowerCase();
    // const fileType = await import('file-type');
    // const { ext, mime } = await fileType.fileTypeFromFile(file.path);
    const allowedExtensions: string[] = this.mimeTypesToExtensions(
      this.validationOptions.mimeTypes[file.fieldname],
    );

    return (
      allowedExtensions.includes(fileExt) &&
      this.validationOptions.mimeTypes[file.fieldname].includes(file.mimetype)
    );
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `File type for ${file.fieldname} not allowed`;
  }

  private mimeTypesToExtensions(mimeTypes: string[]): string[] {
    const extensions: string[] = [];
    mimeTypes.forEach((mimeType) => {
      const ext = mimeType.split('/')[1];
      extensions.push(`.${ext}`);
    });
    return extensions;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prismaService: PrismaService) {}

  serveFiles(filename: string, folder: string) {
    const filePath = join(process.cwd(), `uploads/${folder}/${filename}`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File Tidak Ditemukan');
    }

    return fs.createReadStream(filePath);
  }

  async checkBuktiPengurusOwner(
    mesjidUserId: string,
    filename: string,
  ): Promise<void> {
    const bukti = await this.prismaService.dokumen_Bukti.findFirst({
      where: {
        nama: filename,
        user: {
          pengurus: {
            mesjid: {
              userId: mesjidUserId,
            },
          },
        },
      },
    });

    if (!bukti) {
      throw new NotFoundException('File Tidak Ditemukan');
    }
  }

  // deleteFiles(
  //   fileOrFiles:
  //     | Express.Multer.File[]
  //     | Express.Multer.File
  //     | { path: string }[],
  // ): void {
  //   const filePaths = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

  //   filePaths.forEach((file) => {
  //     if (
  //       typeof file === 'object' &&
  //       'path' in file &&
  //       fs.existsSync(file.path)
  //     ) {
  //       fs.unlink(file.path, (err) => {
  //         if (err) {
  //           console.error(`Failed to delete file: ${file.path}`, err);
  //         }
  //       });
  //     }
  //   });
  // }

  deleteSingleFile(file: Express.Multer.File | { path: string }): void {
    if (fs.existsSync(file.path)) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${file.path}`, err);
        }
      });
    } else {
      console.error(`File not found: ${file.path}`);
    }
  }

  deleteMultiFiles(
    files:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
      | { path: string }[]
      | any,
  ): void {
    if (Array.isArray(files)) {
      const filePaths = files.map((file) =>
        typeof file === 'object' ? file.path : file,
      );
      filePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Failed to delete file: ${filePath}`, err);
            }
          });
        } else {
          console.error(`File not found: ${filePath}`);
        }
      });
    } else if (typeof files === 'object') {
      for (const fieldname in files) {
        const fieldFiles = files[fieldname];

        fieldFiles.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlink(file.path, (err) => {
              if (err) {
                console.error(`Failed to delete file: ${file.path}`, err);
              }
            });
          } else {
            console.error(`File not found: ${file.path}`);
          }
        });
      }
    } else {
      console.error('Invalid file input');
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';
import { PrismaService } from '../common/prisma.service';
import { fromFile } from 'file-type';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { NodeJsClient } from '@smithy/types';
import { Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class FilesService {
  private region: string;
  private s3: S3Client;
  private bucket: string;

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.region =
      this.configService.get<string>('S3_REGION') || 'ap-southeast-1';
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    }) as NodeJsClient<S3Client>;
    this.bucket = this.configService.get<string>('S3_BUCKET') || 'myeracipta';
  }

  async uploadFileToAWS(file: Express.Multer.File, folder: string) {
    const originalName = file.originalname.split('.')[0]; // Nama asli file tanpa ekstensi
    const uniqueFilename = `${originalName}-${uuidv4()}`;

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key: `${folder}/${uniqueFilename}`,
        Body: Readable.from(file.buffer),
        ContentType: file.mimetype,
      },
      queueSize: 5,
    });

    try {
      const response = await upload.done();
      // const response = await this.s3.send(
      //   new PutObjectCommand({
      //     Bucket: this.bucket,
      //     Key: `${folder}/${uniqueFilename}`,
      //     Body: file.buffer,
      //     ContentType: file.mimetype,
      //   }),
      // );
      if (response.$metadata.httpStatusCode === 200) {
        return {
          filename: uniqueFilename,
          url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${folder}/${uniqueFilename}`,
        };
      }
      throw new Error('File Gagal Di Upload');
    } catch (error) {
      console.log('Gagal menyimpan ke s3', error);
      throw error;
    }
  }

  async getFileFromAWS(filename: string, folder: string) {
    const input: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${folder}/${filename}`,
    };

    try {
      const response: GetObjectCommandOutput = await this.s3.send(
        new GetObjectCommand(input),
      );
      return {
        fileStream: response.Body as Readable,
        mime: response.ContentType,
      };
    } catch (error) {
      if (error.$metadata.httpStatusCode === 404) {
        throw new NotFoundException('File Tidak Ditemukan');
      }
      console.log('Gagal mengambil file dari s3', error);
      throw error;
    }
  }

  async deleteFileFromAWS(filename: string, folder: string) {
    const input: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${folder}/${filename}`,
    };

    try {
      const response: DeleteObjectCommandOutput = await this.s3.send(
        new DeleteObjectCommand(input),
      );
    } catch (error) {
      console.log('Gagal menghapus file dari s3', error);
      throw error;
    }
  }

  async serveFiles(filename: string, folder: string) {
    const filePath = join(process.cwd(), `uploads/${folder}/${filename}`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File Tidak Ditemukan');
    }

    const { mime } = await fromFile(filePath);
    const fileStream = fs.createReadStream(filePath);
    return { fileStream, mime };
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

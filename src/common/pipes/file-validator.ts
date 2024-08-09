import { BadRequestException } from '@nestjs/common';
import { fromFile } from 'file-type';

export async function validateFileType(
  allowedMimeTypes: Record<string, string[]>,
  file: Express.Multer.File | any,
  cb: (error: Error | null, acceptFile: boolean) => void,
): Promise<void> {
  console.log(file);

  const { mime } = await fromFile(file.path);
  allowedMimeTypes[file.fieldname].includes(mime)
    ? cb(null, true)
    : cb(
        new BadRequestException(`File type for ${file.fieldname} not allowed`),
        false,
      );
}

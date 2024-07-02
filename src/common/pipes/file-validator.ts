import { BadRequestException } from '@nestjs/common';

export function validateFileType(
  allowedMimeTypes: Record<string, string[]>,
  file: Express.Multer.File | any,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  allowedMimeTypes[file.fieldname].includes(file.mimetype)
    ? cb(null, true)
    : cb(
        new BadRequestException(`File type for ${file.fieldname} not allowed`),
        false,
      );
}

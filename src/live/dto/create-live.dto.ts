import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinDate,
  Validate,
  ValidateIf,
} from 'class-validator';

export class CreateLiveDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  judul: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  mulai: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ValidateIf((o) => o.mulai)
  @Validate((o) => o.selesai > o.mulai, {
    message: 'Selesai harus lebih besar dari mulai',
  })
  selesai: Date;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(https?:\/\/)?(www\.youtube\.com|m\.youtube\.com|youtu\.be)\/.*$/,
    {
      message:
        'Link must be a valid YouTube URL (www.youtube.com, m.youtube.com, or youtu.be)',
    },
  )
  link: string;
}

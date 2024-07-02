import { Transform } from 'class-transformer';
import {
  IsString,
  MaxLength,
  Validate,
  IsNotEmpty,
  IsDate,
  MinDate,
} from 'class-validator';

export class CreateAktivitasDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  judul: string;

  @IsNotEmpty()
  @IsString()
  captions: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  mulai: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @Validate((value, args) => value > args.object.mulai, {
    message: 'selesai harus lebih besar dari mulai',
  })
  selesai: Date;
}

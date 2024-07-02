import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateKajianDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  judul: string;

  @IsNotEmpty()
  @IsString()
  deskripsi: string;
}

export class CreateKajianContentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  judul: string;

  @IsNotEmpty()
  @IsString()
  captions: string;
}

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePodcastDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  judul: string;

  @IsNotEmpty()
  @IsString()
  captions: string;
}

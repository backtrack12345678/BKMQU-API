import { IsNotEmpty, IsString } from 'class-validator';

export class KajianContentParam {
  @IsNotEmpty()
  @IsString()
  kajianId: string;

  @IsNotEmpty()
  @IsString()
  kajianContentId: string;
}

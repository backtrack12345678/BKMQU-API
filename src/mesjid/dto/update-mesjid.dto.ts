import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePengurusStatusParamDto {
  @IsNotEmpty()
  @IsString()
  pengurusUserId: string;

  @IsString()
  @IsIn(['DITERIMA', 'DITOLAK'], {
    message: 'Status harus "DITERIMA" atau "DITOLAK"',
  })
  status: string;
}

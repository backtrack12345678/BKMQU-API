import { IsIn, IsString } from 'class-validator';

export class UpdateMesjidStatusParamDto {
  @IsString()
  mesjidUserId: string;

  @IsString()
  @IsIn(['DITERIMA', 'DITOLAK'], {
    message: 'Status harus "DITERIMA" atau "DITOLAK"',
  })
  status: string;
}

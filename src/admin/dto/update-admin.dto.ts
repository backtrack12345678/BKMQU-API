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

export class WithdrawParamDto {
  @IsString()
  withdrawId: string;

  @IsString()
  @IsIn(['DITERIMA', 'DITOLAK'], {
    message: 'Status harus "DITERIMA" atau "DITOLAK"',
  })
  status: string;
}
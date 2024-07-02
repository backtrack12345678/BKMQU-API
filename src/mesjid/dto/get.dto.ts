import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PengurusQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(['DITERIMA', 'PENDING', 'DITOLAK'], {
    message: 'Status harus "DITERIMA", "PENDING" atau "DITOLAK"',
  })
  status?: string;
}

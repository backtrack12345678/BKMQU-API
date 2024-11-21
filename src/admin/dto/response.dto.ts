export class GetMesjidResponse {
  id: string;
  phone: string;
  email: string;
  noRegister: string;
  nama: string;
  status: string;
  kecamatan: string;
  SKM: string;
}

export class GetUserBankResponse {
  id: number;
  nama: string;
  namaBank: string;
  noRekening: string;
  status: string;
  createdAt: Date;
}
export class GetUserDeactivationResponse {
  userId: string;
  nama: string;
  email: string;
  phone: string;
  role: string;
  alasan: string;
  acceptTerm: boolean;
  createdAt: Date;
  updatedAt: Date;
}
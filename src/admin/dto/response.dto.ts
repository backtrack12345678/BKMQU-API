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
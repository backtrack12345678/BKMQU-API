export class User {
  id: string;
  phone: string;
  email: string;
  role?: string;
}

export class File {
  nama: string;
  path?: string;
}

export class Wilayah {
  nama: string;
}

export class MesjidResult {
  id: number;
  noRegister: string;
  userId?: string;
  imam?: string;
  _count?: {
    jamaah?: number;
  };
  jamaah?: number;
}

export class PengurusResult {
  id: number;
  jabatan: string;
  uraianJabatan: string;
}

export class JamaahResult {
  id: number;
  mesjid: MesjidResult;
}

export class PenceramahResult {
  keahlian: string;
}
export class UserResult extends User {
  photo: File;
  sampul: File;
  detailUser: {
    nama: string;
    alamat: string;
    kecamatan: Wilayah;
    kota_kab: Wilayah;
    saldo?: bigint;
  };
  mesjid?: MesjidResult;
  pengurus?: PengurusResult;
  jamaah?: JamaahResult;
  penceramah?: PenceramahResult;
}

export class UserResponse extends User {
  nama: string;
  kota_kab: string;
  kecamatan: string;
  alamat: string;
  saldo?: number;
  photo: string;
  sampul?: string;
  mesjid?: MesjidResult;
  pengurus?: PengurusResult;
  jamaah?: {
    id: number;
    mesjidId: number;
    mesjidUserId: string;
  };
  penceramah?: PenceramahResult;
}

export class UserBankResponse {
  id: number;
  nama: string;
  namaBank: string;
  noRekening: string;
  status: string;
  createdAt: Date;
}

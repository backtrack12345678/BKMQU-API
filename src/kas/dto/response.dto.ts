export class KasResponse {
  id: string;
  nama: string;
  saldo: number;
  bank?: string;
}
export class KasArusResponse {
  id: number;
  tipe: string;
  kategori: string;
  metode: string;
  keterangan: string;
  jumlah: number;
  dokumen?: string;
  createdAt: Date;
}

export class BankMutasi {
  jenis: string;
  namaBank: string;
  namaRekening: string;
  nomorRekening: string;
}

export class KasMutasiResponse {
  id: number;
  jumlah: number;
  fromKas: KasResponse;
  toKas: KasResponse;
  createdAt: Date;
}

export class TotalKasResponse {
  totalMasuk: number;
  totalKeluar: number;
  totalInitial: number;
}

export class KasResponse {
  id: string;
  nama: string;
  saldo: number;
  bank?: string;
}
export class KuotaResponse {
  kuota: number;
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

export class KasMutasiResponse {
  id: number;
  jumlah: number;
  fromKas: KasResponse;
  toKas: KasResponse;
  createdAt: Date;
}

export class KasArusDashboardResponse {
  totalMasuk: number;
  totalKeluar: number;
  saldo: number;
  kasArus: KasArusResponse[];
}
export class KasResponse {
  id: string;
  jenis: string;
  namaBank?: string;
  namaRek?: string;
  nomorRek?: string;
  saldoAwal: number;
  bulan: string;
  tahun: number;
}

export class GetAllKasResponse {
  namaMesjid: string;
  kas: KasResponse[];
}

export class ArusKasResult {
  id?: number;
  status: string;
  kategori: string;
  uraian: string;
  metode: string;
  jumlah?: bigint;
  namaPenerimaKeluar?: string;
  tanggal: number;
  bulan: string;
  tahun: number;
}

export class ArusKasResponse extends ArusKasResult {
  nama?: string;
  debit: number;
  kredit: number;
  initialSaldo?: number;
}

export class KasMutasiResponse extends ArusKasResponse {}

export class BankMutasi {
  jenis: string;
  namaBank: string;
  namaRekening: string;
  nomorRekening: string;
}

export class GetKasMutasiResponse {
  jumlah: number;
  tanggal: number;
  bulan: string;
  tahun: number;
  pengirim?: BankMutasi;
  penerima?: BankMutasi;
}

export class TotalKasResponse {
  totalMasuk: number;
  totalKeluar: number;
  totalInitial: number;
}

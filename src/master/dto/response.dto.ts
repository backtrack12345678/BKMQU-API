export class MesjidResponse {
  id: string;
  mesjidId: number;
  nama: string;
  noRegister: string;
  alamat: string | null;
  photo: string;
}

export class PenceramahResponse {
  id: string;
  penceramahId: number;
  nama: string;
  keahlian: string;
  photo: string;
}

export class KecamatanResponse {
  id: number;
  kode: string;
  nama: string;
  kota_kab: {
    nama: string;
  };
  provinsi: {
    nama: string;
  };
}

export class BankResponse {
  id: number;
  nama: string;
}

export class Surah {
  id: number;
  namaSurah: string;
}

export class Ayat {
  id: number;
  surahId: number;
  nomorAyat: number;
  teksArab: string;
  terjemahan: string;
  teksLatin: string;
}

export class AlquranResponse extends Surah {
  ayat?: Ayat[];
}

export class KategoriSedekahResponse {
  kategoriId: number;
  nama: string;
}

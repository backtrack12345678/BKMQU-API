export class WithdrawResponse {
  id: string;
  jumlah: number;
  status: string;
  nama: string;
  role:string;
  noRekening: string;
  namaBank: string;
  createdAt: Date;
}

export class SaldoResponse {
  saldo: number;
}
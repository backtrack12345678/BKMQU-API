export class GetProfileResponse {
  id: string;
  phone: string;
  email: string;
  nama: string;
  kecamatan: string;
  alamat: string | null;
  imam?: string | null;
  jamaah?: number;
  photo: string;
  sampul: string | null;
}

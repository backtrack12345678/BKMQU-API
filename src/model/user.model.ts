export class RegisterMesjidRequest {
  phone: string;
  password: string;
  confirm_password: string;
  email: string;
  nama: string;
  kecamatan_id: number;
  no_register: string;
  accept_term: boolean;
  otp: string;
  filename: string;
  filepath: string;
}

export class UserResponse {
  id: string;
}

export class Auth {
  id: string;
  role: string;
}

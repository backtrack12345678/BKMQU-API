export class Aktivitas {
  id: string;
  userId: string;
  judul: string;
  captions: string;
}

export class Media {
  nama: string;
}

export class Dokumen {
  nama: string;
}

export class AktivitasResult extends Aktivitas {
  media: Media[] | [];
  dokumen: Dokumen[] | [];
  createdAt: Date;
}

export class AktivitasResponse extends Aktivitas {
  media: string[] | [];
  dokumen: string[] | [];
  createdAt: Date;
}

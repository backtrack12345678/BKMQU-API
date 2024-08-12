export class Live {
  id: string;
  userId: string;
  link: string;
  mulai: Date;
  selesai: Date;
  createdAt: Date;
}
export class Thumbnail {
  nama: string;
  path: string;
}

export class LiveResult extends Live {
  thumbnail: Thumbnail;
}

export class LiveResponse extends Live {
  thumbnail: string;
}

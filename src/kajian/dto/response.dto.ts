export class Kajian {
  id: string;
  userId: string;
  judul: string;
  deskripsi: string;
  createdAt: Date;
}

export class File {
  nama: string;
  path: string;
}

export class KajianResult extends Kajian {
  thumbnail: File;
}

export class KajianResponse extends Kajian {
  thumbnail: string;
}

export class KajianContent {
  id: string;
  kajianId: string;
  judul: string;
  captions: string;
  createdAt: Date;
}

export class KajianContentResult extends KajianContent {
  kajian: {
    userId: string;
  };
  thumbnail: File;
  media: File;
}

export class KajianContentResponse extends KajianContent {
  userId: string;
  thumbnail: string;
  media: string;
}

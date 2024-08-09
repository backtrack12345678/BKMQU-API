export class Post {
  id: string;
  userId: string;
  captions: string;
}

export class PostResponse extends Post {
  media: MediaResponse[] | [];
  createdAt: Date;
}

export class PostResult extends Post {
  media: MediaResult[] | [];
  createdAt: Date;
}

export class MediaResult {
  nama: string;
  type: string;
}

export class MediaResponse {
  url: string;
  type: string;
}

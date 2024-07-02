export class Post {
  id: string;
  userId: string;
  captions: string;
}

export class PostResponse extends Post {
  media: string[] | [];
  createdAt: Date;
}

export class PostResult extends Post {
  media: Media[] | [];
  createdAt: Date;
}

export class Media {
  nama: string;
}

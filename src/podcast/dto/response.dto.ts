class Podcast {
  id: string;
  userId: string;
  judul: string;
  captions: string;
  createdAt: Date;
}

class PodcastResult extends Podcast {
  thumbnail: {
    nama: string;
  };
  video: {
    nama: string;
  };
}

class PodcastResponse extends Podcast {
  thumbnail: string;
  video: string;
}

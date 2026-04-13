export interface IBookLocation {
  city?: string;
}

export interface IBook {
  id: string;
  title: string;
  author: string;
  genres: string[];
  offeredAgo?: string;
  language: string;
  description: string;
  condition: string;
  coverPhotoUrl: string;
  offeredBy?: string;
  ownerId: string;
  coverPhotoUrls?: string[];
  location?: IBookLocation;
  bookLocation?: string;
  owner?: {
    id: string;
    name: string;
  };
}

export interface IGenre {
  id: string;
  name: string;
}

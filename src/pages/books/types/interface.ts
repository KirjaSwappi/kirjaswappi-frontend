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
  ownerName: string;
  ownerId: string;
  ownerProfilePhoto: string;
  coverPhotoUrls?: string[];
  location?: IBookLocation;
  owner: {
    id: string;
    name: string;
    location?: IBookLocation;
  };
}

export interface IGenre {
  id: string;
  name: string;
}

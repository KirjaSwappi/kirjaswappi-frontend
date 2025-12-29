export interface IBook {
  id: string;
  title: string;
  author: string;
  genres: string[];
  offeredAgo: string;
  language: string;
  description: string;
  condition: string;
  coverPhotoUrl: string;
  ownerName: string;
  ownerId: string;
  ownerProfilePhoto: string;
  coverPhotoUrls?: string[];
  owner: {
    id: string;
    name: string;
  };
}

export interface IGenre {
  id: string;
  name: string;
}

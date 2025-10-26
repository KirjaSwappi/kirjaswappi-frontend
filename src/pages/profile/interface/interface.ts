export interface IEditInfo {
  id?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  aboutMe?: string | undefined;
  streetName?: string | undefined;
  houseNumber?: string | undefined;
  zipCode?: number | undefined;
  city?: string | undefined;
  country?: string | undefined;
  phoneNumber?: string | undefined;
  favGenres: string[];
}

export interface IGenreItemType {
  name: string;
  id: string | undefined;
}

export interface IChildGenre {
  id: string;
  name: string;
}

export interface IParentGenre {
  id: string;
  name: string;
  childGenres: IChildGenre[];
}

export interface IGenresResponse {
  parentGenres: {
    [key: string]: IParentGenre;
  };
}

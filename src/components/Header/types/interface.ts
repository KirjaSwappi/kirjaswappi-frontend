export type TChildGenre = {
  id: string;
  name: string;
};
export interface IGenreWithIcon {
  id: string;
  name: string;
  icon?: string;
  childGenres: TChildGenre[];
}

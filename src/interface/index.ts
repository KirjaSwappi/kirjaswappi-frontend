export interface IFilterData {
  genre: string[];
  condition: string[];
  language: string[];
  city?: string;
  sortBy?: string[];
  search?: string;
  pageNumber?: number;
}

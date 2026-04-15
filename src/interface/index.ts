export interface IFilterData {
  genre: string[];
  condition: string[];
  language: string[];
  city?: string;
  sortBy?: string[];
  sortOrder?: 'asc' | 'desc';
  search?: string;
  pageNumber?: number;
}

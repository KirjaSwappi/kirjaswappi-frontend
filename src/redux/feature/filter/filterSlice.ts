import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterItemEnum } from '../../../utility/enum';

export interface IFilterInitialState {
  filter: {
    genre: string[];
    language: string[];
    condition: string[];
    city?: string;
    search: string;
    sortBy: string[];
    sortOrder: 'asc' | 'desc';
    pageNumber: number;
    hasMore: boolean;
  };
  isFilterOpen: boolean;
  isCategoryOrFilterOrSortBy: FilterItemEnum | null;
}

const initialState: IFilterInitialState = {
  filter: {
    genre: [],
    language: [],
    condition: [],
    city: '',
    sortBy: [],
    sortOrder: 'asc',
    search: '',
    pageNumber: 0,
    hasMore: false,
  },
  isFilterOpen: false,
  isCategoryOrFilterOrSortBy: null,
};
const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    setCityFilter: (state, action: PayloadAction<string>) => {
      state.filter.city = action.payload;
    },
    setGenreFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.genre = [...action.payload];
    },
    setLanguageFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.language = [...action.payload];
    },
    setConditionFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.condition = [...action.payload];
    },
    setSortByFilter: (state, action: PayloadAction<string[]>) => {
      state.filter.sortBy = [...action.payload];
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.filter.sortOrder = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.filter.hasMore = action.payload;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.filter.pageNumber = action.payload;
    },
    setFilterOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterOpen = action.payload;
    },
    setIsCategoryOrFilterOrSortBy: (state, action: PayloadAction<FilterItemEnum | null>) => {
      state.isCategoryOrFilterOrSortBy = action.payload;
    },
    clearAllFilters: (state) => {
      state.filter.genre = [];
      state.filter.language = [];
      state.filter.condition = [];
      state.filter.city = '';
      state.filter.pageNumber = 0;
      state.filter.search = '';
      state.filter.sortBy = [];
      state.filter.sortOrder = 'asc';
    },
  },
});

export const {
  setGenreFilter,
  setLanguageFilter,
  setConditionFilter,
  setSearch,
  setCityFilter,
  setHasMore,
  setPageNumber,
  setFilterOpen,
  clearAllFilters,
  setIsCategoryOrFilterOrSortBy,
  setSortByFilter,
  setSortOrder,
} = filterSlice.actions;
export default filterSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterItemEnum } from '../../../utility/enum';

export interface IFilterInitialState {
  filter: {
    genre: string[];
    language: string[];
    condition: string[];
    search: string;
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
    search: '',
    pageNumber: 0,
    hasMore: false,
  },
  isFilterOpen: false,
  isCategoryOrFilterOrSortBy: null,
};
const filterSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.filter.search = action.payload;
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
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.filter.hasMore = action.payload;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.filter.pageNumber = action.payload;
    },
    setFilterOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterOpen = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    setIsCategoryOrFilterOrSortBy: (state, action: PayloadAction<FilterItemEnum | null>) => {
      state.isCategoryOrFilterOrSortBy = action.payload;
    },
    clearAllFilters: (state) => {
      state.filter.genre = [];
      state.filter.language = [];
      state.filter.condition = [];
      state.filter.search = '';
    },
  },
});

export const {
  setGenreFilter,
  setLanguageFilter,
  setConditionFilter,
  setSearch,
  setHasMore,
  setPageNumber,
  setFilterOpen,
  setSearchFilter,
  clearAllFilters,
  setIsCategoryOrFilterOrSortBy,
} = filterSlice.actions;
export default filterSlice.reducer;

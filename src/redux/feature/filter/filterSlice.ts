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
  isCategoryOrFilter: FilterItemEnum | null;
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
  isCategoryOrFilter: null,
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
    setIsCategoryOrFilter: (state, action: PayloadAction<FilterItemEnum | null>) => {
      state.isCategoryOrFilter = action.payload;
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
  setIsCategoryOrFilter,
} = filterSlice.actions;
export default filterSlice.reducer;

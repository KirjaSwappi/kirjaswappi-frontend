import { describe, it, expect } from 'vitest';
import filterReducer, {
  setSearch,
  setCityFilter,
  setGenreFilter,
  setLanguageFilter,
  setConditionFilter,
  setSortByFilter,
  setSortOrder,
  setHasMore,
  setPageNumber,
  setFilterOpen,
  setIsCategoryOrFilterOrSortBy,
  clearAllFilters,
  IFilterInitialState,
} from '../../redux/feature/filter/filterSlice';
import { FilterItemEnum } from '../../utility/enum';

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

describe('filterSlice', () => {
  it('should return the initial state', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setSearch', () => {
    it('should set the search string', () => {
      const result = filterReducer(initialState, setSearch('Harry Potter'));

      expect(result.filter.search).toBe('Harry Potter');
    });

    it('should clear search when empty string provided', () => {
      const stateWithSearch = {
        ...initialState,
        filter: { ...initialState.filter, search: 'old query' },
      };
      const result = filterReducer(stateWithSearch, setSearch(''));

      expect(result.filter.search).toBe('');
    });

    it('should replace existing search term', () => {
      const stateWithSearch = {
        ...initialState,
        filter: { ...initialState.filter, search: 'old' },
      };
      const result = filterReducer(stateWithSearch, setSearch('new search'));

      expect(result.filter.search).toBe('new search');
    });
  });

  describe('setCityFilter', () => {
    it('should set city filter', () => {
      const result = filterReducer(initialState, setCityFilter('Helsinki'));

      expect(result.filter.city).toBe('Helsinki');
    });

    it('should clear city filter', () => {
      const stateWithCity = {
        ...initialState,
        filter: { ...initialState.filter, city: 'Tampere' },
      };
      const result = filterReducer(stateWithCity, setCityFilter(''));

      expect(result.filter.city).toBe('');
    });
  });

  describe('setGenreFilter', () => {
    it('should set genre filter array', () => {
      const genres = ['Fiction', 'Mystery'];
      const result = filterReducer(initialState, setGenreFilter(genres));

      expect(result.filter.genre).toEqual(genres);
    });

    it('should create a copy of the array', () => {
      const genres = ['Fiction'];
      const result = filterReducer(initialState, setGenreFilter(genres));

      expect(result.filter.genre).not.toBe(genres);
      expect(result.filter.genre).toEqual(genres);
    });

    it('should handle empty array', () => {
      const stateWithGenres = {
        ...initialState,
        filter: { ...initialState.filter, genre: ['Fiction'] },
      };
      const result = filterReducer(stateWithGenres, setGenreFilter([]));

      expect(result.filter.genre).toEqual([]);
    });

    it('should replace existing genres', () => {
      const stateWithGenres = {
        ...initialState,
        filter: { ...initialState.filter, genre: ['Fiction', 'Horror'] },
      };
      const result = filterReducer(stateWithGenres, setGenreFilter(['Science Fiction']));

      expect(result.filter.genre).toEqual(['Science Fiction']);
    });
  });

  describe('setLanguageFilter', () => {
    it('should set language filter array', () => {
      const languages = ['English', 'Finnish'];
      const result = filterReducer(initialState, setLanguageFilter(languages));

      expect(result.filter.language).toEqual(languages);
    });

    it('should create a copy of the array', () => {
      const languages = ['English'];
      const result = filterReducer(initialState, setLanguageFilter(languages));

      expect(result.filter.language).not.toBe(languages);
    });

    it('should handle empty array', () => {
      const stateWithLang = {
        ...initialState,
        filter: { ...initialState.filter, language: ['Finnish'] },
      };
      const result = filterReducer(stateWithLang, setLanguageFilter([]));

      expect(result.filter.language).toEqual([]);
    });
  });

  describe('setConditionFilter', () => {
    it('should set condition filter array', () => {
      const conditions = ['NEW', 'GOOD'];
      const result = filterReducer(initialState, setConditionFilter(conditions));

      expect(result.filter.condition).toEqual(conditions);
    });

    it('should create a copy of the array', () => {
      const conditions = ['NEW'];
      const result = filterReducer(initialState, setConditionFilter(conditions));

      expect(result.filter.condition).not.toBe(conditions);
    });

    it('should handle empty array', () => {
      const stateWithCondition = {
        ...initialState,
        filter: { ...initialState.filter, condition: ['USED'] },
      };
      const result = filterReducer(stateWithCondition, setConditionFilter([]));

      expect(result.filter.condition).toEqual([]);
    });
  });

  describe('setSortByFilter', () => {
    it('should set sortBy filter array', () => {
      const sortBy = ['title', 'author'];
      const result = filterReducer(initialState, setSortByFilter(sortBy));

      expect(result.filter.sortBy).toEqual(sortBy);
    });

    it('should create a copy of the array', () => {
      const sortBy = ['title'];
      const result = filterReducer(initialState, setSortByFilter(sortBy));

      expect(result.filter.sortBy).not.toBe(sortBy);
    });

    it('should handle empty sortBy', () => {
      const stateWithSort = {
        ...initialState,
        filter: { ...initialState.filter, sortBy: ['title'] },
      };
      const result = filterReducer(stateWithSort, setSortByFilter([]));

      expect(result.filter.sortBy).toEqual([]);
    });
  });

  describe('setSortOrder', () => {
    it('should set sort order to desc', () => {
      const result = filterReducer(initialState, setSortOrder('desc'));

      expect(result.filter.sortOrder).toBe('desc');
    });

    it('should set sort order to asc', () => {
      const stateWithDesc = {
        ...initialState,
        filter: { ...initialState.filter, sortOrder: 'desc' as const },
      };
      const result = filterReducer(stateWithDesc, setSortOrder('asc'));

      expect(result.filter.sortOrder).toBe('asc');
    });
  });

  describe('setHasMore', () => {
    it('should set hasMore to true', () => {
      const result = filterReducer(initialState, setHasMore(true));

      expect(result.filter.hasMore).toBe(true);
    });

    it('should set hasMore to false', () => {
      const stateWithHasMore = {
        ...initialState,
        filter: { ...initialState.filter, hasMore: true },
      };
      const result = filterReducer(stateWithHasMore, setHasMore(false));

      expect(result.filter.hasMore).toBe(false);
    });
  });

  describe('setPageNumber', () => {
    it('should set page number', () => {
      const result = filterReducer(initialState, setPageNumber(3));

      expect(result.filter.pageNumber).toBe(3);
    });

    it('should reset page number to 0', () => {
      const stateWithPage = { ...initialState, filter: { ...initialState.filter, pageNumber: 5 } };
      const result = filterReducer(stateWithPage, setPageNumber(0));

      expect(result.filter.pageNumber).toBe(0);
    });
  });

  describe('setFilterOpen', () => {
    it('should open the filter panel', () => {
      const result = filterReducer(initialState, setFilterOpen(true));

      expect(result.isFilterOpen).toBe(true);
    });

    it('should close the filter panel', () => {
      const openState = { ...initialState, isFilterOpen: true };
      const result = filterReducer(openState, setFilterOpen(false));

      expect(result.isFilterOpen).toBe(false);
    });
  });

  describe('setIsCategoryOrFilterOrSortBy', () => {
    it('should set to CATEGORY', () => {
      const result = filterReducer(
        initialState,
        setIsCategoryOrFilterOrSortBy(FilterItemEnum.CATEGORY),
      );

      expect(result.isCategoryOrFilterOrSortBy).toBe(FilterItemEnum.CATEGORY);
    });

    it('should set to FILTER', () => {
      const result = filterReducer(
        initialState,
        setIsCategoryOrFilterOrSortBy(FilterItemEnum.FILTER),
      );

      expect(result.isCategoryOrFilterOrSortBy).toBe(FilterItemEnum.FILTER);
    });

    it('should set to SORTBY', () => {
      const result = filterReducer(
        initialState,
        setIsCategoryOrFilterOrSortBy(FilterItemEnum.SORTBY),
      );

      expect(result.isCategoryOrFilterOrSortBy).toBe(FilterItemEnum.SORTBY);
    });

    it('should clear the value when set to null', () => {
      const stateWithCategory = {
        ...initialState,
        isCategoryOrFilterOrSortBy: FilterItemEnum.CATEGORY,
      };
      const result = filterReducer(stateWithCategory, setIsCategoryOrFilterOrSortBy(null));

      expect(result.isCategoryOrFilterOrSortBy).toBeNull();
    });
  });

  describe('clearAllFilters', () => {
    it('should reset all filters to their defaults', () => {
      const stateWithFilters: IFilterInitialState = {
        filter: {
          genre: ['Fiction', 'Mystery'],
          language: ['English'],
          condition: ['NEW'],
          city: 'Helsinki',
          sortBy: ['title'],
          sortOrder: 'desc',
          search: 'Harry Potter',
          pageNumber: 5,
          hasMore: true,
        },
        isFilterOpen: true,
        isCategoryOrFilterOrSortBy: FilterItemEnum.FILTER,
      };

      const result = filterReducer(stateWithFilters, clearAllFilters());

      expect(result.filter.genre).toEqual([]);
      expect(result.filter.language).toEqual([]);
      expect(result.filter.condition).toEqual([]);
      expect(result.filter.city).toBe('');
      expect(result.filter.search).toBe('');
      expect(result.filter.sortBy).toEqual([]);
      expect(result.filter.sortOrder).toBe('asc');
      expect(result.filter.pageNumber).toBe(0);
    });

    it('should not affect isFilterOpen or isCategoryOrFilterOrSortBy', () => {
      const openState: IFilterInitialState = {
        ...initialState,
        isFilterOpen: true,
        isCategoryOrFilterOrSortBy: FilterItemEnum.SORTBY,
      };

      const result = filterReducer(openState, clearAllFilters());

      expect(result.isFilterOpen).toBe(true);
      expect(result.isCategoryOrFilterOrSortBy).toBe(FilterItemEnum.SORTBY);
    });

    it('should not reset hasMore (only genre/language/condition/city/search/sortBy/pageNumber)', () => {
      const stateWithHasMore: IFilterInitialState = {
        ...initialState,
        filter: { ...initialState.filter, hasMore: true },
      };

      const result = filterReducer(stateWithHasMore, clearAllFilters());

      // hasMore is not reset by clearAllFilters
      expect(result.filter.hasMore).toBe(true);
    });
  });
});

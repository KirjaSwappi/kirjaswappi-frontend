import { describe, it, expect } from 'vitest';
import swapReducer, {
  setSwapModal,
  setSwapBook,
  setResetSwapBook,
  setBookIdToSwapWith,
  setClearErrorMessage,
  setSwapFilterGenre,
} from '../../redux/feature/swap/swapSlice';
import {
  ISwapBookInitialInformation,
  ISwapBookInformation,
} from '../../redux/feature/swap/types/interface';
import { SwapType } from '../../../types/enum';

const defaultSwapBookInfo: ISwapBookInformation = {
  id: '',
  title: '',
  author: '',
  genres: [],
  language: '',
  description: '',
  condition: '',
  coverPhotoUrls: [],
  owner: {
    id: '',
    name: '',
  },
  swapCondition: {
    swapType: SwapType.BYBOOKS,
    giveAway: false,
    openForOffers: false,
    swappableGenres: [],
    swappableBooks: [],
  },
};

const initialState: ISwapBookInitialInformation = {
  errorMessage: '',
  swapModalOpen: false,
  bookIdToSwapWith: '',
  swapFilterGenre: [],
  swapBookInformation: defaultSwapBookInfo,
};

describe('swapSlice', () => {
  it('should return the initial state', () => {
    expect(swapReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setSwapModal', () => {
    it('should open the swap modal', () => {
      const result = swapReducer(initialState, setSwapModal(true));

      expect(result.swapModalOpen).toBe(true);
    });

    it('should close the swap modal', () => {
      const openState = { ...initialState, swapModalOpen: true };
      const result = swapReducer(openState, setSwapModal(false));

      expect(result.swapModalOpen).toBe(false);
    });
  });

  describe('setSwapBook', () => {
    it('should set the swap book information', () => {
      const bookInfo: ISwapBookInformation = {
        id: 'book-123',
        title: 'Test Book',
        author: 'Test Author',
        genres: ['Fiction'],
        language: 'English',
        description: 'A great book',
        condition: 'GOOD',
        coverPhotoUrls: ['http://example.com/cover.jpg'],
        owner: {
          id: 'user-1',
          name: 'Owner Name',
        },
        swapCondition: {
          swapType: SwapType.BYBOOKS,
          giveAway: false,
          openForOffers: false,
          swappableGenres: ['Mystery'],
          swappableBooks: [],
        },
      };

      const result = swapReducer(initialState, setSwapBook(bookInfo));

      expect(result.swapBookInformation.id).toBe('book-123');
      expect(result.swapBookInformation.title).toBe('Test Book');
      expect(result.swapBookInformation.author).toBe('Test Author');
      expect(result.swapBookInformation.genres).toEqual(['Fiction']);
    });

    it('should merge with initial swap book defaults', () => {
      const partialBook = {
        ...defaultSwapBookInfo,
        id: 'book-456',
        title: 'Partial Book',
      };

      const result = swapReducer(initialState, setSwapBook(partialBook));

      expect(result.swapBookInformation.id).toBe('book-456');
      expect(result.swapBookInformation.title).toBe('Partial Book');
      // defaults retained
      expect(result.swapBookInformation.genres).toEqual([]);
    });

    it('should handle book with GIVEAWAY swap type', () => {
      const giveawayBook: ISwapBookInformation = {
        ...defaultSwapBookInfo,
        id: 'book-789',
        title: 'Free Book',
        swapCondition: {
          swapType: SwapType.GIVEAWAY,
          giveAway: true,
          openForOffers: false,
          swappableGenres: [],
          swappableBooks: [],
        },
      };

      const result = swapReducer(initialState, setSwapBook(giveawayBook));

      expect(result.swapBookInformation.swapCondition.swapType).toBe(SwapType.GIVEAWAY);
      expect(result.swapBookInformation.swapCondition.giveAway).toBe(true);
    });
  });

  describe('setResetSwapBook', () => {
    it('should reset swap book information to initial values', () => {
      const filledState: ISwapBookInitialInformation = {
        errorMessage: 'Some error',
        swapModalOpen: true,
        bookIdToSwapWith: 'book-456',
        swapFilterGenre: ['Fiction'],
        swapBookInformation: {
          ...defaultSwapBookInfo,
          id: 'book-123',
          title: 'Some Book',
          author: 'Some Author',
        },
      };

      const result = swapReducer(filledState, setResetSwapBook());

      expect(result.swapBookInformation).toEqual(defaultSwapBookInfo);
      expect(result.bookIdToSwapWith).toBe('');
      expect(result.swapFilterGenre).toEqual([]);
    });

    it('should not affect swapModalOpen or errorMessage', () => {
      const stateWithModal: ISwapBookInitialInformation = {
        ...initialState,
        swapModalOpen: true,
        errorMessage: 'some error',
        bookIdToSwapWith: 'book-1',
        swapFilterGenre: ['Genre1'],
      };

      const result = swapReducer(stateWithModal, setResetSwapBook());

      expect(result.swapModalOpen).toBe(true);
      expect(result.errorMessage).toBe('some error');
    });
  });

  describe('setBookIdToSwapWith', () => {
    it('should set the book ID to swap with', () => {
      const result = swapReducer(initialState, setBookIdToSwapWith('book-999'));

      expect(result.bookIdToSwapWith).toBe('book-999');
    });

    it('should clear book ID when set to empty string', () => {
      const stateWithBook = { ...initialState, bookIdToSwapWith: 'book-123' };
      const result = swapReducer(stateWithBook, setBookIdToSwapWith(''));

      expect(result.bookIdToSwapWith).toBe('');
    });
  });

  describe('setClearErrorMessage', () => {
    it('should clear the error message', () => {
      const stateWithError: ISwapBookInitialInformation = {
        ...initialState,
        errorMessage: 'Swap request failed',
      };

      const result = swapReducer(stateWithError, setClearErrorMessage());

      expect(result.errorMessage).toBe('');
    });

    it('should work even when there is no error message', () => {
      const result = swapReducer(initialState, setClearErrorMessage());

      expect(result.errorMessage).toBe('');
    });
  });

  describe('setSwapFilterGenre', () => {
    it('should set the swap filter genre array', () => {
      const genres = ['Fiction', 'Mystery'];
      const result = swapReducer(initialState, setSwapFilterGenre(genres));

      expect(result.swapFilterGenre).toEqual(genres);
    });

    it('should create a copy of the array', () => {
      const genres = ['Fiction'];
      const result = swapReducer(initialState, setSwapFilterGenre(genres));

      expect(result.swapFilterGenre).not.toBe(genres);
    });

    it('should replace existing genres', () => {
      const stateWithGenres = { ...initialState, swapFilterGenre: ['Old Genre'] };
      const result = swapReducer(stateWithGenres, setSwapFilterGenre(['New Genre']));

      expect(result.swapFilterGenre).toEqual(['New Genre']);
    });

    it('should handle empty array', () => {
      const stateWithGenres = { ...initialState, swapFilterGenre: ['Fiction'] };
      const result = swapReducer(stateWithGenres, setSwapFilterGenre([]));

      expect(result.swapFilterGenre).toEqual([]);
    });
  });

  describe('extraReducers - swapRequest.matchRejected', () => {
    it('should set error message when swap request is rejected with error payload', () => {
      // RTK Query's addMatcher fires on action type 'api/executeMutation/rejected'
      // when the endpointName matches. The matcher extracts error.message from payload.data.
      const rejectedAction = {
        type: 'api/executeMutation/rejected',
        payload: {
          status: 400,
          data: {
            error: {
              code: 'SWAP_ERROR',
              message: 'Cannot swap this book',
            },
          },
        },
        meta: {
          arg: { endpointName: 'swapRequest' },
          requestStatus: 'rejected',
        },
      };

      const result = swapReducer(initialState, rejectedAction);
      expect(result.errorMessage).toBe('Cannot swap this book');
    });

    it('should set errorMessage to undefined when payload has no error object', () => {
      const rejectedAction = {
        type: 'api/executeMutation/rejected',
        payload: {
          status: 500,
          data: null,
        },
        meta: {
          arg: { endpointName: 'swapRequest' },
          requestStatus: 'rejected',
        },
      };

      const result = swapReducer(initialState, rejectedAction);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should have empty error message in initial state', () => {
      expect(initialState.errorMessage).toBe('');
    });
  });
});

import { describe, it, expect } from 'vitest';
import bookReducer, { setBookLoading, IBookInitialState } from '../../redux/feature/book/bookSlice';

const initialState: IBookInitialState = {
  loading: false,
};

describe('bookSlice', () => {
  it('should return the initial state', () => {
    expect(bookReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should have loading false as initial value', () => {
    expect(bookReducer(undefined, { type: 'unknown' }).loading).toBe(false);
  });

  describe('setBookLoading', () => {
    it('should set loading to true', () => {
      const result = bookReducer(initialState, setBookLoading(true));

      expect(result.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const loadingState: IBookInitialState = { loading: true };
      const result = bookReducer(loadingState, setBookLoading(false));

      expect(result.loading).toBe(false);
    });

    it('should be idempotent when set to the same value', () => {
      const result = bookReducer(initialState, setBookLoading(false));

      expect(result.loading).toBe(false);
    });

    it('should toggle from true to false', () => {
      let state = bookReducer(initialState, setBookLoading(true));
      expect(state.loading).toBe(true);

      state = bookReducer(state, setBookLoading(false));
      expect(state.loading).toBe(false);
    });
  });
});

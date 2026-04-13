import { describe, it, expect } from 'vitest';
import openReducer, {
  setOpen,
  setLoginModalOpen,
  setSearchToggle,
  IOpenInitialState,
} from '../../redux/feature/open/openSlice';

const initialState: IOpenInitialState = {
  open: false,
  swapModal: false,
  showAlert: false,
  message: '',
  loginModalOpen: false,
  searchToggle: false,
};

describe('openSlice', () => {
  it('should return the initial state', () => {
    expect(openReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setOpen', () => {
    it('should set open to true', () => {
      const result = openReducer(initialState, setOpen(true));

      expect(result.open).toBe(true);
    });

    it('should set open to false', () => {
      const openedState: IOpenInitialState = { ...initialState, open: true };
      const result = openReducer(openedState, setOpen(false));

      expect(result.open).toBe(false);
    });

    it('should not affect other state properties', () => {
      const result = openReducer(initialState, setOpen(true));

      expect(result.swapModal).toBe(false);
      expect(result.showAlert).toBe(false);
      expect(result.message).toBe('');
      expect(result.loginModalOpen).toBe(false);
      expect(result.searchToggle).toBe(false);
    });
  });

  describe('setLoginModalOpen', () => {
    it('should open the login modal', () => {
      const result = openReducer(initialState, setLoginModalOpen(true));

      expect(result.loginModalOpen).toBe(true);
    });

    it('should close the login modal', () => {
      const openedState: IOpenInitialState = { ...initialState, loginModalOpen: true };
      const result = openReducer(openedState, setLoginModalOpen(false));

      expect(result.loginModalOpen).toBe(false);
    });

    it('should not affect other state properties', () => {
      const result = openReducer(initialState, setLoginModalOpen(true));

      expect(result.open).toBe(false);
      expect(result.swapModal).toBe(false);
      expect(result.showAlert).toBe(false);
      expect(result.message).toBe('');
      expect(result.searchToggle).toBe(false);
    });
  });

  describe('setSearchToggle', () => {
    it('should enable search toggle', () => {
      const result = openReducer(initialState, setSearchToggle(true));

      expect(result.searchToggle).toBe(true);
    });

    it('should disable search toggle', () => {
      const toggledState: IOpenInitialState = { ...initialState, searchToggle: true };
      const result = openReducer(toggledState, setSearchToggle(false));

      expect(result.searchToggle).toBe(false);
    });

    it('should not affect other state properties', () => {
      const result = openReducer(initialState, setSearchToggle(true));

      expect(result.open).toBe(false);
      expect(result.swapModal).toBe(false);
      expect(result.showAlert).toBe(false);
      expect(result.message).toBe('');
      expect(result.loginModalOpen).toBe(false);
    });
  });

  describe('initial state', () => {
    it('should have all boolean flags set to false', () => {
      expect(initialState.open).toBe(false);
      expect(initialState.swapModal).toBe(false);
      expect(initialState.showAlert).toBe(false);
      expect(initialState.loginModalOpen).toBe(false);
      expect(initialState.searchToggle).toBe(false);
    });

    it('should have empty message', () => {
      expect(initialState.message).toBe('');
    });
  });

  describe('multiple action dispatches', () => {
    it('should correctly track open and loginModal independently', () => {
      let state = openReducer(initialState, setOpen(true));
      state = openReducer(state, setLoginModalOpen(true));

      expect(state.open).toBe(true);
      expect(state.loginModalOpen).toBe(true);

      state = openReducer(state, setOpen(false));

      expect(state.open).toBe(false);
      expect(state.loginModalOpen).toBe(true);
    });
  });
});

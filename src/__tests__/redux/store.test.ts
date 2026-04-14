import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utility/cookies', () => ({
  getCookie: vi.fn(() => null),
}));

vi.mock('../../api/apiSlice', () => ({
  api: {
    reducerPath: 'api',
    reducer: (state = {}) => state,
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  },
}));

vi.mock('../../feature/auth/authSlice', () => ({
  default: (state = {}) => state,
  initialState: { userInformation: { id: '' } },
}));

vi.mock('../../feature/book/bookSlice', () => ({
  default: (state = {}) => state,
}));

vi.mock('../../feature/filter/filterSlice', () => ({
  default: (state = {}) => state,
}));

vi.mock('../../feature/messages/messagesSlice', () => ({
  default: (state = {}) => state,
}));

vi.mock('../../feature/notification/notificationSlice', () => ({
  default: (state = {}) => state,
}));

vi.mock('../../feature/open/openSlice', () => ({
  default: (state = {}) => state,
}));

vi.mock('../../feature/step/stepSlice', () => ({
  default: (state = {}) => state,
}));

vi.mock('../../feature/swap/swapSlice', () => ({
  default: (state = {}) => state,
}));

import store from '../../redux/store';

describe('Redux store', () => {
  it('exports a configured store', () => {
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
  });

  it('has expected state shape', () => {
    const state = store.getState();
    expect(state).toHaveProperty('api');
    expect(state).toHaveProperty('auth');
  });
});

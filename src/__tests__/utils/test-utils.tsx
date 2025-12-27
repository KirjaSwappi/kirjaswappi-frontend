import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { api } from '../../redux/api/apiSlice';
import authSlice from '../../redux/feature/auth/authSlice';
import bookSlice from '../../redux/feature/book/bookSlice';
import filterSlice from '../../redux/feature/filter/filterSlice';
import messagesSlice from '../../redux/feature/messages/messagesSlice';
import notificationSlice from '../../redux/feature/notification/notificationSlice';
import openSlice from '../../redux/feature/open/openSlice';
import stepSlice from '../../redux/feature/step/stepSlice';
import swapSlice from '../../redux/feature/swap/swapSlice';
import { RootState } from '../../redux/store';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authSlice,
  step: stepSlice,
  open: openSlice,
  notification: notificationSlice,
  filter: filterSlice,
  swapBook: swapSlice,
  chat: messagesSlice,
  book: bookSlice,
});

/**
 * Creates a fresh store for each test to avoid state pollution
 */
export function setupTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(api.middleware),
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupTestStore>;
}

/**
 * Renders a component with Redux provider and fresh store
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = setupTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): ReactElement {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

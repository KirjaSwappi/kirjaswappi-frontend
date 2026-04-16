import {
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction,
  configureStore,
} from '@reduxjs/toolkit';
import { CombinedState } from '@reduxjs/toolkit/query';
import { setupListeners } from '@reduxjs/toolkit/query';

import { getCookie } from '../utility/cookies';
import { api } from './api/apiSlice';
import authSlice, { IInitialState, initialState } from './feature/auth/authSlice';
import bookSlice, { IBookInitialState } from './feature/book/bookSlice';
import filterSlice, { IFilterInitialState } from './feature/filter/filterSlice';
import messagesSlice, { ChatState } from './feature/messages/messagesSlice';
import { notificationPersistenceMiddleware } from './middleware/notificationPersistence';
import notificationSlice, {
  INotificationInitialState,
} from './feature/notification/notificationSlice';
import openSlice, { IOpenInitialState } from './feature/open/openSlice';
import stepSlice, { IStepInitialState } from './feature/step/stepSlice';
import swapSlice from './feature/swap/swapSlice';
import { ISwapBookInitialInformation } from './feature/swap/types/interface';
const cookieUser = getCookie('user');
const user = cookieUser ? cookieUser : {};

const preloadedState = {
  auth: {
    ...initialState,
    userInformation: {
      ...initialState.userInformation,
      ...user,
    },
  },
};

const store: EnhancedStore<
  {
    api: ReturnType<typeof api.reducer>;
    auth: IInitialState;
    step: IStepInitialState;
    open: IOpenInitialState;
    notification: INotificationInitialState;
    filter: IFilterInitialState;
    swapBook: ISwapBookInitialInformation;
    chat: ChatState;
    book: IBookInitialState;
  },
  UnknownAction,
  Tuple<
    [
      StoreEnhancer<{
        dispatch: ThunkDispatch<
          {
            api: CombinedState<Record<string, never>, never, 'api'>;
            auth: IInitialState;
          },
          undefined,
          UnknownAction
        >;
      }>,
      StoreEnhancer,
    ]
  >
> = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice,
    step: stepSlice,
    open: openSlice,
    notification: notificationSlice,
    filter: filterSlice,
    swapBook: swapSlice,
    chat: messagesSlice,
    book: bookSlice,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, notificationPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);

export default store;

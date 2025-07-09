import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import Authenticate from './Authenticate.tsx';
import './index.css';
import store from './redux/store';
import './utility/i18n.ts';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="43921547457-06chtojpprgds80g1gq5tprmn5qg0hmq.apps.googleusercontent.com">
      <Provider store={store}>
        <Authenticate />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

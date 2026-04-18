import { Analytics } from '@vercel/analytics/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import Authenticate from './Authenticate.tsx';
import './index.css';
import store from './redux/store';
import './utility/i18n.ts';
const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientID}>
      <Provider store={store}>
        <Authenticate />
        <Analytics />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);

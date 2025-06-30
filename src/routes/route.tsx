import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import AddUpdateBook from '../pages/addUpdateBook';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ResetPassword from '../pages/auth/resetPassword';
import BookDetails from '../pages/bookDetails';
import Books from '../pages/books';
import Profile from '../pages/profile';
import EditProfile from '../pages/profile/components/EditProfile';
import UserProfile from '../pages/profile/components/UserProfile';
import Inbox from '../pages/user/inbox/Inbox';
import { Index } from '../pages/user/inboxChat';
import GlobalError from '../components/error/GlobalError';
import AppErrorBoundary from '../components/error/AppErrorBoundary';
import Authenticate from './Authenticate';
import PrivateRoute from './PrivateRoute';

import ContactUs from '../pages/contactUs/ContactUs';
import PrivacyPolicy from '../pages/privacyPolicy';
import PrivacyPolicyDetail from '../pages/privacyPolicy/components/PrivacyPolicyDetail';
import NotFound from '../components/error/NotFound';

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    ),
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: <Books />,
      },
      {
        path: '/book-details/:id',
        element: <BookDetails />,
      },
      {
        path: '/contact',
        element: <ContactUs />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/privacy-policy/:sectionKey',
        element: <PrivacyPolicyDetail />,
      },
      {
        path: '/profile',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
        children: [
          {
            loader: () => <p>Loading...</p>,
            index: true,
            path: 'user-profile',
            element: <UserProfile />,
          },
          {
            path: 'edit-user',
            element: <EditProfile />,
          },
          {
            path: 'add-book',
            element: <AddUpdateBook />,
          },
          {
            path: 'update-book/:id',
            element: <AddUpdateBook />,
          },
        ],
      },
      {
        path: 'user',
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'inbox',
            element: <Inbox />,
          },
          {
            path: 'inbox/chat/:id',
            element: <Index />,
          },
        ],
      },
      {
        path: '/map',
        element: <Profile />,
      },
      {
        path: '/message',
        element: (
          <PrivateRoute>
            <Navigate to="/inbox" replace />
          </PrivateRoute>
        ),
      },
      {
        path: '/auth/login',
        element: (
          <Authenticate>
            <Login />
          </Authenticate>
        ),
      },
      {
        path: '/password/reset',
        element: (
          <Authenticate>
            <ResetPassword />
          </Authenticate>
        ),
      },
      {
        path: '/auth/register',
        element: (
          <Authenticate>
            <Register />
          </Authenticate>
        ),
      },
      // {
      //   // path: "/profile",
      //   // element: (
      //   //   <PrivateRoute>
      //   //     {" "}
      //   //     <User />{" "}
      //   //   </PrivateRoute>
      //   // ),
      //   children: [
      //     // {
      //     //   index: true,
      //     //   element: <UserProfile />,
      //     // },

      //   ],
      // },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  // {
  //   path: "/notFound",
  //   element: <NotFound />,
  // },
]);

export default routes;

import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import AppErrorBoundary from '../components/error/AppErrorBoundary';
import GlobalError from '../components/error/GlobalError';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import ResetPassword from '../pages/auth/resetPassword';
import BookDetails from '../pages/bookDetails';
import Books from '../pages/books';
import Profile from '../pages/profile';
import Authenticate from './Authenticate';
import PrivateRoute from './PrivateRoute';

import NotFound from '../components/error/NotFound';
import Spinner from '../components/shared/Spinner';

const AddUpdateBook = lazy(() => import('../pages/addUpdateBook'));
const EditProfile = lazy(() => import('../pages/profile/components/EditProfile'));
const Map = lazy(() => import('../pages/map'));
const Messages = lazy(() => import('../pages/messages/Messages'));
const Collaboration = lazy(() => import('../pages/Collaboration'));
const ContactUs = lazy(() => import('../pages/contactUs/ContactUs'));
const Donation = lazy(() => import('../pages/Donation'));
const Feedback = lazy(() => import('../pages/FeedBack'));
const PrivacyPolicy = lazy(() => import('../pages/privacyPolicy'));
const PrivacyPolicyDetail = lazy(
  () => import('../pages/privacyPolicy/components/PrivacyPolicyDetail'),
);
const ProfileDashboard = lazy(() => import('../pages/profile/components/ProfileDashboard'));
const SupportUs = lazy(() => import('../pages/support-us'));
const TermsOfService = lazy(() => import('../pages/termsOfService'));
const TermsOfServiceDetail = lazy(
  () => import('../pages/termsOfService/components/TermsOfServiceDetail'),
);
const Volunteer = lazy(() => import('../pages/volunteer'));

function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}

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
        path: '/map',
        element: (
          <LazyRoute>
            <Map />
          </LazyRoute>
        ),
      },
      {
        path: '/support-us',
        element: (
          <LazyRoute>
            <SupportUs />
          </LazyRoute>
        ),
      },
      {
        path: '/privacy-policy',
        element: (
          <LazyRoute>
            <PrivacyPolicy />
          </LazyRoute>
        ),
      },
      {
        path: '/contact-us',
        element: (
          <LazyRoute>
            <ContactUs />
          </LazyRoute>
        ),
      },
      {
        path: '/collaboration',
        element: (
          <LazyRoute>
            <Collaboration />
          </LazyRoute>
        ),
      },
      {
        path: '/donation',
        element: (
          <LazyRoute>
            <Donation />
          </LazyRoute>
        ),
      },
      {
        path: '/volunteer',
        element: (
          <LazyRoute>
            <Volunteer />
          </LazyRoute>
        ),
      },
      {
        path: '/feedback',
        element: (
          <LazyRoute>
            <Feedback />
          </LazyRoute>
        ),
      },
      {
        path: '/privacy-policy/:sectionKey',
        element: (
          <LazyRoute>
            <PrivacyPolicyDetail />
          </LazyRoute>
        ),
      },
      {
        path: '/terms-of-service',
        element: (
          <LazyRoute>
            <TermsOfService />
          </LazyRoute>
        ),
      },
      {
        path: '/terms-of-service/:sectionKey',
        element: (
          <LazyRoute>
            <TermsOfServiceDetail />
          </LazyRoute>
        ),
      },
      {
        path: '/profile',
        element: <Profile />,
        children: [
          {
            index: true,
            path: 'user-profile/:id',
            element: (
              <LazyRoute>
                <ProfileDashboard />
              </LazyRoute>
            ),
          },
          {
            path: 'edit-user',
            element: (
              <PrivateRoute>
                <LazyRoute>
                  <EditProfile />
                </LazyRoute>
              </PrivateRoute>
            ),
          },
          {
            path: 'add-book',
            element: (
              <PrivateRoute>
                <LazyRoute>
                  <AddUpdateBook />
                </LazyRoute>
              </PrivateRoute>
            ),
          },
          {
            path: 'update-book/:id',
            element: (
              <PrivateRoute>
                <LazyRoute>
                  <AddUpdateBook />
                </LazyRoute>
              </PrivateRoute>
            ),
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
            path: 'messages',
            element: (
              <LazyRoute>
                <Messages />
              </LazyRoute>
            ),
          },
          {
            path: 'messages/:id',
            element: (
              <LazyRoute>
                <Messages />
              </LazyRoute>
            ),
          },
        ],
      },
      {
        path: '/message',
        element: (
          <PrivateRoute>
            <Navigate to="/user/messages" replace />
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
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default routes;

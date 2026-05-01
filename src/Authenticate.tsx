import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useGetUserByIdQuery } from './redux/feature/auth/authApi';
import { logout, setUserInformation } from './redux/feature/auth/authSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import routes from './routes/route';
import { isFetchBaseQueryError } from './utility/rtkError';
export default function Authenticate() {
  const dispatch = useAppDispatch();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { data, error } = useGetUserByIdQuery(
    { userId: userInformation.id as string },
    {
      skip: !userInformation.id,
    },
  );

  useEffect(() => {
    if (data) {
      dispatch(setUserInformation(data));
    }
  }, [data, dispatch]);

  // If the initial /me-style fetch returns 401/403, the session is unrecoverable
  // (refresh token already failed in apiSlice). Drop Redux state so the UI does
  // not show "logged in" with no working APIs.
  useEffect(() => {
    if (!error) return;
    if (isFetchBaseQueryError(error) && (error.status === 401 || error.status === 403)) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return (
    <React.Fragment>
      <div className="px-4">
        <ToastContainer
          autoClose={2000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          toastClassName="!mx-4 !max-w-sm sm:!mx-0"
        />
      </div>
      <RouterProvider router={routes} />
    </React.Fragment>
  );
}

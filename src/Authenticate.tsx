import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useGetUserByIdQuery } from './redux/feature/auth/authApi';
import { setUserInformation } from './redux/feature/auth/authSlice';
import { useAppSelector } from './redux/hooks';
import routes from './routes/route';
export default function Authenticate() {
  const dispatch = useDispatch();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { data } = useGetUserByIdQuery(userInformation.id, {
    skip: !userInformation.id,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUserInformation(data));
    }
  }, [data]);

  return (
    <React.Fragment>
      <div className="px-4">
        <ToastContainer
          autoClose={3000}
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

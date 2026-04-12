import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useGetUserByIdQuery } from './redux/feature/auth/authApi';
import { setUserInformation } from './redux/feature/auth/authSlice';
import { useGetInboxQuery } from './redux/feature/messages/inboxApi';
import { setInboxList } from './redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import routes from './routes/route';
export default function Authenticate() {
  const dispatch = useAppDispatch();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { data } = useGetUserByIdQuery(
    { userId: userInformation.id as string },
    {
      skip: !userInformation.id,
    },
  );

  const { data: inboxData, isSuccess: isInboxSuccess } = useGetInboxQuery(
    undefined,
    { skip: !userInformation.id, refetchOnMountOrArgChange: 30 },
  );

  useEffect(() => {
    if (data) {
      dispatch(setUserInformation(data));
    }
  }, [data]);

  useEffect(() => {
    if (isInboxSuccess && Array.isArray(inboxData)) {
      dispatch(setInboxList(inboxData));
    }
  }, [isInboxSuccess, inboxData, dispatch]);

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

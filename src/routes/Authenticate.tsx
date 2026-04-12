/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const Authenticate = ({ children }: { children: any }) => {
  const location = useLocation();
  const { pathname, state } = location;
  const { userInformation } = useAppSelector((state) => state.auth);

  if (userInformation.email) {
    return <Navigate to="/" state={{ ...state, path: pathname }} />;
  }

  return children;
};

export default Authenticate;

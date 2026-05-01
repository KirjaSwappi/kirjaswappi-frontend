import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

type LocationState = { from?: { pathname: string; search?: string }; path?: string } | null;

const Authenticate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { userInformation } = useAppSelector((state) => state.auth);

  if (userInformation.email) {
    // Honour deep links: if the user was redirected here from a protected route,
    // send them back to that exact URL (path + query) rather than always to /.
    const target = state?.from
      ? `${state.from.pathname}${state.from.search ?? ''}`
      : (state?.path ?? '/');
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default Authenticate;

import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { getCookie, isCookieExpired } from '../utility/cookies';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const userInformation = useAppSelector((state) => state.auth.userInformation);
  const location = useLocation();

  // Require both Redux user info AND a non-expired refresh token. Even if the
  // access token is expired, the apiSlice will refresh it via the refresh token;
  // but if the refresh token is missing/expired we cannot recover and should
  // bounce to login immediately rather than render a half-broken protected page.
  const refreshToken = getCookie('userRefreshToken');
  const hasValidSession =
    Boolean(userInformation?.id && userInformation?.email) &&
    Boolean(refreshToken) &&
    !isCookieExpired('userRefreshToken');

  if (hasValidSession) {
    return <>{children}</>;
  }

  return (
    <Navigate
      to="/auth/login"
      state={{ path: location.pathname + location.search, from: location }}
      replace
    />
  );
}

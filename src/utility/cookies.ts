import { jwtDecode, JwtPayload } from 'jwt-decode';

// NOTE: Tokens stored here are JS-readable; the previous AES wrapping with a
// VITE_SECRET_KEY bundled into the SPA was security theatre (the key was
// public). The real fix is to migrate to httpOnly Secure SameSite cookies set
// by the backend (tracked as H1 in the launch audit). Until then, treat any
// JWT in document.cookie as XSS-exposed and keep access-token TTLs short.

export const setCookie = (name: string, value: unknown, time: number) => {
  const serialised = encodeURIComponent(JSON.stringify(value));
  const date = new Date();
  date.setTime(date.getTime() + time * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = `${name}=${serialised}; ${expires}; path=/; Secure; SameSite=Strict`;
};

export const getCookie = (name: string) => {
  const nameEQ = name + '=';
  const cookiesArray = document.cookie.split(';');

  for (let i = 0; i < cookiesArray.length; i++) {
    const cookie = cookiesArray[i].trim();

    if (cookie.indexOf(nameEQ) === 0) {
      const raw = cookie.substring(nameEQ.length, cookie.length);
      try {
        return JSON.parse(decodeURIComponent(raw));
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const clearCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict;`;
};

export const isCookieExpired = (name: string): boolean => {
  const cookie = getCookie(name);
  if (!cookie) {
    return true;
  }
  if (typeof cookie !== 'string') {
    // Non-string cookies (e.g., JSON objects) cannot be JWT-decoded
    return false;
  }
  try {
    const decodedToken: JwtPayload = jwtDecode<JwtPayload>(cookie);
    const currentTime = Date.now() / 1000;
    if (!decodedToken.exp) {
      return true;
    }
    return decodedToken.exp < currentTime;
  } catch {
    return true;
  }
};

export const handleExpiredCookie = (name: string) => {
  if (isCookieExpired(name)) {
    clearCookie(name);
  }
};

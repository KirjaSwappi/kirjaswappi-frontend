import CryptoJS from 'crypto-js';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const setCookie = (name: string, value: unknown, time: number) => {
  const encryptedValue = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    import.meta.env.VITE_SECRET_KEY,
  ).toString();

  const date = new Date();
  date.setTime(date.getTime() + time * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = `${name}=${encryptedValue}; ${expires}; path=/; Secure; SameSite=Strict`;
};

export const getCookie = (name: string) => {
  const nameEQ = name + '=';
  const cookiesArray = document.cookie.split(';');

  for (let i = 0; i < cookiesArray.length; i++) {
    const cookie = cookiesArray[i].trim();

    if (cookie.indexOf(nameEQ) === 0) {
      const encryptedValue = cookie.substring(nameEQ.length, cookie.length);
      const decryptedValue = CryptoJS.AES.decrypt(
        encryptedValue,
        import.meta.env.VITE_SECRET_KEY,
      ).toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedValue);
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

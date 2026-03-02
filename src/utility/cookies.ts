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
  document.cookie = `${name}=${encryptedValue}; ${expires}; path=/; Secure`;
};

export const getCookie = (name: string) => {
  const nameEQ = name + '=';
  const cookiesArray = document.cookie.split(';');

  for (let i = 0; i < cookiesArray.length; i++) {
    const cookie = cookiesArray[i].trim();

    if (cookie.indexOf(nameEQ) === 0) {
      try {
        const encryptedValue = cookie.substring(nameEQ.length, cookie.length);
        const decryptedValue = CryptoJS.AES.decrypt(
          encryptedValue,
          import.meta.env.VITE_SECRET_KEY,
        ).toString(CryptoJS.enc.Utf8);

        if (!decryptedValue) {
          if (import.meta.env.DEV) {
            console.error(`Empty decrypted cookie value for "${name}", clearing cookie.`);
          }
          clearCookie(name);
          return null;
        }

        return JSON.parse(decryptedValue);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error decrypting cookie:', error);
        }
        clearCookie(name);
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
    console.log('Cookie has expired or is not set.');
    return true;
  }
  try {
    const decodedToken: JwtPayload = jwtDecode<JwtPayload>(cookie);
    const currentTime = Date.now() / 1000;
    if (!decodedToken.exp) {
      console.log('Token does not have an expiration field.');
      return true;
    }
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.log('isCookieExpired', error);
    return true;
  }
};

// Function to handle cookie expiration (remove expired cookies)
export const handleExpiredCookie = (name: string) => {
  if (isCookieExpired(name)) {
    clearCookie(name);
    console.log(`Cookie ${name} has expired. It has been removed.`);
  } else {
    console.log(`Cookie ${name} is still valid.`);
  }
};

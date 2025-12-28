export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('jwtToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
export const setToken = (name: string, value: string | number) => {
  localStorage.setItem(`${name}`, `${value}`);
};
export const getTokens = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { jwtToken, refreshToken };
};
export const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};
export const getToken = (name: string) => {
  return localStorage.getItem(name);
};

export const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080/api/v1';

export const getStompBrokerUrl = (): string => {
  const base = API_BASE.replace(/\/api\/v1\/?$/, '');
  return base.replace(/^http/, 'ws') + '/ws/websocket';
};

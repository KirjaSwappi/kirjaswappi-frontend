import type { Middleware } from '@reduxjs/toolkit';
import { NOTIFICATIONS_STORAGE_KEY } from '../feature/notification/notificationSlice';
import type { RootState } from '../store';

const PERSISTED_ACTIONS = new Set([
  'notification/addNotification',
  'notification/markNotificationsAsRead',
  'notification/markAllAsRead',
  'notification/clearNotifications',
]);

export const notificationPersistenceMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (PERSISTED_ACTIONS.has((action as { type: string }).type)) {
      const { notifications, unreadCount } = store.getState().notification;

      if ((action as { type: string }).type === 'notification/clearNotifications') {
        try {
          localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
        } catch {
          // Silently ignore storage errors
        }
      } else {
        try {
          localStorage.setItem(
            NOTIFICATIONS_STORAGE_KEY,
            JSON.stringify({ notifications, unreadCount }),
          );
        } catch {
          // Silently ignore storage errors
        }
      }
    }

    return result;
  };

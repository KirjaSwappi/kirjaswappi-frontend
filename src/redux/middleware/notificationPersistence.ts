import { isAnyOf, type Middleware } from '@reduxjs/toolkit';
import {
  addNotification,
  clearNotifications,
  markAllAsRead,
  markNotificationsAsRead,
  NOTIFICATIONS_STORAGE_KEY,
} from '../feature/notification/notificationSlice';
import type { RootState } from '../store';

const isPersistedAction = isAnyOf(
  addNotification,
  markNotificationsAsRead,
  markAllAsRead,
  clearNotifications,
);

export const notificationPersistenceMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (isPersistedAction(action)) {
      const { notifications, unreadCount } = store.getState().notification;

      if (clearNotifications.match(action)) {
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

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INotification, WSConnectionStatus } from '../../../types/notification';
import type { RootState } from '../../store';

export interface INotificationInitialState {
  isShow: boolean;
  messageType: string | 'ERROR' | 'SUCCESS' | 'WARNING';
  message: string | null | undefined;
  showAlert: boolean;
  alertMessage: string | null | undefined;
  alertType: string | null | undefined;
  // WebSocket notification fields
  notifications: INotification[];
  unreadCount: number;
  isNotificationPanelOpen: boolean;
  wsConnectionStatus: WSConnectionStatus;
}

// Local storage key for notifications
export const NOTIFICATIONS_STORAGE_KEY = 'kirjaswappi_notifications';
const MAX_NOTIFICATIONS = 50;
const NOTIFICATION_EXPIRY_DAYS = 7;

// Helper function to load notifications from localStorage
const loadNotificationsFromStorage = (): {
  notifications: INotification[];
  unreadCount: number;
} => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // Clean up expired notifications on load
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - NOTIFICATION_EXPIRY_DAYS);
      const expiryTimestamp = expiryDate.getTime();

      const validNotifications = parsed.notifications.filter((notification: INotification) => {
        const notificationTime = new Date(notification.time).getTime();
        return notificationTime >= expiryTimestamp;
      });

      // Recalculate unread count based on valid notifications
      const unreadCount = validNotifications.filter((n: INotification) => !n.isRead).length;

      return {
        notifications: validNotifications,
        unreadCount,
      };
    }
  } catch (error) {
    console.error('[NotificationSlice] Error loading notifications from storage:', error);
  }

  return {
    notifications: [],
    unreadCount: 0,
  };
};

// Load persisted notifications
const persistedData = loadNotificationsFromStorage();

export const initialState: INotificationInitialState = {
  isShow: false,
  messageType: '',
  message: '',
  showAlert: false,
  alertMessage: '',
  alertType: '',
  // WebSocket notification initial state with persisted data
  notifications: persistedData.notifications,
  unreadCount: persistedData.unreadCount,
  isNotificationPanelOpen: false,
  wsConnectionStatus: 'disconnected',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ type: string; isShow: boolean; message: string | undefined | null }>,
    ) => {
      const { isShow, message, type } = action.payload;
      state.isShow = isShow;
      state.message = message;
      state.messageType = type;
    },
    setAlert: (
      state,
      action: PayloadAction<{ showAlert: boolean; message?: string; alertType?: string }>,
    ) => {
      const { showAlert, message, alertType } = action.payload;
      state.showAlert = showAlert;
      state.alertMessage = message;
      state.alertType = alertType;
    },
    // Add incoming notification
    addNotification: (state, action: PayloadAction<Omit<INotification, 'id' | 'isRead'>>) => {
      const { userId, title, message, time } = action.payload;

      // Generate unique ID
      const id = `${userId}-${new Date(time).getTime()}-${Math.random().toString(36).slice(2, 9)}`;

      // Create new notification
      const newNotification: INotification = {
        id,
        userId,
        title,
        message,
        time,
        isRead: false,
      };

      // Add to beginning of array (newest first)
      state.notifications.unshift(newNotification);

      // Increment unread count
      state.unreadCount += 1;

      // Limit to MAX_NOTIFICATIONS
      if (state.notifications.length > MAX_NOTIFICATIONS) {
        state.notifications = state.notifications.slice(0, MAX_NOTIFICATIONS);
      }

      // Remove notifications older than NOTIFICATION_EXPIRY_DAYS
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - NOTIFICATION_EXPIRY_DAYS);
      const expiryTimestamp = expiryDate.getTime();

      state.notifications = state.notifications.filter((notification) => {
        const notificationTime = new Date(notification.time).getTime();
        return notificationTime >= expiryTimestamp;
      });

      // Recalculate unread count after cleanup
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
    },
    // Mark specific notifications as read
    markNotificationsAsRead: (state, action: PayloadAction<string[]>) => {
      const notificationIds = action.payload;

      notificationIds.forEach((id) => {
        const notification = state.notifications.find((n) => n.id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
    },
    // Mark all notifications as read
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    // Toggle notification panel visibility
    toggleNotificationPanel: (state, action: PayloadAction<boolean>) => {
      state.isNotificationPanelOpen = action.payload;
    },
    // Update WebSocket connection status
    setWSConnectionStatus: (state, action: PayloadAction<WSConnectionStatus>) => {
      state.wsConnectionStatus = action.payload;
    },
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.isNotificationPanelOpen = false;
    },
  },
});

// Selector functions for derived state
export const selectNotifications = (state: RootState) => state.notification.notifications;

export const selectSortedNotifications = createSelector([selectNotifications], (notifications) => {
  // Already sorted by newest first when added, but ensure consistency
  return [...notifications].sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
});

export const selectUnreadCount = (state: RootState) => state.notification.unreadCount;

export const selectUnreadNotifications = createSelector([selectNotifications], (notifications) => {
  return notifications.filter((n) => !n.isRead);
});

export const selectIsNotificationPanelOpen = (state: RootState) =>
  state.notification.isNotificationPanelOpen;

export const selectWSConnectionStatus = (state: RootState) => state.notification.wsConnectionStatus;

export const {
  setMessages,
  setAlert,
  addNotification,
  markNotificationsAsRead,
  markAllAsRead,
  toggleNotificationPanel,
  setWSConnectionStatus,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

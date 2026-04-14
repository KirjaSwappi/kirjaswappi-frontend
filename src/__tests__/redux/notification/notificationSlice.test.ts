import { describe, expect, it, beforeEach, vi } from 'vitest';

// Mock localStorage BEFORE importing the slice
// This is critical because the slice reads from localStorage at module import time
const localStorageMock = vi.hoisted(() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
});

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

import notificationReducer, {
  initialState,
  setMessages,
  setAlert,
  addNotification,
  markNotificationsAsRead,
  markAllAsRead,
  toggleNotificationPanel,
  setWSConnectionStatus,
  clearNotifications,
  selectSortedNotifications,
  selectUnreadNotifications,
} from '../../../redux/feature/notification/notificationSlice';
import { INotification } from '../../../types/notification';
import type { RootState } from '../../../redux/store';

describe('notificationSlice', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(notificationReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setMessages', () => {
    it('should set message, type, and visibility', () => {
      const state = notificationReducer(
        initialState,
        setMessages({ type: 'SUCCESS', isShow: true, message: 'Test message' }),
      );

      expect(state.isShow).toBe(true);
      expect(state.message).toBe('Test message');
      expect(state.messageType).toBe('SUCCESS');
    });

    it('should handle ERROR message type', () => {
      const state = notificationReducer(
        initialState,
        setMessages({ type: 'ERROR', isShow: true, message: 'Error occurred' }),
      );

      expect(state.messageType).toBe('ERROR');
      expect(state.message).toBe('Error occurred');
    });
  });

  describe('setAlert', () => {
    it('should set alert with message and type', () => {
      const state = notificationReducer(
        initialState,
        setAlert({ showAlert: true, message: 'Alert message', alertType: 'WARNING' }),
      );

      expect(state.showAlert).toBe(true);
      expect(state.message).toBe('Alert message');
      expect(state.alertType).toBe('WARNING');
    });

    it('should hide alert when showAlert is false', () => {
      const state = notificationReducer(initialState, setAlert({ showAlert: false }));

      expect(state.showAlert).toBe(false);
    });
  });

  describe('addNotification', () => {
    const mockNotification = {
      userId: 'user-123',
      title: 'Test Notification',
      message: 'Test message',
      time: new Date().toISOString(),
    };

    it('should add a notification to the beginning of the array', () => {
      const state = notificationReducer(initialState, addNotification(mockNotification));

      expect(state.notifications).toHaveLength(1);
      expect(state.notifications[0].title).toBe('Test Notification');
      expect(state.notifications[0].isRead).toBe(false);
      expect(state.unreadCount).toBe(1);
    });

    it('should generate a unique ID for the notification', () => {
      const state = notificationReducer(initialState, addNotification(mockNotification));

      expect(state.notifications[0].id).toContain('user-123');
      expect(state.notifications[0].id).toMatch(/^user-123-\d+-[a-z0-9]+$/);
    });

    it('should increment unread count', () => {
      let state = notificationReducer(initialState, addNotification(mockNotification));
      expect(state.unreadCount).toBe(1);

      state = notificationReducer(
        state,
        addNotification({ ...mockNotification, time: new Date().toISOString() }),
      );
      expect(state.unreadCount).toBe(2);
    });

    it('should limit notifications to MAX_NOTIFICATIONS (50)', () => {
      let state = initialState;

      // Add 60 notifications
      for (let i = 0; i < 60; i++) {
        state = notificationReducer(
          state,
          addNotification({
            ...mockNotification,
            time: new Date(Date.now() + i * 1000).toISOString(),
          }),
        );
      }

      expect(state.notifications.length).toBeLessThanOrEqual(50);
    });

    it('should filter out notifications older than 7 days', () => {
      const oldNotification = {
        userId: 'user-123',
        title: 'Old Notification',
        message: 'Old message',
        time: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
      };

      const state = notificationReducer(initialState, addNotification(oldNotification));

      // Should be filtered out
      expect(state.notifications).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
    });

    it('should persist notifications to localStorage', () => {
      notificationReducer(initialState, addNotification(mockNotification));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'kirjaswappi_notifications',
        expect.any(String),
      );
    });
  });

  describe('markNotificationsAsRead', () => {
    const mockNotifications: INotification[] = [
      {
        id: '1',
        userId: 'user-123',
        title: 'Notification 1',
        message: 'Message 1',
        time: new Date().toISOString(),
        isRead: false,
      },
      {
        id: '2',
        userId: 'user-123',
        title: 'Notification 2',
        message: 'Message 2',
        time: new Date().toISOString(),
        isRead: false,
      },
    ];

    it('should mark specific notifications as read', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 2,
      };

      const state = notificationReducer(stateWithNotifications, markNotificationsAsRead(['1']));

      expect(state.notifications[0].isRead).toBe(true);
      expect(state.notifications[1].isRead).toBe(false);
      expect(state.unreadCount).toBe(1);
    });

    it('should decrement unread count correctly', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 2,
      };

      const state = notificationReducer(
        stateWithNotifications,
        markNotificationsAsRead(['1', '2']),
      );

      expect(state.unreadCount).toBe(0);
    });

    it('should not decrement unread count below 0', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      };

      const state = notificationReducer(
        stateWithNotifications,
        markNotificationsAsRead(['1', '2']),
      );

      expect(state.unreadCount).toBe(0);
    });

    it('should persist changes to localStorage', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 2,
      };

      notificationReducer(stateWithNotifications, markNotificationsAsRead(['1']));

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('markAllAsRead', () => {
    const mockNotifications: INotification[] = [
      {
        id: '1',
        userId: 'user-123',
        title: 'Notification 1',
        message: 'Message 1',
        time: new Date().toISOString(),
        isRead: false,
      },
      {
        id: '2',
        userId: 'user-123',
        title: 'Notification 2',
        message: 'Message 2',
        time: new Date().toISOString(),
        isRead: false,
      },
    ];

    it('should mark all notifications as read', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 2,
      };

      const state = notificationReducer(stateWithNotifications, markAllAsRead());

      expect(state.notifications[0].isRead).toBe(true);
      expect(state.notifications[1].isRead).toBe(true);
      expect(state.unreadCount).toBe(0);
    });

    it('should persist changes to localStorage', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 2,
      };

      notificationReducer(stateWithNotifications, markAllAsRead());

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('toggleNotificationPanel', () => {
    it('should open notification panel', () => {
      const state = notificationReducer(initialState, toggleNotificationPanel(true));
      expect(state.isNotificationPanelOpen).toBe(true);
    });

    it('should close notification panel', () => {
      const stateWithOpenPanel = { ...initialState, isNotificationPanelOpen: true };
      const state = notificationReducer(stateWithOpenPanel, toggleNotificationPanel(false));
      expect(state.isNotificationPanelOpen).toBe(false);
    });
  });

  describe('setWSConnectionStatus', () => {
    it('should set connection status to connected', () => {
      const state = notificationReducer(initialState, setWSConnectionStatus('connected'));
      expect(state.wsConnectionStatus).toBe('connected');
    });

    it('should set connection status to connecting', () => {
      const state = notificationReducer(initialState, setWSConnectionStatus('connecting'));
      expect(state.wsConnectionStatus).toBe('connecting');
    });

    it('should set connection status to error', () => {
      const state = notificationReducer(initialState, setWSConnectionStatus('error'));
      expect(state.wsConnectionStatus).toBe('error');
    });

    it('should set connection status to disconnected', () => {
      const state = notificationReducer(initialState, setWSConnectionStatus('disconnected'));
      expect(state.wsConnectionStatus).toBe('disconnected');
    });
  });

  describe('clearNotifications', () => {
    const mockNotifications: INotification[] = [
      {
        id: '1',
        userId: 'user-123',
        title: 'Notification 1',
        message: 'Message 1',
        time: new Date().toISOString(),
        isRead: false,
      },
    ];

    it('should clear all notifications', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 1,
        isNotificationPanelOpen: true,
      };

      const state = notificationReducer(stateWithNotifications, clearNotifications());

      expect(state.notifications).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
      expect(state.isNotificationPanelOpen).toBe(false);
    });

    it('should remove notifications from localStorage', () => {
      const stateWithNotifications = {
        ...initialState,
        notifications: mockNotifications,
        unreadCount: 1,
      };

      notificationReducer(stateWithNotifications, clearNotifications());

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('kirjaswappi_notifications');
    });
  });

  describe('selectors', () => {
    describe('selectSortedNotifications', () => {
      it('should return notifications sorted by time (newest first)', () => {
        const notifications: INotification[] = [
          {
            id: '1',
            userId: 'user-123',
            title: 'Old Notification',
            message: 'Message 1',
            time: new Date('2024-01-01').toISOString(),
            isRead: false,
          },
          {
            id: '2',
            userId: 'user-123',
            title: 'New Notification',
            message: 'Message 2',
            time: new Date('2024-12-31').toISOString(),
            isRead: false,
          },
        ];

        const sorted = selectSortedNotifications({
          notification: { ...initialState, notifications },
        } as RootState);

        expect(sorted[0].title).toBe('New Notification');
        expect(sorted[1].title).toBe('Old Notification');
      });
    });

    describe('selectUnreadNotifications', () => {
      it('should return only unread notifications', () => {
        const notifications: INotification[] = [
          {
            id: '1',
            userId: 'user-123',
            title: 'Unread Notification',
            message: 'Message 1',
            time: new Date().toISOString(),
            isRead: false,
          },
          {
            id: '2',
            userId: 'user-123',
            title: 'Read Notification',
            message: 'Message 2',
            time: new Date().toISOString(),
            isRead: true,
          },
        ];

        const unread = selectUnreadNotifications({
          notification: { ...initialState, notifications },
        } as RootState);

        expect(unread).toHaveLength(1);
        expect(unread[0].title).toBe('Unread Notification');
      });
    });
  });
});

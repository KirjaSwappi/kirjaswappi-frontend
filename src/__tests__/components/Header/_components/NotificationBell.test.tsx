import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import NotificationBell from '../../../../components/Header/_components/NotificationBell';
import { renderWithProviders } from '../../../utils/test-utils';
import { initialState as authInitialState } from '../../../../redux/feature/auth/authSlice';
import { initialState as notificationInitialState } from '../../../../redux/feature/notification/notificationSlice';

// Mock the image assets
vi.mock('../../../assets/notification.svg', () => ({ default: 'mock-bell-icon' }));
vi.mock('../../../assets/image/notification.png', () => ({ default: 'mock-no-notif-img' }));

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockNotifications = [
    {
      id: '1',
      userId: 'user-123',
      title: 'Test Notification 1',
      message: 'Message 1',
      time: new Date().toISOString(),
      isRead: false,
    },
  ];

  it('renders the bell icon', () => {
    renderWithProviders(<NotificationBell />, {
      preloadedState: {
        auth: {
          ...authInitialState,
          userInformation: { ...authInitialState.userInformation, id: 'user-123' },
        },
      },
    });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the unread count badge when there are unread notifications', () => {
    const preloadedState = {
      auth: {
        ...authInitialState,
        userInformation: {
          ...authInitialState.userInformation,
          id: 'user-123',
          email: 'test@example.com',
        },
      },
      notification: {
        ...notificationInitialState,
        notifications: mockNotifications,
        unreadCount: 1,
      },
    };

    renderWithProviders(<NotificationBell />, { preloadedState });
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows empty state when there are no notifications', async () => {
    const preloadedState = {
      auth: {
        ...authInitialState,
        userInformation: {
          ...authInitialState.userInformation,
          id: 'user-123',
          email: 'test@example.com',
        },
      },
      notification: {
        ...notificationInitialState,
        notifications: [],
        unreadCount: 0,
        isNotificationPanelOpen: true,
      },
    };

    renderWithProviders(<NotificationBell />, { preloadedState });
    expect(screen.getByText(/no notifications yet/i)).toBeInTheDocument();
  });

  it('marks notifications as read when the panel is opened', async () => {
    const preloadedState = {
      auth: {
        ...authInitialState,
        userInformation: {
          ...authInitialState.userInformation,
          id: 'user-123',
          email: 'test@example.com',
        },
      },
      notification: {
        ...notificationInitialState,
        notifications: mockNotifications,
        unreadCount: 1,
        isNotificationPanelOpen: false,
      },
    };

    const { store } = renderWithProviders(<NotificationBell />, { preloadedState });

    // Click the bell to open the panel
    const bellButton = screen.getByRole('button', { name: /notifications/i });
    act(() => {
      bellButton.click();
    });

    // Verify unread count becomes 0
    expect(store.getState().notification.unreadCount).toBe(0);
    expect(store.getState().notification.notifications[0].isRead).toBe(true);
  });
});

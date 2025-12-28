import { renderHook, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationWS } from '../../hooks/useNotificationWS';
import { setupTestStore } from '../utils/test-utils';
import { MockWebSocket } from '../mocks/websocket';
import { ReactNode } from 'react';
import { initialState as authInitialState } from '../../redux/feature/auth/authSlice';

// Help helper to wrap hook with Provider
const wrapper = (store: ReturnType<typeof setupTestStore>) => {
  const ReduxProviderWrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  ReduxProviderWrapper.displayName = 'ReduxProviderWrapper';
  return ReduxProviderWrapper;
};

describe('useNotificationWS', () => {
  let store: ReturnType<typeof setupTestStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    MockWebSocket.lastInstance = null;
    // Setup store with a mock user
    store = setupTestStore({
      auth: {
        ...authInitialState,
        userInformation: {
          ...authInitialState.userInformation,
          id: 'user-123',
          email: 'test@example.com',
          lastName: 'User',
          books: [],
        },
      },
    });
  });

  it('should establish WebSocket connection when userId is present', async () => {
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
      expect(MockWebSocket.lastInstance?.url).toContain('userId=user-123');
    });

    await waitFor(() => {
      expect(store.getState().notification.wsConnectionStatus).toBe('connected');
    });
  });

  it('should dispatch addNotification when a message is received', async () => {
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    // Wait for connection to be established
    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws = MockWebSocket.lastInstance!;

    // Simulate incoming notification
    const mockPayload = {
      UserID: 'user-123',
      Title: 'Test Notification',
      Message: 'Hello World',
      Time: new Date().toISOString(),
    };

    await act(async () => {
      ws.triggerMessage(mockPayload);
    });

    await waitFor(() => {
      const notifications = store.getState().notification.notifications;
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Test Notification');
    });
  });

  it('should handle connection closure and attempts reconnection', async () => {
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws1 = MockWebSocket.lastInstance!;

    // Trigger abnormal close
    await act(async () => {
      ws1.triggerClose(1006, 'Abnormal Closure', false);
    });

    await waitFor(() => {
      expect(store.getState().notification.wsConnectionStatus).toBe('connecting');
    });

    // It should eventually try to reconnect (which creates a new instance)
    await waitFor(
      () => {
        expect(MockWebSocket.lastInstance).not.toBe(ws1);
      },
      { timeout: 5000 },
    );
  });
});

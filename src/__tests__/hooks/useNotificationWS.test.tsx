import { renderHook, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { useNotificationWS } from '../../hooks/useNotificationWS';
import { setupTestStore } from '../utils/test-utils';
import { MockWebSocket } from '../mocks/websocket';
import { ReactNode } from 'react';
import { initialState as authInitialState } from '../../redux/feature/auth/authSlice';

// Helper to wrap hook with Provider
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
    // Clear sessionStorage to prevent state leakage between tests
    sessionStorage.clear();
    // Mock console to avoid test output clutter
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupStoreWithUser = (userId = 'user-123') => {
    return setupTestStore({
      auth: {
        ...authInitialState,
        userInformation: {
          ...authInitialState.userInformation,
          id: userId,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          books: [],
        },
      },
    });
  };

  const setupStoreWithoutUser = () => {
    return setupTestStore({
      auth: {
        ...authInitialState,
        userInformation: {
          ...authInitialState.userInformation,
          id: '',
          email: '',
        },
      },
    });
  };

  it('should establish WebSocket connection when userId is present', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
      expect(MockWebSocket.lastInstance?.url).toContain('userId=user-123');
    });

    await waitFor(() => {
      expect(store.getState().notification.wsConnectionStatus).toBe('connected');
    });
  });

  it('should not establish connection when userId is not present', async () => {
    store = setupStoreWithoutUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    // Wait to ensure effects have run and no connection is made
    await waitFor(
      () => {
        expect(MockWebSocket.lastInstance).toBeNull();
      },
      { timeout: 100 },
    );
  });

  it('should dispatch addNotification when a valid notification is received', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws = MockWebSocket.lastInstance!;

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
      expect(notifications[0].message).toBe('Hello World');
      expect(store.getState().notification.unreadCount).toBe(1);
    });
  });

  it('should handle ping-pong messages correctly', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws = MockWebSocket.lastInstance!;

    // Simulate server sending ping
    await act(async () => {
      ws.triggerMessage({ type: 'ping' });
    });

    // Should respond with pong
    await waitFor(() => {
      expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ type: 'pong' }));
    });

    // Should not add notification
    const notifications = store.getState().notification.notifications;
    expect(notifications).toHaveLength(0);
  });

  it('should ignore invalid notification payloads', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws = MockWebSocket.lastInstance!;

    // Missing required fields
    await act(async () => {
      ws.triggerMessage({
        UserID: 'user-123',
        Title: 'Test',
        // Missing Message and Time
      });
    });

    // Should not add notification
    const notifications = store.getState().notification.notifications;
    expect(notifications).toHaveLength(0);
  });

  it('should handle connection closure and attempts reconnection', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws1 = MockWebSocket.lastInstance!;

    // Trigger abnormal close (not clean)
    await act(async () => {
      ws1.triggerClose(1006, 'Abnormal Closure', false);
    });

    await waitFor(() => {
      expect(store.getState().notification.wsConnectionStatus).toBe('connecting');
    });

    // Should attempt reconnection (creates new instance)
    await waitFor(
      () => {
        expect(MockWebSocket.lastInstance).not.toBe(ws1);
      },
      { timeout: 5000 },
    );
  });

  it('should not reconnect on clean connection close', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws1 = MockWebSocket.lastInstance!;

    // Trigger clean close
    await act(async () => {
      ws1.triggerClose(1000, 'Normal closure', true);
    });

    await waitFor(() => {
      expect(store.getState().notification.wsConnectionStatus).toBe('disconnected');
    });
  });

  it('should handle connection errors', async () => {
    store = setupStoreWithUser();
    renderHook(() => useNotificationWS(), { wrapper: wrapper(store) });

    await waitFor(() => {
      expect(MockWebSocket.lastInstance).not.toBeNull();
    });

    const ws = MockWebSocket.lastInstance!;

    // Trigger error
    await act(async () => {
      ws.triggerError(new Error('Connection failed'));
    });

    await waitFor(() => {
      expect(store.getState().notification.wsConnectionStatus).toBe('error');
    });
  });
});

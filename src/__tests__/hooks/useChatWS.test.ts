import { describe, it, expect, vi } from 'vitest';

vi.mock('@stomp/stompjs', () => ({
  Client: vi.fn().mockImplementation(() => ({
    activate: vi.fn(),
    deactivate: vi.fn(),
    subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    publish: vi.fn(),
    connected: false,
    active: false,
  })),
}));

vi.mock('sockjs-client', () => ({
  default: vi.fn(),
}));

vi.mock('../../redux/api/apiSlice', () => ({
  api: { util: { invalidateTags: vi.fn() } },
}));

vi.mock('../../redux/feature/messages/messagesSlice', () => ({
  receiveMessage: (p: unknown) => ({ type: 'messages/receiveMessage', payload: p }),
  setInboxList: (p: unknown) => ({ type: 'messages/setInboxList', payload: p }),
  updateInboxItem: (p: unknown) => ({ type: 'messages/updateInboxItem', payload: p }),
  InboxItem: {},
}));

vi.mock('../../redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: { userInformation: { id: '' } },
      chat: { selectedChatId: '' },
    }),
}));

vi.mock('../../utility/cookies', () => ({
  getCookie: () => null,
}));

import { useChatWS } from '../../hooks/useChatWS';
import { renderHook } from '@testing-library/react';

describe('useChatWS', () => {
  it('returns expected interface', () => {
    const { result } = renderHook(() => useChatWS());
    expect(result.current).toHaveProperty('isConnected');
    expect(result.current).toHaveProperty('sendChatMessage');
    expect(result.current).toHaveProperty('subscribeToChat');
    expect(result.current).toHaveProperty('unsubscribeFromChat');
  });

  it('isConnected is false by default', () => {
    const { result } = renderHook(() => useChatWS());
    expect(result.current.isConnected).toBe(false);
  });

  it('sendChatMessage is a function', () => {
    const { result } = renderHook(() => useChatWS());
    expect(typeof result.current.sendChatMessage).toBe('function');
  });

  it('subscribeToChat is a function', () => {
    const { result } = renderHook(() => useChatWS());
    expect(typeof result.current.subscribeToChat).toBe('function');
  });

  it('unsubscribeFromChat is a function', () => {
    const { result } = renderHook(() => useChatWS());
    expect(typeof result.current.unsubscribeFromChat).toBe('function');
  });

  it('sendChatMessage does not throw when not connected', () => {
    const { result } = renderHook(() => useChatWS());
    expect(() => result.current.sendChatMessage('swap-1', 'hello')).not.toThrow();
  });

  it('subscribeToChat does not throw when not connected', () => {
    const { result } = renderHook(() => useChatWS());
    expect(() => result.current.subscribeToChat('swap-1')).not.toThrow();
  });

  it('unsubscribeFromChat does not throw when not subscribed', () => {
    const { result } = renderHook(() => useChatWS());
    expect(() => result.current.unsubscribeFromChat('swap-1')).not.toThrow();
  });
});

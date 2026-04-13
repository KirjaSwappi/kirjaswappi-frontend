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

vi.mock('../../redux/hooks', () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: { userInformation: { id: '' } },
    }),
}));

vi.mock('../../utility/cookies', () => ({
  getCookie: () => null,
}));

vi.mock('../../utils/stomp.utils', () => ({
  getStompBrokerUrl: () => 'ws://localhost/ws',
}));

import { useStompWS } from '../../hooks/useStompWS';
import { renderHook } from '@testing-library/react';

describe('useStompWS', () => {
  it('returns expected interface', () => {
    const { result } = renderHook(() => useStompWS());
    expect(result.current).toHaveProperty('subscribe');
    expect(result.current).toHaveProperty('publish');
    expect(result.current).toHaveProperty('isConnected');
  });

  it('isConnected is false by default', () => {
    const { result } = renderHook(() => useStompWS());
    expect(result.current.isConnected).toBe(false);
  });

  it('subscribe is a function', () => {
    const { result } = renderHook(() => useStompWS());
    expect(typeof result.current.subscribe).toBe('function');
  });

  it('publish is a function', () => {
    const { result } = renderHook(() => useStompWS());
    expect(typeof result.current.publish).toBe('function');
  });

  it('subscribe returns undefined when not connected', () => {
    const { result } = renderHook(() => useStompWS());
    const sub = result.current.subscribe('/test', vi.fn());
    expect(sub).toBeUndefined();
  });

  it('publish does not throw when not connected', () => {
    const { result } = renderHook(() => useStompWS());
    expect(() => result.current.publish('/test', { data: 'test' })).not.toThrow();
  });

  it('accepts initial subscriptions config', () => {
    const { result } = renderHook(() =>
      useStompWS([{ destination: '/user/queue/test', handler: vi.fn() }]),
    );
    expect(result.current.isConnected).toBe(false);
  });
});

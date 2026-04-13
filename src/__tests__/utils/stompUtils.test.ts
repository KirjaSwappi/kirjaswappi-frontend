import { describe, it, expect } from 'vitest';
import { getStompBrokerUrl } from '../../utils/stomp.utils';

describe('stomp.utils', () => {
  it('returns a websocket URL string', () => {
    const url = getStompBrokerUrl();
    expect(url).toContain('/ws/websocket');
  });

  it('uses ws or wss protocol', () => {
    const url = getStompBrokerUrl();
    expect(url).toMatch(/^wss?:\/\//);
  });

  it('does not contain /api/v1 in the URL', () => {
    const url = getStompBrokerUrl();
    expect(url).not.toContain('/api/v1');
  });
});

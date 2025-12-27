import { vi } from 'vitest';

/**
 * A manual mock for the WebSocket API
 */
export class MockWebSocket {
  url: string;
  readyState: number = 0; // CONNECTING
  onopen: ((event: { type: string }) => void) | null = null;
  onclose: ((event: { code: number; reason: string; wasClean: boolean }) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  send = vi.fn();
  close = vi.fn();

  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  static lastInstance: MockWebSocket | null = null;

  constructor(url: string) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    MockWebSocket.lastInstance = this;

    // Simulate connection opening in the next tick
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen({ type: 'open' });
      }
    }, 0);
  }

  // Helper to trigger a message from the "server"
  triggerMessage(data: unknown) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  // Helper to trigger a close event from the "server"
  triggerClose(code: number = 1000, reason: string = '', wasClean: boolean = true) {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose({ code, reason, wasClean });
    }
  }

  // Helper to trigger an error
  triggerError(error: unknown = {}) {
    if (this.onerror) {
      this.onerror(error);
    }
  }
}

// Global mock assignment
vi.stubGlobal('WebSocket', MockWebSocket);

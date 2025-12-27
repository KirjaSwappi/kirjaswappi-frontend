import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Global cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables
vi.stubGlobal('import.meta', {
  env: {
    VITE_NOTIFICATION_WS_URL: 'ws://localhost:8080/ws',
  },
});

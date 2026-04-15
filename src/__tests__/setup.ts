import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Global cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock HTMLMediaElement methods
globalThis.HTMLMediaElement.prototype.load = vi.fn();
globalThis.HTMLMediaElement.prototype.play = vi.fn();
globalThis.HTMLMediaElement.prototype.pause = vi.fn();

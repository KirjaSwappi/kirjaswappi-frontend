import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet" />,
}));

vi.mock('../../components/Footer', () => ({
  default: () => <div data-testid="footer" />,
}));

vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock('../../components/shared/SwapRequestModal/SwapRequestModal', () => ({
  default: () => <div data-testid="swap-modal" />,
}));

vi.mock('../../components/shared/LoginModal/LoginModal', () => ({
  default: () => <div data-testid="login-modal" />,
}));

vi.mock('../../hooks/useNotificationWS', () => ({
  useNotificationWS: vi.fn(),
}));

vi.mock('../../contexts/ChatWSContext', () => ({
  ChatWSProvider: ({ children }: { children: React.ReactNode }) => children,
  useChatWSContext: vi.fn(() => ({
    isConnected: false,
    sendChatMessage: vi.fn(),
    subscribeToChat: vi.fn(),
    unsubscribeFromChat: vi.fn(),
  })),
}));

import Layout from '../../layout';

describe('Layout', () => {
  it('renders header', () => {
    render(<Layout />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<Layout />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders outlet', () => {
    render(<Layout />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders swap modal', () => {
    render(<Layout />);
    expect(screen.getByTestId('swap-modal')).toBeInTheDocument();
  });
});

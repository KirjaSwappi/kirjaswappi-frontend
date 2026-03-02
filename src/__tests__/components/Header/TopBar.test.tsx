import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '../../utils/test-utils';
import TopBar from '../../../components/Header/_components/TopBar';

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: vi.fn(() => ({
    clicked: false,
    setClicked: vi.fn(),
    reference: { current: null },
  })),
}));

vi.mock('../../../hooks/useScroll', () => ({
  default: vi.fn(() => ({ scrolled: false })),
}));

describe('TopBar Unread Badge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show badge when there are unread messages', () => {
    const preloadedState = {
      auth: { userInformation: { id: 'user-1' }, isLoggedIn: true },
      chat: {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Book',
            unread: true,
            unreadMessageCount: 3,
            messages: [],
            senderName: 'Test User',
          },
        ],
        selectedChatId: '',
      },
      open: { searchToggle: false },
    };

    const { container } = renderWithProviders(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>,
      { preloadedState },
    );

    // Check if badge element exists
    const badge = container.querySelector('.bg-red-500');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('3');
  });

  it('should show 9+ when unread count exceeds 9', () => {
    const preloadedState = {
      auth: { userInformation: { id: 'user-1' }, isLoggedIn: true },
      chat: {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Book 1',
            unread: true,
            unreadMessageCount: 8,
            messages: [],
          },
          {
            id: 'chat-2',
            name: 'Test Book 2',
            unread: true,
            unreadMessageCount: 7,
            messages: [],
          },
        ],
        selectedChatId: '',
      },
      open: { searchToggle: false },
    };

    const { container } = renderWithProviders(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>,
      { preloadedState },
    );

    const badge = container.querySelector('.bg-red-500');
    expect(badge).toHaveTextContent('9+');
  });

  it('should not show badge when no unread messages', () => {
    const preloadedState = {
      auth: { userInformation: { id: 'user-1' }, isLoggedIn: true },
      chat: {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      },
      open: { searchToggle: false },
    };

    const { container } = renderWithProviders(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>,
      { preloadedState },
    );

    const badge = container.querySelector('.bg-red-500');
    expect(badge).not.toBeInTheDocument();
  });

  it('should aggregate unread counts from multiple chats', () => {
    const preloadedState = {
      auth: { userInformation: { id: 'user-1' }, isLoggedIn: true },
      chat: {
        chats: [
          { id: 'chat-1', name: 'Book 1', unread: true, unreadMessageCount: 2, messages: [] },
          { id: 'chat-2', name: 'Book 2', unread: true, unreadMessageCount: 3, messages: [] },
          { id: 'chat-3', name: 'Book 3', unread: true, unreadMessageCount: 1, messages: [] },
        ],
        selectedChatId: '',
      },
      open: { searchToggle: false },
    };

    const { container } = renderWithProviders(
      <BrowserRouter>
        <TopBar />
      </BrowserRouter>,
      { preloadedState },
    );

    const badge = container.querySelector('.bg-red-500');
    expect(badge).toHaveTextContent('6');
  });
});

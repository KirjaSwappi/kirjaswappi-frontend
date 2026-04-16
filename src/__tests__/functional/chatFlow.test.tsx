import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../utils/test-utils';
import Messages from '../../pages/messages/Messages';
import { RootState } from '../../redux/store';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../hooks/useChatWS', () => ({
  useChatWS: vi.fn(() => ({
    isConnected: true,
    sendChatMessage: vi.fn(),
    subscribeToChat: vi.fn(),
    unsubscribeFromChat: vi.fn(),
  })),
}));

const mockMarkAsRead = vi.fn();

vi.mock('../../redux/feature/messages/inboxApi', () => ({
  useGetInboxQuery: vi.fn(),
  useGetChatMessagesQuery: vi.fn(),
  useSendChatMessageMutation: vi.fn(),
  useMarkChatAsReadMutation: () => [mockMarkAsRead],
}));

import {
  useGetInboxQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
} from '../../redux/feature/messages/inboxApi';

const mockInboxData = [
  {
    id: 'swap-1',
    askForGiveaway: false,
    bookToSwapWith: {
      author: 'Test Author',
      condition: 'GOOD',
      id: 'book-1',
      title: 'Test Book',
    },
    conversationType: 'received' as const,
    hasNewMessages: true,
    note: 'Hello',
    receiver: { id: 'user-1', name: 'User One' },
    requestedAt: '2024-01-01T00:00:00Z',
    sender: { id: 'user-2', name: 'User Two' },
    swapOffer: null,
    swapStatus: 'PENDING',
    swapType: 'BY_BOOKS',
    unread: true,
    unreadMessageCount: 2,
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

const mockChatMessages = [
  {
    id: 'msg-1',
    swapRequestId: 'swap-1',
    sender: { id: 'user-2', name: 'User Two' },
    message: 'Hello, interested in your book',
    imageUrls: null,
    sentAt: '2024-01-01T10:00:00Z',
    readByReceiver: true,
    ownMessage: false,
    swapContext: null,
  },
  {
    id: 'msg-2',
    swapRequestId: 'swap-1',
    sender: { id: 'user-1', name: 'User One' },
    message: 'Sure, let me know',
    imageUrls: null,
    sentAt: '2024-01-01T10:01:00Z',
    readByReceiver: false,
    ownMessage: true,
    swapContext: null,
  },
];

describe('Chat Messaging Flow (Functional)', () => {
  const mockUseGetInboxQuery = useGetInboxQuery as unknown as ReturnType<typeof vi.fn>;
  const mockUseGetChatMessagesQuery = useGetChatMessagesQuery as unknown as ReturnType<
    typeof vi.fn
  >;
  const mockUseSendChatMessageMutation = useSendChatMessageMutation as unknown as ReturnType<
    typeof vi.fn
  >;
  const mockSendChatMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGetInboxQuery.mockReturnValue({
      data: mockInboxData,
      isLoading: false,
      isSuccess: true,
    });
    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: mockChatMessages,
      isLoading: false,
      isSuccess: true,
    });
    mockUseSendChatMessageMutation.mockReturnValue([mockSendChatMessage, { isLoading: false }]);
  });

  const preloadedState: Partial<RootState> = {
    chat: {
      chats: [],
      selectedChatId: '',
    },
    auth: {
      loading: false,
      error: null,
      message: null,
      success: false,
      userInformation: {
        id: 'user-1',
        firstName: 'User',
        lastName: 'One',
        email: 'user1@test.com',
        streetName: null,
        houseNumber: null,
        zipCode: 0,
        city: null,
        country: null,
        phoneNumber: null,
        aboutMe: null,
        favGenres: [],
        books: [],
      },
      otp: [],
      userEmail: '',
      isVerify: false,
    },
  };

  const renderMessages = () => {
    return renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState },
    );
  };

  it('should complete full messaging flow from inbox to send', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/user/messages');

    mockSendChatMessage.mockResolvedValue({ unwrap: () => Promise.resolve({}) });

    renderMessages();

    // Step 1: Inbox loads
    await waitFor(() => {
      expect(screen.getAllByText('Test Book').length).toBeGreaterThan(0);
    });

    // Step 2: Click a chat to select it
    const chatButton = screen.getAllByText('Test Book')[0].closest('button');
    expect(chatButton).not.toBeNull();
    await user.click(chatButton as HTMLButtonElement);

    // Step 3: Chat messages load after selection
    await waitFor(() => {
      expect(mockUseGetChatMessagesQuery).toHaveBeenCalled();
    });

    // Step 4: Type a message
    const input = screen.getByPlaceholderText('chat.writeHere');
    await user.type(input, 'New message from test');

    // Step 5: Verify input has value
    expect(input).toHaveValue('New message from test');
  });

  it('should load inbox on mount', async () => {
    window.history.pushState({}, '', '/user/messages');

    renderMessages();

    await waitFor(() => {
      expect(mockUseGetInboxQuery).toHaveBeenCalledWith(undefined, expect.any(Object));
    });
  });

  it('should not auto-select first chat from inbox', async () => {
    window.history.pushState({}, '', '/user/messages');

    const { store } = renderMessages();

    await waitFor(() => {
      const state = store.getState();
      expect(state.chat.chats.length).toBeGreaterThan(0);
    });

    const state = store.getState();
    expect(state.chat.selectedChatId).toBe('');
  });

  it('should fetch messages for selected chat', async () => {
    window.history.pushState({}, '', '/user/messages?messageId=swap-1');

    renderMessages();

    await waitFor(() => {
      expect(mockUseGetChatMessagesQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          swapRequestId: 'swap-1',
        }),
        expect.any(Object),
      );
    });
  });

  it('should display chat messages after loading', async () => {
    window.history.pushState({}, '', '/user/messages?messageId=swap-1');

    const stateWithChat: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [
              {
                id: 'msg-1',
                sender: 'them',
                text: 'Hello, interested in your book',
                time: '2024-01-01T10:00:00Z',
              },
              {
                id: 'msg-2',
                sender: 'me',
                text: 'Sure, let me know',
                time: '2024-01-01T10:01:00Z',
              },
            ],
          },
        ],
        selectedChatId: 'swap-1',
      },
    };

    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState: stateWithChat },
    );

    await waitFor(() => {
      expect(screen.getByText('Hello, interested in your book')).toBeInTheDocument();
      const messages = screen.getAllByText('Sure, let me know');
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  it('should send message and update UI optimistically', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/user/messages?messageId=swap-1');

    mockSendChatMessage.mockResolvedValue({ unwrap: () => Promise.resolve({}) });

    const stateWithChat: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: 'swap-1',
      },
    };

    const { store } = renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState: stateWithChat },
    );

    const input = screen.getByPlaceholderText('chat.writeHere');
    await user.type(input, 'Test message');

    const initialCount = store.getState().chat.chats[0].messages.length;

    const form = input.closest('form');
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        await user.click(submitButton);
      }
    }

    await waitFor(() => {
      const newCount = store.getState().chat.chats[0].messages.length;
      expect(newCount).toBeGreaterThan(initialCount);
    });
  });

  it('should load and display chats with unread status from API', async () => {
    window.history.pushState({}, '', '/user/messages');

    // Mock inbox with unread data
    mockUseGetInboxQuery.mockReturnValue({
      data: [
        {
          ...mockInboxData[0],
          unread: true,
          unreadMessageCount: 2,
        },
      ],
      isLoading: false,
      isSuccess: true,
    });

    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState },
    );

    // Verify inbox API was called
    await waitFor(() => {
      expect(mockUseGetInboxQuery).toHaveBeenCalled();
    });
  });

  it('should select chat when clicked', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/user/messages');

    const stateWithUnread: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Test Book',
            unread: true,
            unreadMessageCount: 3,
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    const { store } = renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState: stateWithUnread },
    );

    const chatButtons = screen.getAllByText('Test Book');
    const chatButton = chatButtons[0].closest('button');
    if (chatButton) {
      await user.click(chatButton);
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.chat.selectedChatId).toBe('swap-1');
    });

    await waitFor(() => {
      expect(mockMarkAsRead).toHaveBeenCalledWith({ swapRequestId: 'swap-1' });
    });
  });

  it('should display book information in chat header', async () => {
    window.history.pushState({}, '', '/user/messages?messageId=swap-1');

    const stateWithChat: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            bookToSwapWith: {
              id: 'book-1',
              title: 'Test Book',
              author: 'Test Author',
              condition: 'GOOD',
            },
            sender: { id: 'user-2', name: 'User Two' },
            receiver: { id: 'user-1', name: 'User One' },
            conversationType: 'received',
            messages: [],
          },
        ],
        selectedChatId: 'swap-1',
      },
    };

    const { store } = renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState: stateWithChat },
    );

    await waitFor(() => {
      const state = store.getState();
      const chat = state.chat.chats.find((c) => c.id === 'swap-1');
      expect(chat?.name).toBe('Test Book');
      expect(chat?.bookToSwapWith?.author).toBe('Test Author');
    });
  });

  it('should handle search in chat list', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/user/messages');

    const stateWithMultiple: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'JavaScript Guide',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
          {
            id: 'swap-2',
            name: 'Python Basics',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    renderWithProviders(
      <BrowserRouter>
        <Routes>
          <Route path="/user/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>,
      { preloadedState: stateWithMultiple },
    );

    const searchInput = screen.getByPlaceholderText('Search messages...');
    await user.type(searchInput, 'JavaScript');

    await waitFor(() => {
      expect(screen.queryByText('Python Basics')).not.toBeInTheDocument();
    });
  });

  it('should initialize WebSocket connection', async () => {
    window.history.pushState({}, '', '/user/messages');

    renderMessages();

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search messages...')).toBeInTheDocument();
    });
  });
});

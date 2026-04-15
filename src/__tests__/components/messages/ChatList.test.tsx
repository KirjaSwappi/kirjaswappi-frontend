import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { renderWithProviders } from '../../utils/test-utils';
import ChatList from '../../../pages/messages/components/ChatList';
import { RootState } from '../../../redux/store';

vi.mock('../../../redux/feature/messages/inboxApi', () => ({
  useGetInboxQuery: vi.fn(),
}));

import { useGetInboxQuery } from '../../../redux/feature/messages/inboxApi';

const mockInboxData = [
  {
    id: 'swap-1',
    askForGiveaway: false,
    bookToSwapWith: {
      author: 'Author One',
      condition: 'GOOD',
      id: 'book-1',
      title: 'Book One',
    },
    conversationType: 'received' as const,
    hasNewMessages: true,
    note: 'Hello there',
    receiver: { id: 'user-1', name: 'User One' },
    requestedAt: '2024-01-01T00:00:00Z',
    sender: { id: 'user-2', name: 'User Two' },
    swapOffer: null,
    swapStatus: 'PENDING',
    swapType: 'BY_BOOKS',
    unread: true,
    unreadMessageCount: 3,
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'swap-2',
    askForGiveaway: false,
    bookToSwapWith: {
      author: 'Author Two',
      condition: 'NEW',
      id: 'book-2',
      title: 'Book Two',
    },
    conversationType: 'sent' as const,
    hasNewMessages: false,
    note: 'Hi',
    receiver: { id: 'user-3', name: 'User Three' },
    requestedAt: '2024-01-03T00:00:00Z',
    sender: { id: 'user-1', name: 'User One' },
    swapOffer: null,
    swapStatus: 'ACCEPTED',
    swapType: 'BY_GENRES',
    unread: false,
    unreadMessageCount: 0,
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

describe('ChatList Component', () => {
  const mockUseGetInboxQuery = useGetInboxQuery as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
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

  const renderChatList = (state = preloadedState) => {
    return renderWithProviders(
      <BrowserRouter>
        <ChatList />
      </BrowserRouter>,
      { preloadedState: state },
    );
  };

  it('should render loading skeletons when fetching inbox', () => {
    mockUseGetInboxQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
    });

    renderChatList();

    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render search input', () => {
    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList();

    expect(screen.getByPlaceholderText('Search messages...')).toBeInTheDocument();
  });

  it('should render empty state when no chats exist', () => {
    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList();

    expect(screen.getByText('chat.noConversations')).toBeInTheDocument();
    expect(screen.getByText('chat.startSwap')).toBeInTheDocument();
  });

  it('should render chat list items', () => {
    mockUseGetInboxQuery.mockReturnValue({
      data: mockInboxData,
      isLoading: false,
      isSuccess: true,
    });

    const stateWithChats: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: true,
            unreadMessageCount: 3,
            senderName: 'User Two',
            messages: [
              { id: 'msg-1', sender: 'them', text: 'Hello there', time: '2024-01-02T00:00:00Z' },
            ],
          },
          {
            id: 'swap-2',
            name: 'Book Two',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'User Three',
            messages: [{ id: 'msg-2', sender: 'me', text: 'Hi', time: '2024-01-04T00:00:00Z' }],
          },
        ],
        selectedChatId: '',
      },
    };

    renderChatList(stateWithChats);

    expect(screen.getByText('Book One')).toBeInTheDocument();
    expect(screen.getByText('Book Two')).toBeInTheDocument();
  });

  it('should display unread message badge', () => {
    mockUseGetInboxQuery.mockReturnValue({
      data: mockInboxData,
      isLoading: false,
      isSuccess: true,
    });

    const stateWithUnread: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: true,
            unreadMessageCount: 3,
            senderName: 'User Two',
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    renderChatList(stateWithUnread);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display 9+ for unread counts over 9', () => {
    const stateWithManyUnread: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: true,
            unreadMessageCount: 15,
            senderName: 'User Two',
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList(stateWithManyUnread);

    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('should filter chats based on search input', async () => {
    const user = userEvent.setup();

    const stateWithMultipleChats: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'JavaScript Guide',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'Alice',
            messages: [],
          },
          {
            id: 'swap-2',
            name: 'Python Basics',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'Bob',
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList(stateWithMultipleChats);

    expect(screen.getByText('JavaScript Guide')).toBeInTheDocument();
    expect(screen.getByText('Python Basics')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search messages...');
    await user.type(searchInput, 'JavaScript');

    await waitFor(() => {
      expect(screen.getByText('JavaScript Guide')).toBeInTheDocument();
      expect(screen.queryByText('Python Basics')).not.toBeInTheDocument();
    });
  });

  it('should filter by sender name', async () => {
    const user = userEvent.setup();

    const stateWithChats: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'Alice Smith',
            messages: [],
          },
          {
            id: 'swap-2',
            name: 'Book Two',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'Bob Jones',
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList(stateWithChats);

    const searchInput = screen.getByPlaceholderText('Search messages...');
    await user.type(searchInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
    });
  });

  it('should highlight selected chat', () => {
    const stateWithSelection: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
          {
            id: 'swap-2',
            name: 'Book Two',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: 'swap-1',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    const { container } = renderChatList(stateWithSelection);

    const selectedButton = container.querySelector('.bg-AntiFlashWhite');
    expect(selectedButton).toBeInTheDocument();
  });

  it('should display last message preview', () => {
    const stateWithMessages: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'User Two',
            messages: [
              {
                id: 'msg-1',
                sender: 'them',
                text: 'This is the last message',
                time: '2024-01-02T00:00:00Z',
              },
            ],
          },
        ],
        selectedChatId: '',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList(stateWithMessages);

    expect(screen.getByText(/This is the last message/)).toBeInTheDocument();
  });

  it('should show image indicator for image messages', () => {
    const stateWithImageMessage: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: false,
            unreadMessageCount: 0,
            senderName: 'User Two',
            messages: [
              {
                id: 'msg-1',
                sender: 'them',
                text: '',
                time: '2024-01-02T00:00:00Z',
                images: ['image.jpg'],
              },
            ],
          },
        ],
        selectedChatId: '',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    renderChatList(stateWithImageMessage);

    expect(screen.getByText('📷 Image')).toBeInTheDocument();
  });

  it('should not auto-select first chat on initial load', async () => {
    mockUseGetInboxQuery.mockReturnValue({
      data: mockInboxData,
      isLoading: false,
      isSuccess: true,
    });

    const { store } = renderChatList();

    await waitFor(() => {
      const state = store.getState();
      expect(state.chat.chats.length).toBeGreaterThan(0);
    });

    const state = store.getState();
    expect(state.chat.selectedChatId).toBe('');
  });

  it('should navigate to chat on click', async () => {
    const user = userEvent.setup();

    const stateWithChats: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-1',
            name: 'Book One',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      },
    };

    mockUseGetInboxQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
    });

    const { store } = renderChatList(stateWithChats);

    const chatButton = screen.getByText('Book One').closest('button');
    if (chatButton) {
      await user.click(chatButton);
    }

    await waitFor(() => {
      const state = store.getState();
      expect(state.chat.selectedChatId).toBe('swap-1');
    });
  });
});

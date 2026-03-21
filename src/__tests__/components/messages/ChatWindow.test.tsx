import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import ChatWindow from '../../../pages/messages/components/ChatWindow';
import { RootState } from '../../../redux/store';

const mockChatMessages = [
  {
    id: 'msg-1',
    swapRequestId: 'swap-123',
    sender: { id: 'user-2', name: 'User Two' },
    message: 'Hello, how are you?',
    imageUrls: null,
    sentAt: '2024-01-01T10:00:00Z',
    readByReceiver: true,
    ownMessage: false,
    swapContext: null,
  },
  {
    id: 'msg-2',
    swapRequestId: 'swap-123',
    sender: { id: 'user-1', name: 'User One' },
    message: 'I am fine, thanks!',
    imageUrls: null,
    sentAt: '2024-01-01T10:01:00Z',
    readByReceiver: false,
    ownMessage: true,
    swapContext: null,
  },
  {
    id: 'msg-3',
    swapRequestId: 'swap-123',
    sender: { id: 'user-2', name: 'User Two' },
    message: null,
    imageUrls: ['https://example.com/image.jpg'],
    sentAt: '2024-01-01T10:02:00Z',
    readByReceiver: false,
    ownMessage: false,
    swapContext: null,
  },
];

vi.mock('../../../redux/feature/messages/inboxApi', () => ({
  useGetChatMessagesQuery: vi.fn(),
}));

import { useGetChatMessagesQuery } from '../../../redux/feature/messages/inboxApi';

describe('ChatWindow Component', () => {
  const mockUseGetChatMessagesQuery = useGetChatMessagesQuery as unknown as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const preloadedState: Partial<RootState> = {
    chat: {
      chats: [
        {
          id: 'swap-123',
          name: 'Test Book',
          unread: false,
          unreadMessageCount: 0,
          messages: [],
        },
      ],
      selectedChatId: 'swap-123',
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

  it('should render loading skeleton when fetching messages', () => {
    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: undefined,
      isFetching: true,
      isSuccess: false,
    });

    renderWithProviders(<ChatWindow />, { preloadedState });

    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render empty state when no chat is selected', () => {
    const stateWithoutSelection: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [],
        selectedChatId: '',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateWithoutSelection });

    expect(screen.getByText('Select a chat to start messaging')).toBeInTheDocument();
  });

  it('should render chat messages correctly', async () => {
    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: mockChatMessages,
      isFetching: false,
      isSuccess: true,
    });

    const { store } = renderWithProviders(<ChatWindow />, { preloadedState });

    await waitFor(() => {
      const state = store.getState();
      expect(state.chat.chats[0].messages.length).toBeGreaterThan(0);
    });
  });

  it('should display text messages', async () => {
    const stateWithMessages: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-123',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [
              {
                id: 'msg-1',
                sender: 'them',
                text: 'Hello, how are you?',
                time: '2024-01-01T10:00:00Z',
              },
              {
                id: 'msg-2',
                sender: 'me',
                text: 'I am fine, thanks!',
                time: '2024-01-01T10:01:00Z',
              },
            ],
          },
        ],
        selectedChatId: 'swap-123',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateWithMessages });

    await waitFor(() => {
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
      expect(screen.getByText('I am fine, thanks!')).toBeInTheDocument();
    });
  });

  it('should display images in messages', async () => {
    const stateWithImages: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-123',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [
              {
                id: 'msg-1',
                sender: 'them',
                text: '',
                time: '2024-01-01T10:00:00Z',
                images: ['https://example.com/image.jpg'],
              },
            ],
          },
        ],
        selectedChatId: 'swap-123',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateWithImages });

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('should apply correct styling for own messages', async () => {
    const stateWithOwnMessage: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-123',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [
              { id: 'msg-1', sender: 'me', text: 'My message', time: '2024-01-01T10:00:00Z' },
            ],
          },
        ],
        selectedChatId: 'swap-123',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, {
      preloadedState: stateWithOwnMessage,
    });

    await waitFor(() => {
      const messageElement = screen.getByText('My message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement.className).toContain('bg-primary');
      expect(messageElement.className).toContain('text-white');
    });
  });

  it('should apply correct styling for other user messages', async () => {
    const stateWithTheirMessage: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-123',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [
              { id: 'msg-1', sender: 'them', text: 'Their message', time: '2024-01-01T10:00:00Z' },
            ],
          },
        ],
        selectedChatId: 'swap-123',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateWithTheirMessage });

    await waitFor(() => {
      const messageElement = screen.getByText('Their message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement.className).toContain('bg-gray-200');
      expect(messageElement.className).toContain('text-black');
    });
  });

  it('should format timestamps correctly', async () => {
    const stateWithMessage: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-123',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [{ id: 'msg-1', sender: 'me', text: 'Test', time: '2024-01-01T14:30:00Z' }],
          },
        ],
        selectedChatId: 'swap-123',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateWithMessage });

    await waitFor(() => {
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}\s?(AM|PM)/i);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  it('should handle messages with both text and images', async () => {
    const stateWithBoth: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [
          {
            id: 'swap-123',
            name: 'Test Book',
            unread: false,
            unreadMessageCount: 0,
            messages: [
              {
                id: 'msg-1',
                sender: 'them',
                text: 'Check this out!',
                time: '2024-01-01T10:00:00Z',
                images: ['https://example.com/image.jpg'],
              },
            ],
          },
        ],
        selectedChatId: 'swap-123',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: [],
      isFetching: false,
      isSuccess: true,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateWithBoth });

    await waitFor(() => {
      expect(screen.getByText('Check this out!')).toBeInTheDocument();
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('should skip query when no chat is selected', () => {
    const stateNoSelection: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [],
        selectedChatId: '',
      },
    };

    mockUseGetChatMessagesQuery.mockReturnValue({
      currentData: undefined,
      isFetching: false,
      isSuccess: false,
    });

    renderWithProviders(<ChatWindow />, { preloadedState: stateNoSelection });

    expect(mockUseGetChatMessagesQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        swapRequestId: '',
      }),
      expect.objectContaining({
        skip: true,
      }),
    );
  });
});

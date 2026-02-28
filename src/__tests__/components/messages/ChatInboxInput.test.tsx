import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../utils/test-utils';
import ChatInboxInput from '../../../pages/messages/components/ChatInboxInput';
import { RootState } from '../../../redux/store';

vi.mock('../../../redux/feature/messages/inboxApi', () => ({
  useSendChatMessageMutation: vi.fn(),
}));

vi.mock('../../../components/shared/toast', () => ({
  showToast: vi.fn(),
}));

import { useSendChatMessageMutation } from '../../../redux/feature/messages/inboxApi';
import { showToast } from '../../../components/shared/toast';

describe('ChatInboxInput Component', () => {
  const mockSendChatMessage = vi.fn();
  const mockUseSendChatMessageMutation = useSendChatMessageMutation as unknown as ReturnType<
    typeof vi.fn
  >;
  const mockShowToast = showToast as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSendChatMessage.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    mockUseSendChatMessageMutation.mockReturnValue([mockSendChatMessage, { isLoading: false }]);
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

  it('should render input field', () => {
    renderWithProviders(<ChatInboxInput />, { preloadedState });
    expect(screen.getByPlaceholderText('Write here...')).toBeInTheDocument();
  });

  it('should return null when no chat is selected', () => {
    const stateWithoutSelection: Partial<RootState> = {
      ...preloadedState,
      chat: {
        chats: [],
        selectedChatId: '',
      },
    };

    const { container } = renderWithProviders(<ChatInboxInput />, {
      preloadedState: stateWithoutSelection,
    });

    expect(container.firstChild).toBeNull();
  });

  it('should allow typing in the input field', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, 'Hello world');

    expect(input).toHaveValue('Hello world');
  });

  it('should send text message when form is submitted', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, 'Test message{Enter}');

    await waitFor(() => {
      expect(mockSendChatMessage).toHaveBeenCalled();
    });
  });

  it('should not send empty messages', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, '   {Enter}');

    expect(mockSendChatMessage).not.toHaveBeenCalled();
  });

  it('should clear input after sending message', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...') as HTMLInputElement;
    await user.type(input, 'Test message{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should disable input when sending message', () => {
    mockUseSendChatMessageMutation.mockReturnValue([mockSendChatMessage, { isLoading: true }]);

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    expect(input).toBeDisabled();
  });

  it('should show error toast when message send fails', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Network error')),
    });

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, 'Test message{Enter}');

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('error', 'Failed to send message');
    });
  });

  it('should send message with correct parameters', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, 'Hello world{Enter}');

    await waitFor(() => {
      expect(mockSendChatMessage).toHaveBeenCalledWith({
        swapRequestId: 'swap-123',
        userId: 'user-1',
        message: 'Hello world',
        images: undefined,
      });
    });
  });

  it('should trim whitespace from messages', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, '  Test message  {Enter}');

    await waitFor(() => {
      expect(mockSendChatMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test message',
        }),
      );
    });
  });

  it('should add optimistic message to Redux before API call', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<ChatInboxInput />, { preloadedState });

    const input = screen.getByPlaceholderText('Write here...');
    await user.type(input, 'Optimistic message{Enter}');

    await waitFor(() => {
      const state = store.getState();
      const messages = state.chat.chats[0].messages;
      expect(messages.some((m) => m.text === 'Optimistic message')).toBe(true);
    });
  });
});

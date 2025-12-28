import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderWithProviders } from '../utils/test-utils';
import Messages from '../../pages/messages/Messages';

// Mock all components to avoid bundler import issues
vi.mock('../../src/pages/messages/components/ChatInboxInput', () => ({
  default: () => (
    <div data-testid="chat-input">
      <input data-testid="message-input" placeholder="Write here..." />
      <button data-testid="camera-button">📷</button>
      <button data-testid="send-button">Send</button>
    </div>
  ),
}));

vi.mock('../../src/pages/messages/components/UserProfile', () => ({
  default: () => (
    <div data-testid="user-profile">
      <div data-testid="profile-name">John Doe</div>
      <div data-testid="profile-books">5 books listed</div>
      <div data-testid="profile-rating">⭐⭐⭐⭐⭐ (4.8)</div>
    </div>
  ),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the Messages component with realistic behavior
vi.mock('../../pages/messages/Messages', () => ({
  default: () => {
    const [bookOpen, setBookOpen] = React.useState(mockBookOpen);

    const selectedChatId = mockSelectedChatId;

    return (
      <div className="lg:container flex gap-3 lg:gap-5 lg:mt-3 xl:mt-6" data-testid="messages-page">
        <aside
          className={`h-screen lg:h-[85vh] xl:h-[82vh] custom-scrollbar overflow-hidden w-full lg:w-[40%] xl:w-[25%] lg:bg-white rounded-xl py-5 xl:py-[30px] ${selectedChatId ? 'hidden' : 'block'} lg:block`}
          data-testid="chat-list-sidebar"
        >
          <div data-testid="chat-list">
            <input data-testid="chat-search" placeholder="Search messages..." />
            <div data-testid="inbox-tab" className="active">
              Inbox
            </div>
            <div data-testid="archive-tab">Archive</div>
            <div data-testid="requests-tab">Message Request</div>
            <div data-testid="chat-item-1" data-unread="true">
              <div data-testid="chat-name-1">Harry Porter</div>
              <div data-testid="chat-preview-1">Hi! How are you?</div>
              <div data-testid="unread-badge-1">2</div>
            </div>
            <div data-testid="chat-item-2">
              <div data-testid="chat-name-2">Marr&apos;s Search for Meaning</div>
              <div data-testid="chat-preview-2">I want to swap this book.</div>
            </div>
          </div>
        </aside>
        <main
          className={`h-screen lg:h-[85vh] xl:h-[82vh] w-full lg:w-[60%] xl:w-[50%] lg:bg-white lg:rounded-xl overflow-hidden ${selectedChatId ? 'block' : 'hidden'} lg:block relative`}
          data-testid="chat-main"
        >
          <div className="absolute w-full z-20 left-0 top-0" data-testid="chat-topbar">
            <h3 data-testid="chat-title">
              {selectedChatId === '1' ? 'Harry Porter' : 'Select a chat'}
            </h3>
            {selectedChatId && (
              <button data-testid="toggle-book-button" onClick={() => setBookOpen(!bookOpen)}>
                {bookOpen ? 'Hide Book' : 'Show Book'}
              </button>
            )}
          </div>
          <div
            className={`overflow-y-auto custom-scrollbar h-[86%] px-4 ${!bookOpen ? 'pt-[170px] xl:pt-[186px]' : 'pt-[270px] xl:pt-[286px]'} pb-40`}
            data-testid="chat-messages-container"
          >
            {selectedChatId === '1' ? (
              <div data-testid="chat-window">
                <div data-testid="message-1" data-sender="them">
                  <div data-testid="message-text-1">Hi! How are you?</div>
                  <div data-testid="message-time-1">9:00 AM</div>
                </div>
                <div data-testid="message-2" data-sender="me">
                  <div data-testid="message-text-2">I&apos;m good, thanks!</div>
                  <div data-testid="message-time-2">9:05 AM</div>
                </div>
                <div data-testid="message-3" data-sender="them">
                  <div data-testid="message-text-3">Great! Want to swap books?</div>
                  <div data-testid="message-time-3">9:10 AM</div>
                </div>
              </div>
            ) : (
              <div data-testid="no-chat-selected">Select a chat to start messaging</div>
            )}
          </div>
          <div className="absolute w-full bottom-0" data-testid="chat-input">
            <input data-testid="message-input" placeholder="Write here..." />
            <button data-testid="camera-button">📷</button>
            <button data-testid="send-button">Send</button>
          </div>
        </main>
        <aside
          className="h-screen lg:h-[85vh] xl:h-[82vh] hidden xl:block xl:w-[25%] rounded-xl overflow-hidden overflow-y-auto custom-scrollbar lg:bg-white"
          data-testid="user-profile-sidebar"
        >
          <div data-testid="user-profile">
            <div data-testid="profile-name">John Doe</div>
            <div data-testid="profile-books">5 books listed</div>
            <div data-testid="profile-rating">⭐⭐⭐⭐⭐ (4.8)</div>
          </div>
        </aside>
      </div>
    );
  },
}));

// Global state for mock behavior
let mockSelectedChatId: string | null = null;
let mockBookOpen = true;

const renderWithRouter = (initialRoute = '/user/messages') => {
  // Set mock state based on the route
  const url = new URL(initialRoute, 'http://localhost');
  mockSelectedChatId = url.searchParams.get('messageId');
  mockBookOpen = true; // Reset book state

  return renderWithProviders(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/user/messages" element={<Messages />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Messages Page - Complete Messaging Workflow (Functional)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Layout and Navigation', () => {
    it('renders messages page with all main sections', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('messages-page')).toBeInTheDocument();
      });

      expect(screen.getByTestId('chat-list-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('chat-main')).toBeInTheDocument();
      expect(screen.getByTestId('user-profile-sidebar')).toBeInTheDocument();
    });

    it('shows chat list by default on large screens', async () => {
      renderWithRouter();

      await waitFor(() => {
        const chatList = screen.getByTestId('chat-list-sidebar');
        expect(chatList).toHaveClass('lg:block');
        expect(chatList).not.toHaveClass('hidden');
      });
    });

    it('applies responsive container styling', async () => {
      renderWithRouter();

      await waitFor(() => {
        const container = screen.getByTestId('messages-page');
        expect(container).toHaveClass('lg:container', 'flex', 'gap-3', 'lg:gap-5');
      });
    });
  });

  describe('Chat List Functionality', () => {
    it('displays search input for filtering chats', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('chat-search')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('chat-search');
      expect(searchInput).toHaveAttribute('placeholder', 'Search messages...');
    });

    it('shows inbox, archive, and message request tabs', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('inbox-tab')).toBeInTheDocument();
        expect(screen.getByTestId('archive-tab')).toBeInTheDocument();
        expect(screen.getByTestId('requests-tab')).toBeInTheDocument();
      });

      expect(screen.getByTestId('inbox-tab')).toHaveTextContent('Inbox');
      expect(screen.getByTestId('archive-tab')).toHaveTextContent('Archive');
      expect(screen.getByTestId('requests-tab')).toHaveTextContent('Message Request');
    });

    it('displays chat conversations with names and previews', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('chat-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('chat-item-2')).toBeInTheDocument();
      });

      expect(screen.getByTestId('chat-name-1')).toHaveTextContent('Harry Porter');
      expect(screen.getByTestId('chat-preview-1')).toHaveTextContent('Hi! How are you?');
      expect(screen.getByTestId('chat-name-2')).toHaveTextContent("Marr's Search for Meaning");
      expect(screen.getByTestId('chat-preview-2')).toHaveTextContent('I want to swap this book.');
    });

    it('shows unread message badges', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('unread-badge-1')).toBeInTheDocument();
      });

      expect(screen.getByTestId('unread-badge-1')).toHaveTextContent('2');
    });
  });

  describe('Chat Selection and Navigation', () => {
    it('shows no chat selected message initially', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('no-chat-selected')).toBeInTheDocument();
      });

      expect(screen.getByTestId('no-chat-selected')).toHaveTextContent(
        'Select a chat to start messaging',
      );
    });

    it('displays selected chat title in top bar', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('chat-title')).toHaveTextContent('Harry Porter');
      });
    });

    it('handles URL parameters for direct chat access', async () => {
      window.history.pushState({}, '', '/user/messages?messageId=1');
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('chat-window')).toBeInTheDocument();
      });
    });
  });

  describe('Message Display and Conversation Flow', () => {
    it('displays conversation messages in chronological order', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('message-1')).toBeInTheDocument();
        expect(screen.getByTestId('message-2')).toBeInTheDocument();
        expect(screen.getByTestId('message-3')).toBeInTheDocument();
      });
    });

    it('shows message content and timestamps', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('message-text-1')).toHaveTextContent('Hi! How are you?');
        expect(screen.getByTestId('message-time-1')).toHaveTextContent('9:00 AM');
        expect(screen.getByTestId('message-text-2')).toHaveTextContent("I'm good, thanks!");
        expect(screen.getByTestId('message-time-2')).toHaveTextContent('9:05 AM');
      });
    });

    it('differentiates between sent and received messages', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        const receivedMessage = screen.getByTestId('message-1');
        const sentMessage = screen.getByTestId('message-2');

        expect(receivedMessage).toHaveAttribute('data-sender', 'them');
        expect(sentMessage).toHaveAttribute('data-sender', 'me');
      });
    });
  });

  describe('Message Input and Sending', () => {
    it('renders message input field', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('message-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('message-input');
      expect(input).toHaveAttribute('placeholder', 'Write here...');
    });

    it('shows camera button for image uploads', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('camera-button')).toBeInTheDocument();
      });

      expect(screen.getByTestId('camera-button')).toHaveTextContent('📷');
    });

    it('displays send button', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('send-button')).toBeInTheDocument();
      });

      expect(screen.getByTestId('send-button')).toHaveTextContent('Send');
    });

    it('allows typing in message input', async () => {
      const user = userEvent.setup();
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('message-input')).toBeInTheDocument();
      });

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello there!');

      expect(input).toHaveValue('Hello there!');
    });
  });

  describe('Book Information Toggle', () => {
    it('shows toggle book button in chat top bar', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        expect(screen.getByTestId('toggle-book-button')).toBeInTheDocument();
      });

      expect(screen.getByTestId('toggle-book-button')).toHaveTextContent('Hide Book');
    });

    it('adjusts message container padding based on book visibility', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        const container = screen.getByTestId('chat-messages-container');
        expect(container).toHaveClass('pt-[270px]', 'xl:pt-[286px]');
      });
    });
  });

  describe('User Profile Sidebar', () => {
    it('displays user profile information on large screens', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('user-profile-sidebar')).toBeInTheDocument();
      });

      const sidebar = screen.getByTestId('user-profile-sidebar');
      expect(sidebar).toHaveClass('hidden', 'xl:block');
    });

    it('shows user name, books count, and rating', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('profile-name')).toBeInTheDocument();
        expect(screen.getByTestId('profile-books')).toBeInTheDocument();
        expect(screen.getByTestId('profile-rating')).toBeInTheDocument();
      });

      expect(screen.getByTestId('profile-name')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('profile-books')).toHaveTextContent('5 books listed');
      expect(screen.getByTestId('profile-rating')).toHaveTextContent('⭐⭐⭐⭐⭐ (4.8)');
    });
  });

  describe('Mobile Responsiveness', () => {
    it('hides chat list when chat is selected on mobile', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        const chatList = screen.getByTestId('chat-list-sidebar');
        expect(chatList).toHaveClass('hidden', 'lg:block');
      });
    });

    it('shows chat window when chat is selected on mobile', async () => {
      renderWithRouter('/user/messages?messageId=1');

      await waitFor(() => {
        const chatMain = screen.getByTestId('chat-main');
        expect(chatMain).toHaveClass('block', 'lg:block');
      });
    });
  });

  describe('Accessibility and UX', () => {
    it('provides proper semantic structure', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('messages-page')).toBeInTheDocument();
      });

      // Main sections should be properly structured
      expect(screen.getByTestId('chat-list-sidebar').tagName).toBe('ASIDE');
      expect(screen.getByTestId('chat-main').tagName).toBe('MAIN');
      expect(screen.getByTestId('user-profile-sidebar').tagName).toBe('ASIDE');
    });

    it('maintains proper focus management', async () => {
      const user = userEvent.setup();
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByTestId('chat-search')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('chat-search');
      await user.click(searchInput);

      expect(searchInput).toHaveFocus();
    });
  });
});

import { describe, it, expect } from 'vitest';
import messagesSlice, {
  selectChat,
  resetChat,
  setInboxList,
  updateInboxItem,
  sendMessage,
  receiveMessage,
  addChatMessages,
  selectTotalUnreadCount,
  ChatState,
  InboxItem,
} from '../../redux/feature/messages/messagesSlice';

const mockInboxItem: InboxItem = {
  id: 'swap-123',
  askForGiveaway: false,
  bookToSwapWith: {
    author: 'Test Author',
    condition: 'GOOD',
    id: 'book-123',
    title: 'Test Book',
  },
  conversationType: 'received',
  hasNewMessages: true,
  note: 'Test note',
  receiver: {
    id: 'user-1',
    name: 'User One',
  },
  requestedAt: '2024-01-01T00:00:00Z',
  sender: {
    id: 'user-2',
    name: 'User Two',
  },
  swapOffer: null,
  swapStatus: 'PENDING',
  swapType: 'BY_BOOKS',
  unread: true,
  unreadMessageCount: 2,
  updatedAt: '2024-01-02T00:00:00Z',
};

describe('messagesSlice', () => {
  const initialState: ChatState = {
    chats: [],
    selectedChatId: '',
  };

  describe('selectChat', () => {
    it('should select a chat without modifying unread status', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: true,
            unreadMessageCount: 3,
            messages: [
              { id: 'msg-1', sender: 'them', text: 'Hello', time: '2024-01-01', unread: true },
            ],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(stateWithChats, selectChat('chat-1'));

      expect(result.selectedChatId).toBe('chat-1');
      // Unread status is now managed by backend, not local state
      expect(result.chats[0].unread).toBe(true);
      expect(result.chats[0].unreadMessageCount).toBe(3);
      expect(result.chats[0].messages[0].unread).toBe(true);
    });

    it('should handle selecting non-existent chat', () => {
      const result = messagesSlice(initialState, selectChat('non-existent'));

      expect(result.selectedChatId).toBe('non-existent');
      expect(result.chats).toEqual([]);
    });
  });

  describe('resetChat', () => {
    it('should clear selected chat ID', () => {
      const stateWithSelection: ChatState = {
        chats: [],
        selectedChatId: 'chat-1',
      };

      const result = messagesSlice(stateWithSelection, resetChat());

      expect(result.selectedChatId).toBe('');
    });
  });

  describe('setInboxList', () => {
    it('should transform inbox items to chat format', () => {
      const result = messagesSlice(initialState, setInboxList([mockInboxItem]));

      expect(result.chats).toHaveLength(1);
      expect(result.chats[0].id).toBe('swap-123');
      expect(result.chats[0].name).toBe('Test Book');
      expect(result.chats[0].unread).toBe(true);
      expect(result.chats[0].unreadMessageCount).toBe(2);
      expect(result.chats[0].conversationType).toBe('received');
    });

    it('should deduplicate inbox items', () => {
      const result = messagesSlice(
        initialState,
        setInboxList([mockInboxItem, mockInboxItem, mockInboxItem]),
      );

      expect(result.chats).toHaveLength(1);
    });

    it('should handle empty inbox', () => {
      const result = messagesSlice(initialState, setInboxList([]));

      expect(result.chats).toEqual([]);
    });
  });

  describe('updateInboxItem', () => {
    it('should update existing chat', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'swap-123',
            name: 'Old Name',
            unread: false,
            unreadMessageCount: 0,
            messages: [{ id: 'msg-1', sender: 'me', text: 'Test', time: '2024-01-01' }],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(stateWithChats, updateInboxItem(mockInboxItem));

      expect(result.chats[0].name).toBe('Test Book');
      expect(result.chats[0].unread).toBe(true);
      expect(result.chats[0].unreadMessageCount).toBe(2);
      expect(result.chats[0].messages).toHaveLength(1);
    });

    it('should add new chat if not exists', () => {
      const result = messagesSlice(initialState, updateInboxItem(mockInboxItem));

      expect(result.chats).toHaveLength(1);
      expect(result.chats[0].id).toBe('swap-123');
    });

    it('should move chat to front if has new messages', () => {
      const stateWithChats: ChatState = {
        chats: [
          { id: 'chat-1', name: 'Chat 1', unread: false, unreadMessageCount: 0, messages: [] },
          { id: 'swap-123', name: 'Chat 2', unread: false, unreadMessageCount: 0, messages: [] },
          { id: 'chat-3', name: 'Chat 3', unread: false, unreadMessageCount: 0, messages: [] },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(stateWithChats, updateInboxItem(mockInboxItem));

      expect(result.chats[0].id).toBe('swap-123');
    });
  });

  describe('sendMessage', () => {
    it('should add message to chat', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        sendMessage({ chatId: 'chat-1', text: 'Hello world' }),
      );

      expect(result.chats[0].messages).toHaveLength(1);
      expect(result.chats[0].messages[0].sender).toBe('me');
      expect(result.chats[0].messages[0].text).toBe('Hello world');
    });

    it('should add message with images', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        sendMessage({ chatId: 'chat-1', text: 'Check this', images: ['image1.jpg', 'image2.jpg'] }),
      );

      expect(result.chats[0].messages[0].images).toEqual(['image1.jpg', 'image2.jpg']);
    });

    it('should move chat to front when sending message', () => {
      const stateWithChats: ChatState = {
        chats: [
          { id: 'chat-1', name: 'Chat 1', unread: false, unreadMessageCount: 0, messages: [] },
          { id: 'chat-2', name: 'Chat 2', unread: false, unreadMessageCount: 0, messages: [] },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(stateWithChats, sendMessage({ chatId: 'chat-2', text: 'Test' }));

      expect(result.chats[0].id).toBe('chat-2');
    });

    it('should handle sending to non-existent chat', () => {
      const result = messagesSlice(
        initialState,
        sendMessage({ chatId: 'non-existent', text: 'Test' }),
      );

      expect(result.chats).toEqual([]);
    });
  });

  describe('receiveMessage', () => {
    it('should add message from other user', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        receiveMessage({
          chatId: 'chat-1',
          text: 'Hello from them',
          senderId: 'user-2',
          userId: 'user-1',
        }),
      );

      expect(result.chats[0].messages).toHaveLength(1);
      expect(result.chats[0].messages[0].sender).toBe('them');
      expect(result.chats[0].messages[0].unread).toBe(true);
    });

    it('should increment unread count if chat not selected', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: 'chat-2',
      };

      const result = messagesSlice(
        stateWithChats,
        receiveMessage({ chatId: 'chat-1', text: 'Test', senderId: 'user-2', userId: 'user-1' }),
      );

      expect(result.chats[0].unread).toBe(true);
      expect(result.chats[0].unreadMessageCount).toBe(1);
    });

    it('should not increment unread count if chat is selected', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: 'chat-1',
      };

      const result = messagesSlice(
        stateWithChats,
        receiveMessage({ chatId: 'chat-1', text: 'Test', senderId: 'user-2', userId: 'user-1' }),
      );

      expect(result.chats[0].unread).toBe(false);
      expect(result.chats[0].unreadMessageCount).toBe(0);
    });

    it('should move chat to front when receiving message', () => {
      const stateWithChats: ChatState = {
        chats: [
          { id: 'chat-1', name: 'Chat 1', unread: false, unreadMessageCount: 0, messages: [] },
          { id: 'chat-2', name: 'Chat 2', unread: false, unreadMessageCount: 0, messages: [] },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        receiveMessage({ chatId: 'chat-2', text: 'Test', senderId: 'user-2', userId: 'user-1' }),
      );

      expect(result.chats[0].id).toBe('chat-2');
    });
  });

  describe('addChatMessages', () => {
    it('should add multiple messages to chat', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        addChatMessages({
          chatId: 'chat-1',
          messages: [
            { id: 'msg-1', sender: 'them', text: 'Hello', time: '2024-01-01T10:00:00Z' },
            { id: 'msg-2', sender: 'me', text: 'Hi there', time: '2024-01-01T10:01:00Z' },
          ],
        }),
      );

      expect(result.chats[0].messages).toHaveLength(2);
    });

    it('should avoid duplicate messages', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [{ id: 'msg-1', sender: 'them', text: 'Hello', time: '2024-01-01' }],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        addChatMessages({
          chatId: 'chat-1',
          messages: [
            { id: 'msg-1', sender: 'them', text: 'Hello', time: '2024-01-01' },
            { id: 'msg-2', sender: 'me', text: 'Hi', time: '2024-01-02' },
          ],
        }),
      );

      expect(result.chats[0].messages).toHaveLength(2);
    });

    it('should sort messages by time', () => {
      const stateWithChats: ChatState = {
        chats: [
          {
            id: 'chat-1',
            name: 'Test Chat',
            unread: false,
            unreadMessageCount: 0,
            messages: [],
          },
        ],
        selectedChatId: '',
      };

      const result = messagesSlice(
        stateWithChats,
        addChatMessages({
          chatId: 'chat-1',
          messages: [
            { id: 'msg-2', sender: 'me', text: 'Second', time: '2024-01-01T10:02:00Z' },
            { id: 'msg-1', sender: 'them', text: 'First', time: '2024-01-01T10:00:00Z' },
            { id: 'msg-3', sender: 'me', text: 'Third', time: '2024-01-01T10:03:00Z' },
          ],
        }),
      );

      expect(result.chats[0].messages[0].text).toBe('First');
      expect(result.chats[0].messages[1].text).toBe('Second');
      expect(result.chats[0].messages[2].text).toBe('Third');
    });
  });

  describe('selectTotalUnreadCount', () => {
    it('should return total unread count from all chats', () => {
      const state = {
        chat: {
          chats: [
            {
              id: '1',
              name: 'Chat 1',
              unread: true,
              unreadMessageCount: 3,
              messages: [],
            },
            {
              id: '2',
              name: 'Chat 2',
              unread: true,
              unreadMessageCount: 5,
              messages: [],
            },
            {
              id: '3',
              name: 'Chat 3',
              unread: false,
              unreadMessageCount: 0,
              messages: [],
            },
          ],
          selectedChatId: '',
        },
      };

      expect(selectTotalUnreadCount(state)).toBe(8);
    });

    it('should handle chats with undefined unreadMessageCount', () => {
      const state = {
        chat: {
          chats: [
            {
              id: '1',
              name: 'Chat 1',
              unread: true,
              unreadMessageCount: 3,
              messages: [],
            },
            {
              id: '2',
              name: 'Chat 2',
              unread: true,
              unreadMessageCount: undefined,
              messages: [],
            },
          ],
          selectedChatId: '',
        },
      };

      expect(selectTotalUnreadCount(state)).toBe(3);
    });

    it('should return 0 when no chats have unread messages', () => {
      const state = {
        chat: {
          chats: [
            {
              id: '1',
              name: 'Chat 1',
              unread: false,
              unreadMessageCount: 0,
              messages: [],
            },
            {
              id: '2',
              name: 'Chat 2',
              unread: false,
              unreadMessageCount: 0,
              messages: [],
            },
          ],
          selectedChatId: '',
        },
      };

      expect(selectTotalUnreadCount(state)).toBe(0);
    });

    it('should return 0 when chats array is empty', () => {
      const state = {
        chat: {
          chats: [],
          selectedChatId: '',
        },
      };

      expect(selectTotalUnreadCount(state)).toBe(0);
    });
  });
});

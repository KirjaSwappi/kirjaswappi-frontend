import { describe, it, expect } from 'vitest';
import chatMessageReducer, {
  setMessages,
  addMessage,
  clearMessages,
  setLoadingMessages,
  setInbox,
  updateInboxItem,
  setLoadingInbox,
  ChatState,
  ChatMessage,
  InboxItem,
} from '../../redux/feature/chat/chatMessageSlice';

const initialState: ChatState = {
  messages: {},
  inbox: [],
  isLoadingMessages: false,
  isLoadingInbox: false,
};

const mockMessage: ChatMessage = {
  id: 'msg-1',
  swapRequestId: 'swap-123',
  sender: {
    id: 'user-1',
    name: 'Alice',
  },
  message: 'Hello!',
  imageUrls: null,
  sentAt: '2024-01-01T10:00:00Z',
  readByReceiver: false,
  ownMessage: false,
};

const mockInboxItem: InboxItem = {
  id: 'swap-123',
  swapType: 'BY_BOOKS',
  swapStatus: 'PENDING',
  requestedAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  sender: {
    id: 'user-1',
    name: 'Alice',
  },
  receiver: {
    id: 'user-2',
    name: 'Bob',
  },
  bookToSwapWith: {
    id: 'book-1',
    title: 'Test Book',
    author: 'Test Author',
    condition: 'GOOD',
  },
  unreadMessageCount: 2,
  isUnread: true,
  hasNewMessages: true,
  conversationType: 'received',
  lastMessageContent: 'Hello!',
  lastMessageSenderId: 'user-1',
  lastMessageSentAt: '2024-01-02T10:00:00Z',
  lastMessageIsImage: false,
};

describe('chatMessageSlice', () => {
  it('should return the initial state', () => {
    expect(chatMessageReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setMessages', () => {
    it('should set messages for a swap request', () => {
      const result = chatMessageReducer(
        initialState,
        setMessages({ swapRequestId: 'swap-123', messages: [mockMessage] }),
      );

      expect(result.messages['swap-123']).toHaveLength(1);
      expect(result.messages['swap-123'][0]).toEqual(mockMessage);
    });

    it('should overwrite existing messages for the same swap request', () => {
      const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
          'swap-123': [mockMessage],
        },
      };

      const newMessage: ChatMessage = {
        ...mockMessage,
        id: 'msg-2',
        message: 'New message',
      };

      const result = chatMessageReducer(
        stateWithMessages,
        setMessages({ swapRequestId: 'swap-123', messages: [newMessage] }),
      );

      expect(result.messages['swap-123']).toHaveLength(1);
      expect(result.messages['swap-123'][0].id).toBe('msg-2');
    });

    it('should handle empty messages array', () => {
      const result = chatMessageReducer(
        initialState,
        setMessages({ swapRequestId: 'swap-456', messages: [] }),
      );

      expect(result.messages['swap-456']).toEqual([]);
    });

    it('should keep messages for other swap requests', () => {
      const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
          'swap-111': [mockMessage],
        },
      };

      const result = chatMessageReducer(
        stateWithMessages,
        setMessages({ swapRequestId: 'swap-222', messages: [mockMessage] }),
      );

      expect(result.messages['swap-111']).toHaveLength(1);
      expect(result.messages['swap-222']).toHaveLength(1);
    });
  });

  describe('addMessage', () => {
    it('should add a message to an existing conversation', () => {
      const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
          'swap-123': [],
        },
      };

      const result = chatMessageReducer(stateWithMessages, addMessage(mockMessage));

      expect(result.messages['swap-123']).toHaveLength(1);
      expect(result.messages['swap-123'][0]).toEqual(mockMessage);
    });

    it('should create a new conversation when swapRequestId does not exist', () => {
      const result = chatMessageReducer(initialState, addMessage(mockMessage));

      expect(result.messages['swap-123']).toHaveLength(1);
      expect(result.messages['swap-123'][0]).toEqual(mockMessage);
    });

    it('should not add duplicate messages with the same ID', () => {
      const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
          'swap-123': [mockMessage],
        },
      };

      const duplicateMessage: ChatMessage = {
        ...mockMessage,
        message: 'Different content but same ID',
      };

      const result = chatMessageReducer(stateWithMessages, addMessage(duplicateMessage));

      expect(result.messages['swap-123']).toHaveLength(1);
      expect(result.messages['swap-123'][0].message).toBe('Hello!');
    });

    it('should add multiple unique messages', () => {
      let state = chatMessageReducer(initialState, addMessage(mockMessage));

      const secondMessage: ChatMessage = {
        ...mockMessage,
        id: 'msg-2',
        message: 'Second message',
        sentAt: '2024-01-01T10:01:00Z',
      };

      state = chatMessageReducer(state, addMessage(secondMessage));

      expect(state.messages['swap-123']).toHaveLength(2);
    });

    it('should handle message with imageUrls', () => {
      const imageMessage: ChatMessage = {
        ...mockMessage,
        id: 'msg-img',
        message: null,
        imageUrls: ['http://example.com/img1.jpg', 'http://example.com/img2.jpg'],
      };

      const result = chatMessageReducer(initialState, addMessage(imageMessage));

      expect(result.messages['swap-123'][0].imageUrls).toEqual([
        'http://example.com/img1.jpg',
        'http://example.com/img2.jpg',
      ]);
    });
  });

  describe('clearMessages', () => {
    it('should delete messages for a specific swap request', () => {
      const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
          'swap-123': [mockMessage],
        },
      };

      const result = chatMessageReducer(stateWithMessages, clearMessages('swap-123'));

      expect(result.messages['swap-123']).toBeUndefined();
    });

    it('should not affect other conversations', () => {
      const stateWithMessages: ChatState = {
        ...initialState,
        messages: {
          'swap-123': [mockMessage],
          'swap-456': [{ ...mockMessage, id: 'msg-other', swapRequestId: 'swap-456' }],
        },
      };

      const result = chatMessageReducer(stateWithMessages, clearMessages('swap-123'));

      expect(result.messages['swap-123']).toBeUndefined();
      expect(result.messages['swap-456']).toHaveLength(1);
    });

    it('should handle clearing a non-existent conversation gracefully', () => {
      const result = chatMessageReducer(initialState, clearMessages('non-existent'));

      expect(result.messages).toEqual({});
    });
  });

  describe('setLoadingMessages', () => {
    it('should set isLoadingMessages to true', () => {
      const result = chatMessageReducer(initialState, setLoadingMessages(true));

      expect(result.isLoadingMessages).toBe(true);
    });

    it('should set isLoadingMessages to false', () => {
      const loadingState: ChatState = { ...initialState, isLoadingMessages: true };
      const result = chatMessageReducer(loadingState, setLoadingMessages(false));

      expect(result.isLoadingMessages).toBe(false);
    });
  });

  describe('setInbox', () => {
    it('should set the inbox with provided items', () => {
      const result = chatMessageReducer(initialState, setInbox([mockInboxItem]));

      expect(result.inbox).toHaveLength(1);
      expect(result.inbox[0]).toEqual(mockInboxItem);
    });

    it('should replace existing inbox', () => {
      const stateWithInbox: ChatState = {
        ...initialState,
        inbox: [mockInboxItem],
      };

      const newInboxItem: InboxItem = {
        ...mockInboxItem,
        id: 'swap-456',
        swapStatus: 'ACCEPTED',
      };

      const result = chatMessageReducer(stateWithInbox, setInbox([newInboxItem]));

      expect(result.inbox).toHaveLength(1);
      expect(result.inbox[0].id).toBe('swap-456');
    });

    it('should handle empty inbox array', () => {
      const stateWithInbox: ChatState = {
        ...initialState,
        inbox: [mockInboxItem],
      };

      const result = chatMessageReducer(stateWithInbox, setInbox([]));

      expect(result.inbox).toEqual([]);
    });

    it('should handle multiple inbox items', () => {
      const items: InboxItem[] = [
        mockInboxItem,
        { ...mockInboxItem, id: 'swap-2' },
        { ...mockInboxItem, id: 'swap-3' },
      ];

      const result = chatMessageReducer(initialState, setInbox(items));

      expect(result.inbox).toHaveLength(3);
    });
  });

  describe('updateInboxItem', () => {
    it('should update an existing inbox item in-place', () => {
      const stateWithInbox: ChatState = {
        ...initialState,
        inbox: [mockInboxItem],
      };

      const updatedItem: InboxItem = {
        ...mockInboxItem,
        swapStatus: 'ACCEPTED',
        unreadMessageCount: 0,
        isUnread: false,
      };

      const result = chatMessageReducer(stateWithInbox, updateInboxItem(updatedItem));

      expect(result.inbox).toHaveLength(1);
      expect(result.inbox[0].swapStatus).toBe('ACCEPTED');
      expect(result.inbox[0].unreadMessageCount).toBe(0);
      expect(result.inbox[0].isUnread).toBe(false);
    });

    it('should insert at the top if item does not exist', () => {
      const stateWithInbox: ChatState = {
        ...initialState,
        inbox: [{ ...mockInboxItem, id: 'swap-existing' }],
      };

      const newItem: InboxItem = {
        ...mockInboxItem,
        id: 'swap-new',
        swapStatus: 'PENDING',
      };

      const result = chatMessageReducer(stateWithInbox, updateInboxItem(newItem));

      expect(result.inbox).toHaveLength(2);
      expect(result.inbox[0].id).toBe('swap-new');
      expect(result.inbox[1].id).toBe('swap-existing');
    });

    it('should update the correct item among multiple inbox items', () => {
      const stateWithInbox: ChatState = {
        ...initialState,
        inbox: [
          { ...mockInboxItem, id: 'swap-1' },
          { ...mockInboxItem, id: 'swap-2' },
          { ...mockInboxItem, id: 'swap-3' },
        ],
      };

      const updatedItem: InboxItem = {
        ...mockInboxItem,
        id: 'swap-2',
        swapStatus: 'REJECTED',
      };

      const result = chatMessageReducer(stateWithInbox, updateInboxItem(updatedItem));

      expect(result.inbox).toHaveLength(3);
      expect(result.inbox[0].id).toBe('swap-1');
      expect(result.inbox[1].id).toBe('swap-2');
      expect(result.inbox[1].swapStatus).toBe('REJECTED');
      expect(result.inbox[2].id).toBe('swap-3');
    });

    it('should insert at front when inbox is empty', () => {
      const result = chatMessageReducer(initialState, updateInboxItem(mockInboxItem));

      expect(result.inbox).toHaveLength(1);
      expect(result.inbox[0]).toEqual(mockInboxItem);
    });
  });

  describe('setLoadingInbox', () => {
    it('should set isLoadingInbox to true', () => {
      const result = chatMessageReducer(initialState, setLoadingInbox(true));

      expect(result.isLoadingInbox).toBe(true);
    });

    it('should set isLoadingInbox to false', () => {
      const loadingState: ChatState = { ...initialState, isLoadingInbox: true };
      const result = chatMessageReducer(loadingState, setLoadingInbox(false));

      expect(result.isLoadingInbox).toBe(false);
    });
  });
});

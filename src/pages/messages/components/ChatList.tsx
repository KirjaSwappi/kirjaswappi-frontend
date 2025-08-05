import { useState } from 'react';
import { selectChat } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export default function ChatList() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);
  const [search, setSearch] = useState('');

  const filteredChats = chats.filter((chat) => {
    return chat.name.toLowerCase().includes(search.toLowerCase());
  });
  return (
    <div className="">
      <input
        type="text"
        placeholder="Search messages..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      {filteredChats.length === 0 ? (
        <p className="text-gray-500 text-sm">No chats found.</p>
      ) : (
        filteredChats.map((chat) => {
          const lastMsg = chat.messages[chat.messages.length - 1];
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => dispatch(selectChat(chat.id))}
              className={`w-full text-left p-3 rounded cursor-pointer focus:outline-none ${
                selectedChatId === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              tabIndex={0}
              aria-pressed={selectedChatId === chat.id}
            >
              <div className="flex justify-between">
                <span className="font-semibold">{chat.name}</span>
                {chat.unread && <span className="text-xs text-red-500">New</span>}
              </div>
              <p className="text-sm text-gray-600 truncate">{lastMsg?.text}</p>
            </button>
          );
        })
      )}
    </div>
  );
}

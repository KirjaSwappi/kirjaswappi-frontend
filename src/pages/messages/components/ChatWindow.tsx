import { useEffect, useState } from 'react';
import { receiveMessage, sendMessage } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);

  const findChat = chats.find((chat) => chat.id === selectedChatId);

  const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(receiveMessage({ chatId: selectedChatId, text: 'Hello, this is a reply!' }));
    }, 8000);
    return () => clearTimeout(timer);
  }, [dispatch, selectedChatId]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(sendMessage({ chatId: selectedChatId, text: input }));
    setInput('');
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <div className="flex-grow overflow-y-auto space-y-2">
        {findChat?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[60%] p-2 rounded ${
              msg.sender === 'me' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200'
            }`}
          >
            {msg.text}
            <div className="text-[10px] text-right">{msg.time}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="bg-blue-600 text-white px-4 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

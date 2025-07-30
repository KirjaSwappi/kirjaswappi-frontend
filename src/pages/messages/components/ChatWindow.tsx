import { useEffect } from 'react';
import book2 from '../../../assets/book2.png';
import book1 from '../../../assets/book3.png';
import Image from '../../../components/shared/Image';
import Input from '../../../components/shared/Input';
import { receiveMessage } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);

  const findChat = chats.find((chat) => chat.id === selectedChatId);

  // const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(receiveMessage({ chatId: selectedChatId, text: 'Hello, this is a reply!' }));
    }, 8000);
    return () => clearTimeout(timer);
  }, [dispatch, selectedChatId]);

  // const handleSend = () => {
  //   if (!input.trim()) return;
  //   dispatch(sendMessage({ chatId: selectedChatId, text: input }));
  //   setInput('');
  // };

  return (
    <div className="w-full ">
      <div
        className="h-[78vh] overflow-y-auto space-y-2 pb-10 px-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {findChat?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'them' && (
              <Image src={book1} alt="user" className="w-8 h-8 rounded-full" />
            )}
            <div
              className={`max-w-[60%] p-2 rounded ${
                msg.sender === 'me'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-black rounded-bl-none'
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-right">{msg.time}</div>
            </div>
            {msg.sender === 'me' && <Image src={book2} alt="me" className="w-8 h-8 rounded-full" />}
          </div>
        ))}
      </div>
      <div className="px-6 pb-6 bg-white">
        <Input
          className="rounded-full border border-[#E5E5E5] !bg-white "
          placeholder="Write a message..."
        />
      </div>
    </div>
  );
}

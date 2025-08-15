import { useEffect, useRef } from 'react';
import Image from '../../../components/shared/Image';
import { receiveMessage } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);

  const findChat = chats.find((chat) => chat.id === selectedChatId);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(receiveMessage({ chatId: selectedChatId, text: 'Hello, this is a reply!' }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, selectedChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [findChat?.messages]);

  return (
    <div className="w-full h-full relative">
      <div>
        {findChat?.messages.map((msg) => {
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${
                msg.sender === 'me' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex flex-col ${
                  msg.sender === 'me' ? 'items-end' : 'items-start'
                } max-w-[60%]`}
              >
                {msg.images && (
                  <div>
                    {msg.images.map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={msg.text}
                        className="rounded-xl max-w-[140px] xl:max-w-[200px] mb-0.5"
                      />
                    ))}
                  </div>
                )}
                {msg.text && (
                  <div
                    className={`inline-block font-poppins text-sm font-normal max-w-fit break-words ${
                      msg.sender === 'me'
                        ? 'bg-primary text-white rounded-xl p-3 self-end'
                        : 'bg-gray-200 text-black rounded-xl self-star'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                <div
                  className={`text-sx mt-2 ${
                    msg.sender === 'me' ? 'text-right pr-3' : 'text-left'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

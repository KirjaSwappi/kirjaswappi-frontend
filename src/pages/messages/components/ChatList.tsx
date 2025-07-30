import { selectChat } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export default function ChatList() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.chat);
  //   const selectedId = useSelector((state) => state.chat.selectedChatId);
  console.log(chats, selectedChatId);
  return (
    <div className="">
      {chats.map((chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1]?.text || '';
        return (
          <div
            key={chat.id}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                dispatch(selectChat(chat.id));
              }
            }}
            onClick={() => dispatch(selectChat(chat.id))}
            // className={`p-3 rounded cursor-pointer ${
            //   selectedId === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            // }`}
          >
            <div className="flex justify-between">
              <span className="font-semibold">{chat.name}</span>
              {chat.unread && <span className="text-xs text-red-500">New</span>}
            </div>
            <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          </div>
        );
      })}
    </div>
  );
}

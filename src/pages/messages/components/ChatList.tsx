import { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { createSearchParams, useNavigate } from 'react-router-dom';
import book from '../../../assets/book3.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import Input from '../../../components/shared/Input';
import ChatListSkeleton from '../../../components/shared/skeleton/ChatListSkeleton';
import { useGetInboxQuery } from '../../../redux/feature/messages/inboxApi';
import { selectChat, setInboxList } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { truncateText } from '../../../utility/helper';

export default function ChatList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const hasAutoSelected = useRef(false);

  const { chats, selectedChatId } = useAppSelector((state) => state.chat);
  const { userInformation } = useAppSelector((state) => state.auth);

  const {
    data: inboxData,
    isLoading,
    isSuccess,
  } = useGetInboxQuery(
    { userId: userInformation.id as string },
    { skip: !userInformation.id || (chats && chats.length > 0) },
  );

  useEffect(() => {
    if (!isSuccess || !Array.isArray(inboxData) || inboxData.length === 0) return;

    // 1️⃣ Save inbox
    dispatch(setInboxList(inboxData));

    // 2️⃣ Auto-select ONLY ONCE, AFTER DATA LOAD
    if (!hasAutoSelected.current && !selectedChatId) {
      const firstChatId = inboxData[0].id;

      hasAutoSelected.current = true;

      dispatch(selectChat(firstChatId));

      navigate(
        {
          pathname: '/user/messages',
          search: `?${createSearchParams({ messageId: firstChatId })}`,
        },
        { replace: true },
      );
    }
  }, [isSuccess, inboxData, dispatch, navigate, selectedChatId]);

  if (isLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChatListSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4">
        <div className="relative h-[40px]">
          <IoIosSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 rounded-full h-[40px]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.map((chat) => {
          // const lastMsg = chat.messages.at(-1);
          return (
            <Button
              key={chat.id}
              onClick={() => {
                dispatch(selectChat(chat.id));
                navigate({
                  pathname: '/user/messages',
                  search: `?${createSearchParams({ messageId: chat.id })}`,
                });
              }}
              className="w-full flex gap-4 p-3 text-left hover:bg-AntiFlashWhite"
            >
              <Image src={book} className="w-14 h-14 rounded-full" />
              <div className="flex-1">
                <p className="font-medium">{truncateText(chat.name, 12)}</p>
                {/* <p className="text-xs text-grayDark">{truncateText(lastMsg?.text || '', 25)}</p> */}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

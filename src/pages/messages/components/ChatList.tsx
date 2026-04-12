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
    isError,
  } = useGetInboxQuery(undefined, {
    skip: !userInformation.id,
    refetchOnMountOrArgChange: 30,
  });

  useEffect(() => {
    if (!isSuccess || !Array.isArray(inboxData) || inboxData.length === 0) return;

    dispatch(setInboxList(inboxData));

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

  const filteredChats = chats.filter((chat) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      chat.name.toLowerCase().includes(searchLower) ||
      chat.senderName?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChatListSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <p className="text-red-500 font-medium">Failed to load conversations</p>
        <p className="text-xs text-gray-400 mt-1">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 mb-4">
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
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a swap request to begin chatting</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const hasUnread = chat.unread || (chat.unreadMessageCount ?? 0) > 0;

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
                className={`w-full flex gap-4 p-3 text-left hover:bg-AntiFlashWhite transition-colors ${
                  selectedChatId === chat.id ? 'bg-AntiFlashWhite' : ''
                }`}
              >
                <div className="relative">
                  <Image
                    src={chat.bookToSwapWith?.coverPhotoUrl || book}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {hasUnread && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {chat.unreadMessageCount && chat.unreadMessageCount > 0
                          ? chat.unreadMessageCount > 9
                            ? '9+'
                            : chat.unreadMessageCount
                          : ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-medium truncate ${hasUnread ? 'font-semibold' : ''}`}>
                      {truncateText(chat.name, 20)}
                    </p>
                    {lastMsg && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(lastMsg.time).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  {chat.senderName && (
                    <p className="text-xs text-gray-500 truncate">{chat.senderName}</p>
                  )}
                  {lastMsg && (
                    <p
                      className={`text-xs text-grayDark truncate mt-0.5 ${
                        hasUnread ? 'font-medium' : ''
                      }`}
                    >
                      {lastMsg.images && lastMsg.images.length > 0
                        ? '📷 Image'
                        : truncateText(lastMsg.text || '', 30)}
                    </p>
                  )}
                </div>
              </Button>
            );
          })
        )}
      </div>
    </div>
  );
}

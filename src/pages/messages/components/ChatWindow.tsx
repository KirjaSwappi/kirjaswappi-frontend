import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoChatbubblesOutline } from 'react-icons/io5';
import Image from '../../../components/shared/Image';
import {
  useGetChatMessagesQuery,
  useMarkChatAsReadMutation,
} from '../../../redux/feature/messages/inboxApi';
import { addChatMessages, markChatRead } from '../../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export default function ChatWindow() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialScroll = useRef(true);
  const scrollRafId = useRef<number>();
  const { selectedChatId, chats } = useAppSelector((state) => state.chat);
  const { userInformation } = useAppSelector((state) => state.auth);

  const findChat = chats.find((chat) => chat.id === selectedChatId);

  const [markAsRead] = useMarkChatAsReadMutation();

  const {
    currentData: chatData,
    isLoading: isChatLoading,
    isSuccess: isChatSuccess,
  } = useGetChatMessagesQuery(
    { swapRequestId: selectedChatId as string },
    { skip: !selectedChatId || !userInformation.id },
  );

  useEffect(() => {
    if (!selectedChatId || !isChatSuccess || !Array.isArray(chatData)) return;

    const mapped = chatData.map((m) => ({
      id: m.id,
      sender: m.ownMessage ? ('me' as const) : ('them' as const),
      text: m.message ?? '',
      time: m.sentAt,
      images: m.imageUrls ?? undefined,
    }));

    dispatch(addChatMessages({ chatId: selectedChatId, messages: mapped }));
    dispatch(markChatRead(selectedChatId));
    markAsRead({ swapRequestId: selectedChatId });
  }, [dispatch, selectedChatId, chatData, isChatSuccess, markAsRead]);

  useEffect(() => {
    if (!findChat?.messages?.length) return;
    scrollRafId.current = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: isInitialScroll.current ? 'instant' : 'smooth',
      });
      isInitialScroll.current = false;
    });
    return () => {
      if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
    };
  }, [findChat?.messages]);

  useEffect(() => {
    isInitialScroll.current = true;
  }, [selectedChatId]);

  if (!selectedChatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <IoChatbubblesOutline className="text-grayDark text-4xl mb-3" />
        <p className="text-gray-500 font-poppins text-sm">{t('chat.selectChat')}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div>
        {isChatLoading ? (
          <div className="p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
            ))}
          </div>
        ) : (
          <>
            {(findChat?.messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 mb-4 ${
                  msg.sender === 'me' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  } max-w-[60%]`}
                >
                  {msg.images && msg.images.length > 0 && (
                    <div className="mb-1">
                      {msg.images.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          alt={msg.text || 'Image'}
                          className="rounded-xl max-w-[140px] xl:max-w-[200px] mb-0.5"
                        />
                      ))}
                    </div>
                  )}
                  {msg.text && (
                    <div
                      className={`inline-block font-poppins text-sm font-normal max-w-fit break-words p-3 rounded-xl ${
                        msg.sender === 'me' ? 'bg-primary text-white' : 'bg-gray-200 text-black'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                  <div
                    className={`text-xs mt-1 text-gray-500 ${
                      msg.sender === 'me' ? 'text-right pr-1' : 'text-left pl-1'
                    }`}
                  >
                    {new Date(msg.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

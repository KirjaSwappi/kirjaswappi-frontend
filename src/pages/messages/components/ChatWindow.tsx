import { useRef } from 'react';
import { useGetChatMessagesQuery } from '../../../redux/feature/messages/inboxApi';
import { useAppSelector } from '../../../redux/hooks';
export default function ChatWindow() {
  // const dispatch = useAppDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { selectedChatId } = useAppSelector((state) => state.chat);

  // const findChat = chats.find((chat) => chat.id === selectedChatId);
  const { userInformation } = useAppSelector((state) => state.auth);
  // const hasPlaceholderMessage = Boolean(
  //   findChat &&
  //   Array.isArray(findChat.messages) &&
  //   findChat.messages.length === 1 &&
  //   findChat.messages[0].id === findChat.id,
  // );

  // const shouldFetchChat = Boolean(
  //   selectedChatId &&
  //   userInformation.id &&
  //   (findChat?.messages.length === 0 || hasPlaceholderMessage),
  // );

  const {
    data: chatData,
    isLoading: isChatLoading,
    // isSuccess: isChatSuccess,
  } = useGetChatMessagesQuery(
    { swapRequestId: selectedChatId as string, userId: userInformation.id as string },
    // { skip: !shouldFetchChat },
  );
  console.log(chatData);
  // No dummy replies. When we load chat messages from API, merge into store.
  // useEffect(() => {
  //   if (!selectedChatId) return;

  //   if (isChatSuccess && Array.isArray(chatData)) {
  //     const mapped = chatData.map((m: ChatMessageApi) => ({
  //       id: m.id,
  //       sender: m.ownMessage ? ('me' as const) : ('them' as const),
  //       text: m.message ?? '',
  //       time: m.sentAt,
  //       images: m.imageUrls ?? undefined,
  //     }));

  //     dispatch(addChatMessages({ chatId: selectedChatId, messages: mapped }));
  //   }
  // }, [dispatch, selectedChatId, chatData, isChatSuccess]);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [findChat?.messages]);

  return (
    <div className="w-full h-full relative">
      <div>
        {selectedChatId && isChatLoading ? (
          <div className="p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
            ))}
          </div>
        ) : (
          <>
            {/* {(findChat?.messages || []).map((msg) => (
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
                          : 'bg-gray-200 text-black rounded-xl self-start'
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
            ))} */}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

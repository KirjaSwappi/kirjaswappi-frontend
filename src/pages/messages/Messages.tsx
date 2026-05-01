import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PageTitle from '../../components/shared/PageTitle';
import { useChatWS } from '../../hooks/useChatWS';
import { selectChat } from '../../redux/feature/messages/messagesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ChatInboxInput from './components/ChatInboxInput';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import ChatWindowTopBar from './components/ChatWindowTopBar';
import UserProfile from './components/UserProfile';

export default function Messages() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [bookOpen, setBookOpen] = useState(true);
  const { selectedChatId } = useAppSelector((state) => state.chat);
  const userId = useAppSelector((state) => state.auth.userInformation.id);
  const { isConnected: chatConnected } = useChatWS();
  const [searchParams] = useSearchParams();
  const messageId = searchParams.get('messageId');

  useEffect(() => {
    if (messageId) {
      dispatch(selectChat(messageId));
    }
  }, [messageId, dispatch]);

  // Show a connection banner only for logged-in users so the banner doesn't
  // flash for visitors who never establish a chat session.
  const showOfflineBanner = Boolean(userId) && !chatConnected;

  return (
    <div className="lg:container flex gap-3 lg:gap-5 lg:mt-3 xl:mt-6">
      <PageTitle title={t('messages.title')} />
      {showOfflineBanner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 bg-yellow-100 text-yellow-900 border border-yellow-300 rounded-md px-3 py-1.5 text-xs font-poppins shadow"
        >
          {t('chat.offlineBanner', "You're offline — new messages may be delayed")}
        </div>
      )}
      <aside
        className={`h-[calc(100dvh-134px)] lg:h-[85vh] xl:h-[82vh] custom-scrollbar overflow-hidden w-full lg:w-[40%] xl:w-[25%] lg:bg-white rounded-xl py-5 xl:py-[30px] ${
          selectedChatId || messageId ? 'hidden' : 'block'
        } lg:block`}
        style={{ scrollbarWidth: 'none' }}
      >
        <ChatList />
      </aside>

      <main
        className={`h-[calc(100dvh-64px)] lg:h-[85vh] xl:h-[82vh] w-full lg:w-[60%] xl:w-[50%] lg:bg-white lg:rounded-xl overflow-hidden ${
          selectedChatId || messageId ? 'block' : 'hidden'
        } lg:block relative`}
      >
        <div className="absolute w-full z-20 left-0 top-0">
          <ChatWindowTopBar bookOpen={bookOpen} setBookOpen={setBookOpen} />
        </div>

        <div
          className={`overflow-y-auto custom-scrollbar h-[86%] px-4 ${
            !bookOpen ? 'pt-[170px] xl:pt-[186px]' : 'pt-[270px] xl:pt-[286px]'
          } pb-40`}
        >
          <ChatWindow />
        </div>

        <div className="absolute w-full bottom-0">
          <ChatInboxInput />
        </div>
      </main>

      <aside
        className="h-screen lg:h-[85vh] xl:h-[82vh] hidden xl:block xl:w-[25%] rounded-xl overflow-hidden overflow-y-auto custom-scrollbar lg:bg-white"
        style={{ scrollbarWidth: 'none' }}
      >
        <UserProfile />
      </aside>
    </div>
  );
}

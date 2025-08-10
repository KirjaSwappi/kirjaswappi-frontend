import { useAppSelector } from '../../redux/hooks';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import UserProfile from './components/UserProfile';

export default function Messages() {
  const { selectedChatId } = useAppSelector((state) => state.chat);
  return (
    <div className="container flex gap-3 lg:gap-5 xl:mt-6">
      <aside
        className={`w-full lg:w-[40%] xl:w-[25%] lg:bg-white rounded-xl py-5 xl:py-[30px] ${selectedChatId ? 'hidden' : 'block'} lg:block`}
      >
        <ChatList />
      </aside>
      <main
        className={`w-full lg:w-[60%] xl:w-[50%] lg:bg-white rounded-xl overflow-hidden ${selectedChatId ? 'block' : 'hidden'} lg:block`}
      >
        <ChatWindow />
      </main>
      <aside className="hidden xl:block xl:w-[25%] rounded-xl overflow-hidden">
        <UserProfile />
      </aside>
    </div>
  );
}

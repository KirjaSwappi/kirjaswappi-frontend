import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import UserProfile from './components/UserProfile';

export default function Messages() {
  return (
    <div className="container flex gap-5 mt-6">
      <aside className="w-[25%] max-w-[25%]  bg-white rounded-xl py-[30px]">
        <ChatList />
      </aside>
      <main className="w-[50%] bg-white rounded-xl overflow-hidden">
        <ChatWindow />
      </main>
      <aside className="w-[25%] rounded-xl overflow-hidden">
        <UserProfile />
      </aside>
    </div>
  );
}

import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

export default function Messages() {
  return (
    <div className="container flex gap-5 mt-6">
      <aside className="w-[25%] bg-white rounded-xl px-6 py-[30px]">
        <ChatList />
      </aside>
      <main className="w-[50%] bg-white rounded-xl">
        <ChatWindow />
      </main>
      <aside className="w-[25%] bg-gray-50">{/* <UserProfile /> */}</aside>
    </div>
  );
}

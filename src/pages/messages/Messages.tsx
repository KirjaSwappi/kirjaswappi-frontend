import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

export default function Messages() {
  return (
    <div className="container flex gap-5">
      <aside className="w-[25%] border-r overflow-y-auto bg-white">
        <ChatList />
      </aside>
      <main className="w-[50%] flex flex-col border-r bg-white">
        <ChatWindow />
      </main>
      <aside className="w-[25%] bg-gray-50">{/* <UserProfile /> */}</aside>
    </div>
  );
}

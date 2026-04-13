import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoginModal from '../components/shared/LoginModal/LoginModal';
import SwapModal from '../components/shared/SwapRequestModal/SwapRequestModal';
import { useNotificationWS } from '../hooks/useNotificationWS';
import { useChatWS } from '../hooks/useChatWS';

export default function Layout() {
  // Initialize notification WebSocket connection
  useNotificationWS();
  // Initialize chat WebSocket connection
  useChatWS();

  return (
    <div className="bg-light min-h-screen overflow-auto ">
      <Header />
      <main>
        <LoginModal />
        <SwapModal />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

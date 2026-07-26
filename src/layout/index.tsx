import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoginModal from '../components/shared/LoginModal/LoginModal';
import SwapModal from '../components/shared/SwapRequestModal/SwapRequestModal';
import { ChatWSProvider } from '../contexts/ChatWSContext';
import { useNotificationWS } from '../hooks/useNotificationWS';

export default function Layout() {
  // Initialize notification WebSocket connection
  useNotificationWS();

  return (
    <ChatWSProvider>
      <div className="bg-light min-h-screen overflow-auto flex flex-col">
        <Header />
        <main className="flex-1">
          <LoginModal />
          <SwapModal />
          <Outlet />
        </main>
        <Footer />
      </div>
    </ChatWSProvider>
  );
}

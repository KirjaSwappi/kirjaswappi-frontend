import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SwapModal from '../components/shared/SwapRequestModal/SwapRequestModal';
export default function Layout() {
  return (
    <div className="bg-light ">
      <Header />
      <main>
        <SwapModal />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

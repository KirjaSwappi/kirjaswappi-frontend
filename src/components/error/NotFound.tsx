import React from 'react';
import { IoMdHome } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

interface NotFoundProps {
  title?: string;
  message?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = '404',
  message = "Sorry, the page you're looking for doesn't exist or has been moved.",
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Header showOn404={true} />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 font-poppins lg:pt-32">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
          {title}
        </h1>

        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-10 text-base md:text-lg lg:text-xl leading-relaxed text-center max-w-xl">
          {message}
        </p>

        <button
          onClick={() => navigate('/')}
          className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-medium text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <IoMdHome className="w-6 h-6 group-hover:scale-110 transition-transform duration-200 relative z-10" />
          <span className="relative z-10">Take Me Home</span>
          <div className="absolute inset-0 rounded-2xl bg-white/20"></div>
        </button>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;

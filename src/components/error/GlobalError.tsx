import React from 'react';
import { IoMdHome } from 'react-icons/io';
import { IoRefresh } from 'react-icons/io5';
import { BiSolidError } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface GlobalErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const GlobalError: React.FC<GlobalErrorProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again later.',
  onRetry,
  showRetry = true,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen px-4 font-poppins">
      <div className="p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <BiSolidError className="text-red-500 w-20 h-20" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 text-sm md:text-base">{message}</p>

        <div className="flex flex-col lg:flex-row gap-3 justify-center">
          {showRetry && (
            <button
              onClick={onRetry || (() => window.location.reload())}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full lg:w-auto font-medium"
            >
              <IoRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              Try Again
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center justify-center gap-2 bg-slate-200 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-200 hover:shadow-xl w-full lg:w-auto font-medium hover:border-gray-300"
          >
            <IoMdHome className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;

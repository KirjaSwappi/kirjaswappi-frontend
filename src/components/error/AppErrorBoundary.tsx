import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import GlobalError from './GlobalError';
import NoInternetConnection from './NoInternetConnection';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <NoInternetConnection>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <GlobalError
            title="Something went wrong"
            message={error.message || 'An unexpected error occurred'}
            onRetry={resetErrorBoundary}
          />
        )}
        onReset={() => navigate('/')}
      >
        {children}
      </ErrorBoundary>
    </NoInternetConnection>
  );
};

export default AppErrorBoundary;

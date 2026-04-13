import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className}>{children}</div>
    ),
    h3: ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className={className}>{children}</h3>
    ),
    p: ({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className}>{children}</p>
    ),
  },
}));

vi.mock('lottie-react', () => ({
  default: () => <div data-testid="lottie">animation</div>,
}));

vi.mock('../../../assets/LoadingPaperplane.json', () => ({ default: {} }));
vi.mock('../../../assets/CompleteSuccessfully.json', () => ({ default: {} }));
vi.mock('../../../assets/FailedAnimation.json', () => ({ default: {} }));

import RequestProcessingAnimation from '../../../components/shared/SwapRequestModal/_components/RequestProcessingAnimation';
import RequestSuccessAnimation from '../../../components/shared/SwapRequestModal/_components/RequestSuccessAnimation';
import RequestFailedAnimation from '../../../components/shared/SwapRequestModal/_components/RequestErrorAnimation';

describe('RequestProcessingAnimation', () => {
  it('renders when isLoading is true', () => {
    render(<RequestProcessingAnimation isLoading={true} />);
    expect(screen.getByText('Request Sending...')).toBeInTheDocument();
  });

  it('does not render when isLoading is false', () => {
    render(<RequestProcessingAnimation isLoading={false} />);
    expect(screen.queryByText('Request Sending...')).not.toBeInTheDocument();
  });
});

describe('RequestSuccessAnimation', () => {
  it('renders success text when isSuccess is true', () => {
    render(<RequestSuccessAnimation isSuccess={true} />);
    expect(screen.getByText('Successfully Swap Sent')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your swap')).toBeInTheDocument();
  });

  it('is hidden when isSuccess is false', () => {
    const { container } = render(<RequestSuccessAnimation isSuccess={false} />);
    expect(container.firstChild).toHaveClass('hidden');
  });
});

describe('RequestFailedAnimation', () => {
  const createStore = (errorMessage = '') =>
    configureStore({
      reducer: {
        swapBook: (state = { errorMessage }) => state,
      },
    });

  it('renders error message when isFailed is true', () => {
    render(
      <Provider store={createStore('Already swapped')}>
        <RequestFailedAnimation isFailed={true} />
      </Provider>,
    );
    expect(screen.getByText('Already swapped')).toBeInTheDocument();
  });

  it('renders default text when no error message', () => {
    render(
      <Provider store={createStore('')}>
        <RequestFailedAnimation isFailed={true} />
      </Provider>,
    );
    expect(screen.getByText('Swap Failed')).toBeInTheDocument();
  });

  it('is hidden when isFailed is false', () => {
    const { container } = render(
      <Provider store={createStore()}>
        <RequestFailedAnimation isFailed={false} />
      </Provider>,
    );
    expect(container.firstChild).toHaveClass('hidden');
  });
});

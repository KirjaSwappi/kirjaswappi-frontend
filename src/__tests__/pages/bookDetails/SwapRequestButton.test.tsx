import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SwapRequestButton from '../../../pages/bookDetails/_components/SwapRequestButton';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe('SwapRequestButton', () => {
  it('renders owner name and Request Swap button', () => {
    render(<SwapRequestButton ownerName="John" onClick={vi.fn()} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('bookDetails.requestSwap')).toBeInTheDocument();
  });

  it('renders Offered by label', () => {
    render(<SwapRequestButton ownerName="Alice" onClick={vi.fn()} />);
    expect(screen.getByText('offeredBy')).toBeInTheDocument();
  });

  it('calls onClick when Request Swap is clicked', () => {
    const handleClick = vi.fn();
    render(<SwapRequestButton ownerName="Bob" onClick={handleClick} />);

    fireEvent.click(screen.getByText('bookDetails.requestSwap'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('displays the correct owner name', () => {
    render(<SwapRequestButton ownerName="Charlie Brown" onClick={vi.fn()} />);
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
  });
});

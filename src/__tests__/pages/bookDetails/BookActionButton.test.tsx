import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookActionButton from '../../../pages/bookDetails/_components/BookActionButton';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
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

describe('BookActionButton', () => {
  it('renders the button with provided value', () => {
    render(<BookActionButton onClick={vi.fn()} btnValue="Request Swap" />);
    expect(screen.getByText('Request Swap')).toBeInTheDocument();
  });

  it('calls onClick when the main button is clicked', () => {
    const handleClick = vi.fn();
    render(<BookActionButton onClick={handleClick} btnValue="Swap" />);

    fireEvent.click(screen.getByText('Swap'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders share and favorite buttons', () => {
    render(<BookActionButton onClick={vi.fn()} btnValue="Swap" />);

    expect(screen.getAllByAltText('shareIcon')).toHaveLength(2);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('renders with different button values', () => {
    render(<BookActionButton onClick={vi.fn()} btnValue="Edit Book" />);
    expect(screen.getByText('Edit Book')).toBeInTheDocument();
  });
});

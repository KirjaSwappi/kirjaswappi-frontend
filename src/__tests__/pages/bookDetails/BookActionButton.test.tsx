import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookActionButton from '../../../pages/bookDetails/_components/BookActionButton';

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

const defaultProps = {
  onClick: vi.fn(),
  btnValue: 'Swap',
  onShare: vi.fn(),
  onBookmark: vi.fn(),
  isBookmarked: false,
  isOwner: false,
};

describe('BookActionButton', () => {
  it('renders the button with provided value', () => {
    render(<BookActionButton {...defaultProps} btnValue="Request Swap" />);
    expect(screen.getByText('Request Swap')).toBeInTheDocument();
  });

  it('calls onClick when the main button is clicked', () => {
    const handleClick = vi.fn();
    render(<BookActionButton {...defaultProps} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Swap'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders share and bookmark buttons for non-owners', () => {
    render(<BookActionButton {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('calls onShare when share button is clicked', () => {
    const handleShare = vi.fn();
    render(<BookActionButton {...defaultProps} onShare={handleShare} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(handleShare).toHaveBeenCalledTimes(1);
  });

  it('calls onBookmark when bookmark button is clicked', () => {
    const handleBookmark = vi.fn();
    render(<BookActionButton {...defaultProps} onBookmark={handleBookmark} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(handleBookmark).toHaveBeenCalledTimes(1);
  });

  it('hides bookmark button when user is the owner', () => {
    render(<BookActionButton {...defaultProps} isOwner={true} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders with different button values', () => {
    render(<BookActionButton {...defaultProps} btnValue="Edit Book" />);
    expect(screen.getByText('Edit Book')).toBeInTheDocument();
  });
});

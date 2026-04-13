import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteBookModal from '../../../components/shared/DeleteBookModal';

describe('DeleteBookModal', () => {
  const defaultProps = {
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    header: 'Delete Book',
    description: 'Are you sure you want to delete this book?',
  };

  it('renders header and description', () => {
    render(<DeleteBookModal {...defaultProps} />);
    expect(screen.getByText('Delete Book')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this book?')).toBeInTheDocument();
  });

  it('renders Yes and No buttons', () => {
    render(<DeleteBookModal {...defaultProps} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onConfirm when Yes is clicked', () => {
    const onConfirm = vi.fn();
    render(<DeleteBookModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when No is clicked', () => {
    const onCancel = vi.fn();
    render(<DeleteBookModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('No'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('renders as a fixed overlay', () => {
    const { container } = render(<DeleteBookModal {...defaultProps} />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
  });
});

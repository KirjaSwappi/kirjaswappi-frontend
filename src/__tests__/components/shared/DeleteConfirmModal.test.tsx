import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmModal from '../../../components/shared/DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  const mockOnClose = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    const { container } = render(
      <DeleteConfirmModal open={false} onClose={mockOnClose} onDelete={mockOnDelete} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when open is true', () => {
    render(<DeleteConfirmModal open={true} onClose={mockOnClose} onDelete={mockOnDelete} />);
    expect(screen.getByText('Are You Sure?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this book')).toBeInTheDocument();
  });

  it('renders custom title and message', () => {
    render(
      <DeleteConfirmModal
        open={true}
        title="Custom Title"
        message="Custom message"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('renders custom button labels', () => {
    render(
      <DeleteConfirmModal
        open={true}
        deleteLabel="Remove"
        cancelLabel="Dismiss"
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<DeleteConfirmModal open={true} onClose={mockOnClose} onDelete={mockOnDelete} />);
    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteConfirmModal open={true} onClose={mockOnClose} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<DeleteConfirmModal open={true} onClose={mockOnClose} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <DeleteConfirmModal
        open={true}
        isLoading={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(
      <DeleteConfirmModal
        open={true}
        isLoading={true}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />,
    );
    const cancelBtn = screen.getByText('Cancel').closest('button');
    const deleteBtn = screen.getByText('Deleting...').closest('button');
    expect(cancelBtn).toBeDisabled();
    expect(deleteBtn).toBeDisabled();
  });
});

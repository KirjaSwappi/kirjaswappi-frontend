import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmModal from '../../../components/shared/DeleteConfirmModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

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
    expect(screen.getByText('chat.areYouSure')).toBeInTheDocument();
    expect(screen.getByText('deleteConfirm.defaultMessage')).toBeInTheDocument();
    expect(screen.getByText('delete')).toBeInTheDocument();
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
    const closeBtn = screen.getByLabelText('close');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteConfirmModal open={true} onClose={mockOnClose} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText('cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<DeleteConfirmModal open={true} onClose={mockOnClose} onDelete={mockOnDelete} />);
    fireEvent.click(screen.getByText('delete'));
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
    expect(screen.getByText('common.deleting')).toBeInTheDocument();
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
    const cancelBtn = screen.getByText('cancel').closest('button');
    const deleteBtn = screen.getByText('common.deleting').closest('button');
    expect(cancelBtn).toBeDisabled();
    expect(deleteBtn).toBeDisabled();
  });
});

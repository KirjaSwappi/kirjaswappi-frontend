import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import ConfirmModal from '../../../pages/messages/components/ConfirmModal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ConfirmModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when open is false', () => {
    const { container } = renderWithProviders(
      <ConfirmModal
        open={false}
        header="Test"
        description="Are you sure?"
        btnValue="Confirm"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders modal when open is true', () => {
    renderWithProviders(
      <ConfirmModal
        open={true}
        header="Are You Sure?"
        description="This action cannot be undone"
        btnValue="Delete"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    expect(screen.getByText('Are You Sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    renderWithProviders(
      <ConfirmModal
        open={true}
        header="Test"
        description="Are you sure?"
        btnValue="Confirm"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.click(screen.getByText('cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when action button is clicked', () => {
    renderWithProviders(
      <ConfirmModal
        open={true}
        header="Test"
        description="Are you sure?"
        btnValue="Confirm"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    renderWithProviders(
      <ConfirmModal
        open={true}
        header="Test"
        description="Are you sure?"
        btnValue="Confirm"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA attributes', () => {
    renderWithProviders(
      <ConfirmModal
        open={true}
        header="Confirm Action"
        description="Are you sure?"
        btnValue="OK"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});

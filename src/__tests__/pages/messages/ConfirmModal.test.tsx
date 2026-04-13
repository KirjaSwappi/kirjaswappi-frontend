import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/io5', () => ({
  IoCloseOutline: () => <span>X</span>,
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

import ConfirmModal from '../../../pages/messages/components/ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    open: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    header: 'Delete Chat',
    description: 'Are you sure you want to delete this chat?',
  };

  it('renders header and description when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete Chat')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this chat?')).toBeInTheDocument();
  });

  it('renders nothing when not open', () => {
    const { container } = render(<ConfirmModal {...defaultProps} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders default "Yes" button value', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders custom button value', () => {
    render(<ConfirmModal {...defaultProps} btnValue="Confirm" />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });

  it('calls onConfirm when Yes button clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('calls onCancel on Escape key', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('has dialog role', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

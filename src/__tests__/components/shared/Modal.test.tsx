import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../../components/shared/Modal';

describe('Modal Component', () => {
  it('renders children when open is true', () => {
    render(
      <Modal open={true}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>,
    );

    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('hides when open is false', () => {
    render(
      <Modal open={false}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveClass('hidden');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not call onClose on Escape when closed', () => {
    const onClose = vi.fn();
    render(
      <Modal open={false} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <Modal open={true}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('focuses the modal when opened', () => {
    render(
      <Modal open={true}>
        <p>Content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
  });

  it('applies correct CSS classes when open', () => {
    render(
      <Modal open={true}>
        <div>Content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('block');
    expect(dialog).toHaveClass('fixed', 'z-50', 'shadow-md');
  });

  it('handles boolean open prop correctly via rerender', () => {
    const { rerender } = render(
      <Modal open={true}>
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toHaveClass('block');

    rerender(
      <Modal open={false}>
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByRole('dialog', { hidden: true })).toHaveClass('hidden');
  });
});

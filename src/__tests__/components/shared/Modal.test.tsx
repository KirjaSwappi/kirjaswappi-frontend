import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('does not render children when open is false', () => {
    render(
      <Modal open={false}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>,
    );

    expect(screen.getByTestId('modal-content').parentElement).toHaveClass('hidden');
    expect(screen.getByText('Modal Content').parentElement).toHaveClass('hidden');
  });

  it('applies correct CSS classes when open', () => {
    render(
      <Modal open={true}>
        <div>Content</div>
      </Modal>,
    );

    const modalDiv = screen.getByText('Content').parentElement;
    expect(modalDiv).toHaveClass('block');
    expect(modalDiv).toHaveClass('bg-white', 'bg-opacity-100');
    expect(modalDiv).toHaveClass('inset-0', 'w-10/12', 'h-[80%]');
    expect(modalDiv).toHaveClass('fixed', 'top-1/2', 'left-1/2');
    expect(modalDiv).toHaveClass('transform', '-translate-x-1/2', '-translate-y-1/2');
    expect(modalDiv).toHaveClass('z-50', 'shadow-md');
  });

  it('applies hidden class when closed', () => {
    render(
      <Modal open={false}>
        <div>Content</div>
      </Modal>,
    );

    // Since the modal is hidden, we need to find it differently
    // The modal div should still exist but be hidden
    const modalDiv = document.querySelector('.hidden');
    expect(modalDiv).toBeInTheDocument();
    expect(modalDiv).toHaveClass('hidden');
  });

  it('renders complex children correctly', () => {
    render(
      <Modal open={true}>
        <div>
          <h2>Modal Title</h2>
          <p>Modal description</p>
          <button>Close</button>
        </div>
      </Modal>,
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Modal open={true}>{null}</Modal>);

    const modalDiv = document.querySelector('.block');
    expect(modalDiv).toBeInTheDocument();
    expect(modalDiv).toBeEmptyDOMElement();
  });

  it('maintains modal structure', () => {
    render(
      <Modal open={true}>
        <div>Test</div>
      </Modal>,
    );

    const modalDiv = screen.getByText('Test').parentElement;
    expect(modalDiv?.tagName).toBe('DIV');
    expect(modalDiv).toHaveClass('fixed'); // Ensures it's positioned as a modal
  });

  it('handles boolean open prop correctly', () => {
    const { rerender } = render(
      <Modal open={true}>
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByText('Content').parentElement).toHaveClass('block');

    rerender(
      <Modal open={false}>
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByText('Content').parentElement).toHaveClass('hidden');
  });
});

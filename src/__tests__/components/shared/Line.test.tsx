import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Line from '../../../components/shared/Line';

describe('Line', () => {
  it('renders a horizontal line element', () => {
    const { container } = render(<Line />);
    const line = container.firstChild as HTMLElement;
    expect(line).toBeInTheDocument();
    expect(line.tagName).toBe('DIV');
  });

  it('has default styling classes', () => {
    const { container } = render(<Line />);
    const line = container.firstChild as HTMLElement;
    expect(line).toHaveClass('w-full', 'h-[1px]', 'bg-gray');
  });

  it('merges custom className with defaults', () => {
    const { container } = render(<Line className="mt-4" />);
    const line = container.firstChild as HTMLElement;
    expect(line).toHaveClass('mt-4');
    expect(line).toHaveClass('w-full');
  });
});

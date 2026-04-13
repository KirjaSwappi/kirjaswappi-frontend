import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Separator from '../../../components/shared/Separator';

describe('Separator', () => {
  it('renders a span element', () => {
    const { container } = render(<Separator />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toBeInTheDocument();
    expect(sep.tagName).toBe('SPAN');
  });

  it('has default styling classes', () => {
    const { container } = render(<Separator />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toHaveClass('w-full', 'h-[1px]', 'bg-platinumDark', 'block', 'my-4');
  });

  it('merges custom className with defaults', () => {
    const { container } = render(<Separator className="my-8" />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toHaveClass('w-full');
  });
});

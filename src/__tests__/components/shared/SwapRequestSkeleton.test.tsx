import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SwapRequestSkeleton from '../../../components/shared/SwapRequestModal/_components/SwapRequestSkeleton';

describe('SwapRequestSkeleton', () => {
  it('renders the skeleton overlay', () => {
    const { container } = render(<SwapRequestSkeleton />);

    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('fixed', 'inset-0');
  });

  it('renders with pulse animation', () => {
    const { container } = render(<SwapRequestSkeleton />);

    const animatedDiv = container.querySelector('.animate-pulse');
    expect(animatedDiv).toBeInTheDocument();
  });

  it('renders skeleton placeholder elements', () => {
    const { container } = render(<SwapRequestSkeleton />);

    const placeholders = container.querySelectorAll('.bg-platinum');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('has proper z-index for overlay', () => {
    const { container } = render(<SwapRequestSkeleton />);

    const overlay = container.firstChild as HTMLElement;
    expect(overlay.className).toContain('z-[999999999]');
  });
});

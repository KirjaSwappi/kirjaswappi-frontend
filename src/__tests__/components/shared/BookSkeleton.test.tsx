import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BookSkeleton from '../../../components/shared/skeleton/BookSkeleton';

describe('BookSkeleton', () => {
  it('renders skeleton placeholder elements', () => {
    const { container } = render(<BookSkeleton />);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThanOrEqual(4);
  });

  it('renders with correct height classes', () => {
    const { container } = render(<BookSkeleton />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('h-[156px]');
    expect(wrapper).toHaveClass('lg:h-[214px]');
  });
});

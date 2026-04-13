import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import UserProfileSkeleton from '../../../components/Header/_components/UserProfileSkeleton';

describe('UserProfileSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<UserProfileSkeleton />);
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBeGreaterThanOrEqual(1);
  });
});

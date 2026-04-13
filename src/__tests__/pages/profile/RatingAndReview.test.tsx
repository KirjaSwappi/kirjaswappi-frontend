import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../assets/review.svg', () => ({ default: 'review.svg' }));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import RatingAndReview from '../../../pages/profile/components/RatingAndReview';
import TabsSkeleton from '../../../pages/profile/components/Skeletons/TabsSkeleton';

describe('RatingAndReview', () => {
  it('renders no reviews message', () => {
    render(<RatingAndReview />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('renders review image', () => {
    render(<RatingAndReview />);
    expect(screen.getByAltText('review')).toBeInTheDocument();
  });
});

describe('TabsSkeleton', () => {
  it('renders skeleton elements', () => {
    const { container } = render(<TabsSkeleton />);
    const pulses = container.querySelectorAll('.animate-pulse');
    expect(pulses.length).toBe(3);
  });
});

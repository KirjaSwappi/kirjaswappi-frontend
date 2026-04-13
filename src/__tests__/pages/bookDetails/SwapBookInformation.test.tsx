import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import SwapBookInformation from '../../../pages/bookDetails/_components/SwapBookInformation';

describe('SwapBookInformation', () => {
  const props = {
    coverPhotoUrl: 'cover.jpg',
    title: 'Test Book',
    author: 'Test Author',
    genres: ['Fantasy', 'Sci-Fi'],
    condition: 'New',
  };

  it('renders title and author', () => {
    render(<SwapBookInformation {...props} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
  });

  it('renders genres', () => {
    render(<SwapBookInformation {...props} />);
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
  });

  it('renders condition', () => {
    render(<SwapBookInformation {...props} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders cover image', () => {
    render(<SwapBookInformation {...props} />);
    expect(screen.getByAltText('Test Book')).toBeInTheDocument();
  });
});

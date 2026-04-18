import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../pages/map/types/interface', () => ({}));

import BookPopup from '../../../pages/map/_components/BookPopup';

describe('BookPopup', () => {
  const books = [
    {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      coverPhotoUrl: 'cover.jpg',
      createdAt: '2024-01-01',
      latitude: 60,
      longitude: 24,
    },
  ];

  it('renders book title', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <BookPopup books={books as any} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('renders book author', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <BookPopup books={books as any} />
      </MemoryRouter>,
    );
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
  });

  it('links to book details', () => {
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <BookPopup books={books as any} />
      </MemoryRouter>,
    );
    const link = screen.getByText('Test Book').closest('a');
    expect(link?.getAttribute('href')).toBe('/book-details/1');
  });

  it('renders multiple books', () => {
    const multiBooks = [
      ...books,
      {
        id: '2',
        title: 'Book 2',
        author: 'Author 2',
        coverPhotoUrl: 'c2.jpg',
        createdAt: '2024',
        latitude: 60,
        longitude: 24,
      },
    ];
    render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <BookPopup books={multiBooks as any} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Book 2')).toBeInTheDocument();
  });
});

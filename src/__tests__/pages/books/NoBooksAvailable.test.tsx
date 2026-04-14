import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoBooksAvailable from '../../../pages/books/_components/NoBooksAvailable';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('NoBooksAvailable', () => {
  it('renders the no books heading', () => {
    render(<NoBooksAvailable />);
    expect(screen.getByText('books.noBooks')).toBeInTheDocument();
  });

  it('renders the filter message', () => {
    render(<NoBooksAvailable />);
    expect(screen.getByText('books.noBooksDesc')).toBeInTheDocument();
  });
});

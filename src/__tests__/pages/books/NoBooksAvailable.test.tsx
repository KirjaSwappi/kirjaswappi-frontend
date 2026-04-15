import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import NoBooksAvailable from '../../../pages/books/_components/NoBooksAvailable';
import { renderWithProviders } from '../../utils/test-utils';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('NoBooksAvailable', () => {
  it('renders the no books heading', () => {
    renderWithProviders(
      <BrowserRouter>
        <NoBooksAvailable />
      </BrowserRouter>,
    );
    expect(screen.getByText('books.noBooks')).toBeInTheDocument();
  });

  it('renders the filter message', () => {
    renderWithProviders(
      <BrowserRouter>
        <NoBooksAvailable />
      </BrowserRouter>,
    );
    expect(screen.getByText('books.noBooksDesc')).toBeInTheDocument();
  });

  it('renders clear filters button', () => {
    renderWithProviders(
      <BrowserRouter>
        <NoBooksAvailable />
      </BrowserRouter>,
    );
    expect(screen.getByText('books.clearFilters')).toBeInTheDocument();
  });
});

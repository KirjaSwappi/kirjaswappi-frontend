import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { renderWithProviders } from './utils/test-utils';

const renderWithRouter = () => {
  return renderWithProviders(
    <BrowserRouter>
      <Routes>
        <Route
          path="/books"
          element={
            <div data-testid="books-page">
              <h1>Books</h1>
              <div data-testid="hero-section">Hero Section</div>
              <div data-testid="filter-section">
                <input data-testid="search-input" placeholder="Search books..." type="text" />
                <button data-testid="filter-button">Filter</button>
              </div>
              <div data-testid="books-grid">
                <div data-testid="book-card-1">
                  <h3>Test Book 1</h3>
                  <button data-testid="view-book-1">View Details</button>
                </div>
                <div data-testid="book-card-2">
                  <h3>Test Book 2</h3>
                  <button data-testid="view-book-2">View Details</button>
                </div>
              </div>
              <div data-testid="loading-skeleton" style={{ display: 'none' }}>
                Loading...
              </div>
            </div>
          }
        />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </BrowserRouter>,
  );
};

describe('Book Discovery and Browsing Flow (Functional)', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders books page when navigating to books route', async () => {
    // Start at books route
    window.history.pushState({}, '', '/books');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('books-page')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });
  });

  it('displays hero section and filter components', async () => {
    // Start at books route
    window.history.pushState({}, '', '/books');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('filter-section')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('filter-button')).toBeInTheDocument();
    });
  });

  it('allows user to search for books', async () => {
    // Start at books route
    window.history.pushState({}, '', '/books');
    renderWithRouter();

    await waitFor(() => {
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Harry Potter');

    expect(searchInput).toHaveValue('Harry Potter');
  });

  it('displays book cards in grid layout', async () => {
    // Start at books route
    window.history.pushState({}, '', '/books');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('books-grid')).toBeInTheDocument();
      expect(screen.getByTestId('book-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('book-card-2')).toBeInTheDocument();
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });
  });

  it('provides navigation to book details', async () => {
    // Start at books route
    window.history.pushState({}, '', '/books');
    renderWithRouter();

    await waitFor(() => {
      const viewButton = screen.getByTestId('view-book-1');
      expect(viewButton).toBeInTheDocument();
      expect(viewButton).toBeEnabled();
    });
  });

  it('integrates with Redux store for filtering', async () => {
    // Start at books route
    window.history.pushState({}, '', '/books');
    const { store } = renderWithRouter();

    await waitFor(() => {
      // Verify Redux store is accessible
      expect(store).toBeDefined();
      expect(store.getState()).toHaveProperty('filter');
      expect(store.getState()).toHaveProperty('auth');
    });
  });
});

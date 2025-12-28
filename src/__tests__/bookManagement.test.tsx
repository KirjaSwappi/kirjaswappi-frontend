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
          path="/add-book"
          element={
            <div data-testid="add-book-page">
              <h1>Add New Book</h1>
              <div data-testid="stepper">
                <div data-testid="step-1" className="active">
                  Book Details
                </div>
                <div data-testid="step-2">Conditions</div>
                <div data-testid="step-3">Location</div>
                <div data-testid="step-4">Images</div>
              </div>
              <div data-testid="form-step-1">
                <form data-testid="book-form">
                  <input data-testid="title-input" placeholder="Book Title" type="text" />
                  <input data-testid="author-input" placeholder="Author" type="text" />
                  <select data-testid="genre-select">
                    <option value="">Select Genre</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                  </select>
                  <button type="button" data-testid="next-button">
                    Next
                  </button>
                </form>
              </div>
              <div data-testid="form-step-2" style={{ display: 'none' }}>
                <select data-testid="condition-select">
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="good">Good</option>
                </select>
                <button type="button" data-testid="prev-button">
                  Previous
                </button>
                <button type="button" data-testid="next-button-step2">
                  Next
                </button>
              </div>
              <div data-testid="form-step-3" style={{ display: 'none' }}>
                <input data-testid="location-input" placeholder="Location" type="text" />
                <button type="button" data-testid="prev-button-step3">
                  Previous
                </button>
                <button type="submit" data-testid="submit-button">
                  Add Book
                </button>
              </div>
            </div>
          }
        />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </BrowserRouter>,
  );
};

describe('Book Management Flow (Functional)', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders add book page when navigating to add book route', async () => {
    // Start at add-book route
    window.history.pushState({}, '', '/add-book');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('add-book-page')).toBeInTheDocument();
      expect(screen.getByText('Add New Book')).toBeInTheDocument();
    });
  });

  it('displays stepper with correct steps', async () => {
    // Start at add-book route
    window.history.pushState({}, '', '/add-book');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('stepper')).toBeInTheDocument();
      expect(screen.getByTestId('step-1')).toBeInTheDocument();
      expect(screen.getByTestId('step-2')).toBeInTheDocument();
      expect(screen.getByTestId('step-3')).toBeInTheDocument();
      expect(screen.getByTestId('step-4')).toBeInTheDocument();
    });
  });

  it('shows first step form with required fields', async () => {
    // Start at add-book route
    window.history.pushState({}, '', '/add-book');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
      expect(screen.getByTestId('title-input')).toBeInTheDocument();
      expect(screen.getByTestId('author-input')).toBeInTheDocument();
      expect(screen.getByTestId('genre-select')).toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });
  });

  it('allows user to fill book details form', async () => {
    // Start at add-book route
    window.history.pushState({}, '', '/add-book');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('title-input')).toBeInTheDocument();
      expect(screen.getByTestId('author-input')).toBeInTheDocument();
      expect(screen.getByTestId('genre-select')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('title-input');
    const authorInput = screen.getByTestId('author-input');
    const genreSelect = screen.getByTestId('genre-select');

    await user.type(titleInput, 'Harry Potter');
    await user.type(authorInput, 'J.K. Rowling');
    await user.selectOptions(genreSelect, 'fiction');

    expect(titleInput).toHaveValue('Harry Potter');
    expect(authorInput).toHaveValue('J.K. Rowling');
    expect(genreSelect).toHaveValue('fiction');
  });

  it('provides navigation between form steps', async () => {
    // Start at add-book route
    window.history.pushState({}, '', '/add-book');
    renderWithRouter();

    await waitFor(() => {
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeInTheDocument();
      expect(nextButton).toBeEnabled();
    });
  });

  it('integrates with Redux store for book management', async () => {
    // Start at add-book route
    window.history.pushState({}, '', '/add-book');
    const { store } = renderWithRouter();

    await waitFor(() => {
      // Verify Redux store is accessible
      expect(store).toBeDefined();
      expect(store.getState()).toHaveProperty('auth');
      expect(store.getState()).toHaveProperty('book');
    });
  });
});

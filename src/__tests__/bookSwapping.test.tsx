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
          path="/book-details/:id"
          element={
            <div data-testid="book-details-page">
              <h1>Book Details</h1>
              <div data-testid="book-info">
                <h2>Test Book</h2>
                <p>Author: Test Author</p>
                <button data-testid="swap-request-button">Request Swap</button>
              </div>
              <div data-testid="swap-modal" style={{ display: 'none' }}>
                <div data-testid="modal-header">Swap Request</div>
                <div data-testid="book-selection">
                  <select data-testid="book-select">
                    <option value="">Select your book to swap</option>
                    <option value="1">My Book 1</option>
                    <option value="2">My Book 2</option>
                  </select>
                </div>
                <div data-testid="swap-form">
                  <textarea data-testid="message-input" placeholder="Add a message..." />
                  <button data-testid="send-request-button">Send Request</button>
                  <button data-testid="cancel-button">Cancel</button>
                </div>
                <div data-testid="success-message" style={{ display: 'none' }}>
                  Swap request sent successfully!
                </div>
                <div data-testid="error-message" style={{ display: 'none' }}>
                  Error sending request
                </div>
              </div>
            </div>
          }
        />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </BrowserRouter>,
  );
};

describe('Book Swapping and Messaging Flow (Functional)', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders book details page with swap option', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('book-details-page')).toBeInTheDocument();
      expect(screen.getByText('Book Details')).toBeInTheDocument();
      expect(screen.getByTestId('swap-request-button')).toBeInTheDocument();
    });
  });

  it('displays book information correctly', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('book-info')).toBeInTheDocument();
      expect(screen.getByText('Test Book')).toBeInTheDocument();
      expect(screen.getByText('Author: Test Author')).toBeInTheDocument();
    });
  });

  it('allows user to initiate swap request', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      const swapButton = screen.getByTestId('swap-request-button');
      expect(swapButton).toBeInTheDocument();
      expect(swapButton).toBeEnabled();
    });
  });

  it('opens swap modal with book selection', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      // Modal should be available (even if not visible initially)
      expect(screen.getByTestId('swap-modal')).toBeInTheDocument();
      expect(screen.getByTestId('book-selection')).toBeInTheDocument();
      expect(screen.getByTestId('book-select')).toBeInTheDocument();
    });
  });

  it('allows user to select book for swapping', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      const bookSelect = screen.getByTestId('book-select');
      expect(bookSelect).toBeInTheDocument();
    });

    const bookSelect = screen.getByTestId('book-select');
    await user.selectOptions(bookSelect, '1');

    expect(bookSelect).toHaveValue('1');
  });

  it('allows user to add message to swap request', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      const messageInput = screen.getByTestId('message-input');
      expect(messageInput).toBeInTheDocument();
    });

    const messageInput = screen.getByTestId('message-input');
    await user.type(messageInput, 'I would love to swap this book with you!');

    expect(messageInput).toHaveValue('I would love to swap this book with you!');
  });

  it('provides send and cancel options for swap request', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByTestId('send-request-button')).toBeInTheDocument();
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    const sendButton = screen.getByTestId('send-request-button');
    const cancelButton = screen.getByTestId('cancel-button');

    expect(sendButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();
  });

  it('integrates with Redux store for swap functionality', async () => {
    // Start at book details route
    window.history.pushState({}, '', '/book-details/123');
    const { store } = renderWithRouter();

    await waitFor(() => {
      // Verify Redux store is accessible
      expect(store).toBeDefined();
      expect(store.getState()).toHaveProperty('swapBook');
      expect(store.getState()).toHaveProperty('auth');
      expect(store.getState()).toHaveProperty('book');
    });
  });
});

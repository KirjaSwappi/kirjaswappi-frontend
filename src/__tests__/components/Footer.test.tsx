import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupTestStore } from '../utils/test-utils';
import Footer from '../../components/Footer';

vi.mock('../../components/Footer/_components/BottomNav', () => ({
  default: () => <div data-testid="bottom-nav">BottomNav</div>,
}));

function renderFooter(route = '/') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = setupTestStore({} as any);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Footer />
      </MemoryRouter>
    </Provider>,
  );
}

describe('Footer', () => {
  it('renders desktop footer with copyright', () => {
    renderFooter();
    expect(screen.getByText(/KirjaSwappi. All rights reserved/)).toBeInTheDocument();
  });

  it('renders legal links in desktop footer', () => {
    renderFooter();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('renders mobile bottom nav', () => {
    renderFooter();
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  it('renders the add book button', () => {
    renderFooter();
    expect(screen.getByLabelText('Add book')).toBeInTheDocument();
  });

  it('hides mobile footer on add-book page', () => {
    renderFooter('/profile/add-book');
    const mobileFooter = screen.getByTestId('bottom-nav').closest('footer');
    expect(mobileFooter).toHaveClass('hidden');
  });
});

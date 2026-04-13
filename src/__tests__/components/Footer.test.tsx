import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupTestStore } from '../utils/test-utils';
import Footer from '../../components/Footer';

vi.mock('../../components/Footer/_components/BottomNav', () => ({
  default: () => <div data-testid="bottom-nav">BottomNav</div>,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
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
    expect(screen.getByText('footer.copyright')).toBeInTheDocument();
  });

  it('renders legal links in desktop footer', () => {
    renderFooter();
    expect(screen.getByText('footer.privacyPolicy')).toBeInTheDocument();
    expect(screen.getByText('footer.termsOfService')).toBeInTheDocument();
    expect(screen.getByText('footer.contactUs')).toBeInTheDocument();
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

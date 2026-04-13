import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import BottomNav from '../../../components/Footer/_components/BottomNav';
import { setupTestStore } from '../../utils/test-utils';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/Footer/_components/BottomNavItem', () => ({
  default: ({ value, route }: { value: string; route: string }) => (
    <div data-testid="nav-item" data-route={route}>
      {value}
    </div>
  ),
}));

describe('BottomNav', () => {
  const renderComponent = (path = '/') => {
    const store = setupTestStore();
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <BottomNav />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('renders navigation items from menu data', () => {
    renderComponent();
    const navItems = screen.getAllByTestId('nav-item');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('renders books menu item', () => {
    renderComponent();
    expect(screen.getByText('books')).toBeInTheDocument();
  });

  it('renders map menu item', () => {
    renderComponent();
    expect(screen.getByText('map')).toBeInTheDocument();
  });

  it('renders messages menu item', () => {
    renderComponent();
    expect(screen.getByText('messages')).toBeInTheDocument();
  });

  it('hides on book-details pages', () => {
    const { container } = renderComponent('/book-details/123');
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.className).toContain('hidden');
  });
});

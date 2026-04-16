import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../../../pages/profile/components/SideDrawer', () => ({
  default: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div data-testid="side-drawer">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock('../../../pages/profile/interface/interface', () => ({}));

vi.mock('../../../redux/feature/genre/genreApi', () => ({
  useGetGenreQuery: () => ({
    data: {
      parentGenres: {
        Fiction: {
          id: 'p1',
          name: 'Fiction',
          childGenres: [
            { id: '1', name: 'Fantasy' },
            { id: '2', name: 'Sci-Fi' },
          ],
        },
        NonFiction: {
          id: 'p2',
          name: 'Non-Fiction',
          childGenres: [{ id: '3', name: 'Biography' }],
        },
        Poetry: {
          id: 'p3',
          name: 'Poetry',
          childGenres: [],
        },
      },
    },
    isLoading: false,
  }),
}));

vi.mock('../../../assets/plusIcon.png', () => ({ default: 'plus.png' }));
vi.mock('../../../assets/tickmark.png', () => ({ default: 'tick.png' }));

import AddGenre from '../../../components/shared/AddGenre';

describe('AddGenre', () => {
  const defaultProps = {
    setEditValuesChanged: vi.fn(),
    genresValue: [] as string[],
    setValue: vi.fn(),
    trigger: vi.fn(),
  };

  const renderComponent = (props = {}) =>
    render(
      <Provider
        store={configureStore({
          reducer: { open: (state = { open: true }) => state },
        })}
      >
        <AddGenre {...defaultProps} {...props} />
      </Provider>,
    );

  it('renders genre items including childless parents', () => {
    renderComponent();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Biography')).toBeInTheDocument();
    expect(screen.getByText('Poetry')).toBeInTheDocument();
  });

  it('renders side drawer with Genre title', () => {
    renderComponent();
    expect(screen.getByText('Genre')).toBeInTheDocument();
  });

  it('shows tick icon for selected genres', () => {
    renderComponent({ genresValue: ['Fantasy'] });
    expect(screen.getByAltText('Selected')).toBeInTheDocument();
  });

  it('shows plus icon for unselected genres', () => {
    renderComponent({ genresValue: [] });
    const addButtons = screen.getAllByAltText('Add');
    expect(addButtons.length).toBe(4);
  });
});

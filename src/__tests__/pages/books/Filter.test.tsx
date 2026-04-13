import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/fi', () => ({
  FiPlus: () => <span>+</span>,
}));

vi.mock('react-icons/md', () => ({
  MdKeyboardArrowDown: () => <span>v</span>,
}));

vi.mock('../../../assets/categoryIcon.svg', () => ({ default: 'category.svg' }));
vi.mock('../../../assets/filtergray.svg', () => ({ default: 'filter.svg' }));
vi.mock('../../../assets/uiw_map.svg', () => ({ default: 'map.svg' }));
vi.mock('../../../assets/sortBy.svg', () => ({ default: 'sort.svg' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    id,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    id?: string;
  }) => (
    <button onClick={onClick} className={className} data-testid={id}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('../../../pages/books/_components/CategorySlider', () => ({
  default: () => <div data-testid="category-slider">CategorySlider</div>,
}));

vi.mock('../../../redux/feature/filter/filterSlice', () => ({
  setFilterOpen: (payload: unknown) => ({ type: 'filter/setFilterOpen', payload }),
  setIsCategoryOrFilterOrSortBy: (payload: unknown) => ({
    type: 'filter/setIsCategoryOrFilterOrSortBy',
    payload,
  }),
}));

vi.mock('../../../redux/feature/open/openSlice', () => ({
  setLoginModalOpen: (payload: unknown) => ({ type: 'open/setLoginModalOpen', payload }),
}));

vi.mock('../../../utility/enum', () => ({
  FilterItemEnum: {
    CATEGORY: 'CATEGORY',
    FILTER: 'FILTER',
    SORTBY: 'SORTBY',
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import Filter from '../../../pages/books/_components/Filter';

describe('Filter', () => {
  const createStore = (userId = '') =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: userId } }) => state,
        filter: (state = { filterOpen: false }) => state,
        open: (state = { open: false }) => state,
      },
    });

  const renderComponent = (userId = '') =>
    render(
      <Provider store={createStore(userId)}>
        <MemoryRouter>
          <Filter />
        </MemoryRouter>
      </Provider>,
    );

  it('renders category button', () => {
    renderComponent();
    expect(screen.getByText('books.category')).toBeInTheDocument();
  });

  it('renders add book button', () => {
    renderComponent();
    expect(screen.getByText(/books.addBook/)).toBeInTheDocument();
  });

  it('renders filter button', () => {
    renderComponent();
    expect(screen.getByText('books.filter')).toBeInTheDocument();
  });

  it('renders sort button', () => {
    renderComponent();
    expect(screen.getByText(/books.sort/)).toBeInTheDocument();
  });

  it('renders map button', () => {
    renderComponent();
    expect(screen.getByText('books.map')).toBeInTheDocument();
  });

  it('renders category slider', () => {
    renderComponent();
    expect(screen.getByTestId('category-slider')).toBeInTheDocument();
  });

  it('navigates to map on map button click', () => {
    renderComponent();
    fireEvent.click(screen.getByText('books.map'));
    expect(mockNavigate).toHaveBeenCalledWith('/map');
  });

  it('navigates to profile when logged in user clicks Add Book', () => {
    renderComponent('user-123');
    fireEvent.click(screen.getByText(/books.addBook/));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/user-profile/user-123');
  });
});

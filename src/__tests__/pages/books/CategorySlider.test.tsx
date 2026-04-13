import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('react-icons/io', () => ({
  IoIosArrowBack: () => null,
  IoIosArrowForward: () => null,
}));

vi.mock('../../../redux/feature/filter/filterSlice', () => ({
  setGenreFilter: (payload: unknown) => ({ type: 'filter/setGenreFilter', payload }),
  clearAllFilters: () => ({ type: 'filter/clearAllFilters' }),
}));

vi.mock('../../../redux/feature/genre/genreApi', () => ({
  useGetGenreQuery: () => ({
    data: {
      parentGenres: {
        '1': { id: '1', name: 'Fiction' },
        '2': { id: '2', name: 'Non-Fiction' },
        '3': { id: '3', name: 'Science' },
      },
    },
    isLoading: false,
  }),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import CategorySlider from '../../../pages/books/_components/CategorySlider';

describe('CategorySlider', () => {
  const renderComponent = () => {
    const store = configureStore({
      reducer: { filter: (state = { genre: [] }) => state },
    });
    return render(
      <Provider store={store}>
        <CategorySlider isFixed={false} />
      </Provider>,
    );
  };

  it('renders genre buttons', () => {
    renderComponent();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('highlights selected genre', () => {
    renderComponent();
    const fictionButton = screen.getByText('Fiction');
    fireEvent.click(fictionButton);
    expect(fictionButton).toHaveClass('bg-primary');
  });

  it('deselects genre on second click', () => {
    renderComponent();
    const fictionButton = screen.getByText('Fiction');
    fireEvent.click(fictionButton);
    expect(fictionButton).toHaveClass('bg-primary');
    fireEvent.click(fictionButton);
    expect(fictionButton).not.toHaveClass('bg-primary');
  });

  it('renders navigation arrows', () => {
    renderComponent();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(5);
  });
});

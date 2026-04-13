import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../assets/filter.png', () => ({ default: 'filter.png' }));

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

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/Search', () => ({
  default: ({ placeholder }: { placeholder?: string }) => (
    <input data-testid="search" placeholder={placeholder} />
  ),
}));

import MapSearchAndFilterBooks from '../../../pages/map/_components/MapSearchAndFilterBooks';

describe('MapSearchAndFilterBooks', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        filter: (state = { filterOpen: false, isCategoryOrFilterOrSortBy: '' }) => state,
      },
    });

  it('renders search input', () => {
    render(
      <Provider store={createStore()}>
        <MapSearchAndFilterBooks />
      </Provider>,
    );
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(
      <Provider store={createStore()}>
        <MapSearchAndFilterBooks />
      </Provider>,
    );
    expect(screen.getByAltText('filter')).toBeInTheDocument();
  });
});

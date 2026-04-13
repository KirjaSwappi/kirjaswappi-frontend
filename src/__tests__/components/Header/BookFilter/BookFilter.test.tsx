import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../../components/shared/Line', () => ({
  default: () => <hr />,
}));

vi.mock('../../../../components/Header/_components/BookFilter/BookFilterReset', () => ({
  default: () => <div data-testid="filter-reset">Reset</div>,
}));

vi.mock('../../../../components/Header/_components/BookFilter/FilterByCondition', () => ({
  default: () => <div data-testid="filter-condition">Condition</div>,
}));

vi.mock('../../../../components/Header/_components/BookFilter/FilterByGenre', () => ({
  default: () => <div data-testid="filter-genre">Genre</div>,
}));

vi.mock('../../../../components/Header/_components/BookFilter/FilterByLanguage', () => ({
  default: () => <div data-testid="filter-language">Language</div>,
}));

vi.mock('../../../../components/Header/_components/BookFilter/FilterBySort', () => ({
  default: () => <div data-testid="filter-sort">Sort</div>,
}));

import BookFilter from '../../../../components/Header/_components/BookFilter/BookFilter';

describe('BookFilter', () => {
  const createStore = (isCategoryOrFilterOrSortBy = 'FILTER') =>
    configureStore({
      reducer: {
        filter: (state = { isCategoryOrFilterOrSortBy }) => state,
      },
    });

  it('renders genre filter', () => {
    render(
      <Provider store={createStore()}>
        <BookFilter />
      </Provider>,
    );
    expect(screen.getByTestId('filter-genre')).toBeInTheDocument();
  });

  it('renders condition and language for FILTER mode', () => {
    render(
      <Provider store={createStore('FILTER')}>
        <BookFilter />
      </Provider>,
    );
    expect(screen.getByTestId('filter-condition')).toBeInTheDocument();
    expect(screen.getByTestId('filter-language')).toBeInTheDocument();
  });

  it('renders sort only for SORTBY mode', () => {
    render(
      <Provider store={createStore('SORTBY')}>
        <BookFilter />
      </Provider>,
    );
    expect(screen.getByTestId('filter-sort')).toBeInTheDocument();
    expect(screen.queryByTestId('filter-genre')).not.toBeInTheDocument();
  });

  it('renders reset for non-SORTBY mode', () => {
    render(
      <Provider store={createStore('CATEGORY')}>
        <BookFilter />
      </Provider>,
    );
    expect(screen.getByTestId('filter-reset')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
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

vi.mock('../../../components/shared/Search', () => ({
  default: () => <input data-testid="search-input" placeholder="Find Books" />,
}));

vi.mock('../../../assets/filterBlue.png', () => ({ default: 'filter.png' }));
vi.mock('../../../assets/sorticon.png', () => ({ default: 'sort.png' }));

import SearchBar from '../../../components/shared/SearchBar';

describe('SearchBar', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        filter: (state = { filterOpen: false, isCategoryOrFilterOrSortBy: '', search: '' }) =>
          state,
      },
    });

  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore()}>
        <SearchBar {...props} />
      </Provider>,
    );

  it('renders search input', () => {
    renderComponent();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders filter icon by default', () => {
    renderComponent();
    expect(screen.getByAltText('Filter Icon')).toBeInTheDocument();
  });

  it('renders sort icon by default', () => {
    renderComponent();
    expect(screen.getByAltText('Sort Icon')).toBeInTheDocument();
  });

  it('hides filter icon when isShowFilterIcon=false', () => {
    renderComponent({ isShowFilterIcon: false });
    expect(screen.queryByAltText('Filter Icon')).not.toBeInTheDocument();
  });

  it('hides sort icon when isShowSortingIcon=false', () => {
    renderComponent({ isShowSortingIcon: false });
    expect(screen.queryByAltText('Sort Icon')).not.toBeInTheDocument();
  });
});

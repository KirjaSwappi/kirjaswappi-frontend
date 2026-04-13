import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import Search from '../../../components/shared/Search';
import { renderWithProviders } from '../../utils/test-utils';

vi.mock('../../../hooks/useDebounce', () => ({
  default: (value: string) => value,
}));

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => ({ reference: { current: null }, clicked: false, setClicked: vi.fn() }),
}));

vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetCitiesQuery: () => ({ data: [{ name: 'Helsinki' }, { name: 'Tampere' }] }),
  useDeleteBookByIdMutation: () => [vi.fn(), { isLoading: false }],
  useLazyGetBookByIdQuery: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('../../../components/shared/cusSelect/CustomSelect', () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange?: (v: string) => void;
  }) => (
    <button data-testid="select" onClick={() => onValueChange?.('Helsinki')}>
      {children}
    </button>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="select-trigger">{children}</button>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
}));

vi.mock('../../../components/shared/Input', () => ({
  default: ({
    value,
    onChange,
    placeholder,
    className,
  }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

describe('Search Component', () => {
  it('renders the search input by default', () => {
    renderWithProviders(<Search />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    renderWithProviders(<Search placeholder="Find a book..." />);
    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Find a book...');
  });

  it('renders default placeholder when none provided', () => {
    renderWithProviders(<Search />);
    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search Books...');
  });

  it('hides search input when isShowSearchInput is false', () => {
    renderWithProviders(<Search isShowSearchInput={false} />);
    expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
  });

  it('renders city select when isShowSearchCity is true', () => {
    renderWithProviders(<Search isShowSearchCity={true} />);
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('hides city select when isShowSearchCity is false', () => {
    renderWithProviders(<Search isShowSearchCity={false} />);
    expect(screen.queryByTestId('select')).not.toBeInTheDocument();
  });

  it('renders search button when isShowSearchButton is true', () => {
    renderWithProviders(<Search isShowSearchButton={true} />);
    expect(screen.getByLabelText('Close search')).toBeInTheDocument();
  });

  it('hides search button when isShowSearchButton is false', () => {
    renderWithProviders(<Search isShowSearchButton={false} />);
    expect(screen.queryByLabelText('Close search')).not.toBeInTheDocument();
  });

  it('calls onClose when search button is clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(<Search onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close search'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates query on input change', () => {
    renderWithProviders(<Search />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Dune' } });
    expect(input).toHaveValue('Dune');
  });

  it('applies className to the container', () => {
    const { container } = renderWithProviders(<Search className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

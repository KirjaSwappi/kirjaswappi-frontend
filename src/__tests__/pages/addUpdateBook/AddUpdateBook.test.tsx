import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@hookform/resolvers/yup', () => ({
  yupResolver: () => () => ({ values: {}, errors: {} }),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../../../../assets/arrow1.png', () => ({ default: 'arrow1.png' }));
vi.mock('../../../../assets/arrow2.png', () => ({ default: 'arrow2.png' }));
vi.mock('../../../../assets/arrow_3.svg', () => ({ default: 'arrow3.svg' }));

vi.mock('../../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={className}
      type={type as 'button' | 'submit'}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/AddGenre', () => ({
  default: () => <div data-testid="add-genre">AddGenre</div>,
}));

vi.mock('../../../redux/feature/book/bookApi', () => ({
  useAddBookMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateBookMutation: () => [vi.fn(), { isLoading: false }],
  useGetBookByIdQuery: () => ({ data: null, isLoading: false }),
  useGetSupportLanguageQuery: () => ({ data: ['English', 'Finnish'], isLoading: false }),
  useGetSupportConditionQuery: () => ({ data: ['New', 'Used'], isLoading: false }),
}));

vi.mock('../../../utility/helper', () => ({
  options: (data: unknown) => data || [],
}));

vi.mock('../../../pages/map/hooks/useGeolocation', () => ({
  useGeolocation: () => ({}),
}));

vi.mock('../../../pages/addUpdateBook/_components/Stepper', () => ({
  default: ({ steps }: { steps: { labelKey: string }[] }) => (
    <div data-testid="stepper">
      {steps.map((s, i) => (
        <span key={i}>{s.labelKey}</span>
      ))}
    </div>
  ),
}));

vi.mock('../../../pages/addUpdateBook/Schema', () => ({
  validationSchemas: [{}, {}, {}],
}));

vi.mock('../../../pages/addUpdateBook/_components/BookAddUpdateHeader', () => ({
  default: ({ title }: { title: string }) => <div data-testid="header">{title}</div>,
}));

vi.mock('../../../pages/addUpdateBook/_components/BookFormStep', () => ({
  default: ({ activeStep }: { activeStep: number }) => (
    <div data-testid="form-step">Step {activeStep}</div>
  ),
}));

vi.mock('../../../pages/addUpdateBook/helper', () => ({
  buildFormData: vi.fn(),
  getDefaultValues: () => ({
    title: '',
    author: '',
    genres: [],
    swappableGenres: [],
    swappableBooks: [],
    swapType: 'BYBOOKS',
  }),
}));

vi.mock('../../../pages/addUpdateBook/types/interface', () => ({}));

import AddUpdateBook from '../../../pages/addUpdateBook';

describe('AddUpdateBook', () => {
  const createStore = () =>
    configureStore({
      reducer: {
        auth: (state = { userInformation: { id: 'user-1' } }) => state,
        open: (state = { open: false }) => state,
      },
    });

  const renderComponent = () =>
    render(
      <Provider store={createStore()}>
        <MemoryRouter>
          <AddUpdateBook />
        </MemoryRouter>
      </Provider>,
    );

  it('renders stepper with steps', () => {
    renderComponent();
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getAllByText('addBook.bookDetails').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('addBook.otherDetails')).toBeInTheDocument();
    expect(screen.getByText('addBook.swapCondition')).toBeInTheDocument();
  });

  it('renders header with add title', () => {
    renderComponent();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders form step', () => {
    renderComponent();
    expect(screen.getByTestId('form-step')).toBeInTheDocument();
  });

  it('renders Next button on first step', () => {
    renderComponent();
    expect(screen.getByText('next')).toBeInTheDocument();
  });

  it('renders add genre component', () => {
    renderComponent();
    expect(screen.getByTestId('add-genre')).toBeInTheDocument();
  });

  it('does not render Back button on first step', () => {
    renderComponent();
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });
});

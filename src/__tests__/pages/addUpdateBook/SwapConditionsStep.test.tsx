import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('react-icons/fa6', () => ({
  FaDeleteLeft: () => <span>delete</span>,
}));

vi.mock('../../../../types/enum', () => ({
  SwapType: {
    BYBOOKS: 'BYBOOKS',
    BYGENRES: 'BYGENRES',
    OPENTOOFFERS: 'OPENTOOFFERS',
    GIVEAWAY: 'GIVEAWAY',
  },
}));

vi.mock('../../../assets/close.svg', () => ({ default: 'close.svg' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    type,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: string;
  }) => (
    <button onClick={onClick} type={type as 'button' | 'submit'}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({ name, placeholder }: { name: string; placeholder: string }) => (
    <input data-testid={`field-${name}`} placeholder={placeholder} />
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/Input', () => ({
  default: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string }) => <label>{label}</label>,
}));

vi.mock('../../../components/shared/Separator', () => ({
  default: () => <hr />,
}));

vi.mock('../../../hooks/useMouse', () => ({
  useMouseClick: () => ({
    reference: { current: null },
    clicked: false,
    setClicked: vi.fn(),
  }),
}));

vi.mock('../../../redux/feature/open/openSlice', () => ({
  setOpen: (p: unknown) => ({ type: 'open/setOpen', payload: p }),
}));

vi.mock('../../../utility/helper', () => ({
  getFileToUrl: () => 'file-url',
}));

vi.mock('../../../pages/addUpdateBook/helper', () => ({
  SWAP_TYPES: [
    { value: 'BYBOOKS', label: 'By Books' },
    { value: 'BYGENRES', label: 'By Genres' },
    { value: 'OPENTOOFFERS', label: 'Open to Offers' },
    { value: 'GIVEAWAY', label: 'Give Away' },
  ],
}));

vi.mock('../../../redux/feature/book/bookApi', () => ({
  useGetSupportedSwapTypesQuery: () => ({ data: undefined }),
}));

vi.mock('../../../pages/addUpdateBook/_components/AddAnotherBookButton', () => ({
  default: () => <button data-testid="add-book-btn">Add Another Book</button>,
}));

vi.mock('../../../pages/addUpdateBook/_components/ConditionMessageBox', () => ({
  default: ({ swapType }: { swapType: string }) => (
    <div data-testid="condition-msg">{swapType}</div>
  ),
}));

vi.mock('../../../pages/addUpdateBook/_components/ImageControllerField', () => ({
  default: ({ name }: { name: string }) => <div data-testid={`image-field-${name}`}>Image</div>,
}));

vi.mock('../../../pages/addUpdateBook/_components/SwappableBookCard', () => ({
  default: () => <div data-testid="swappable-card">Card</div>,
}));

import SwapConditionsStep from '../../../pages/addUpdateBook/_components/SwapConditionsStep';

function Wrapper({ swapType = 'BYBOOKS' }: { swapType?: string }) {
  const store = configureStore({
    reducer: {
      open: (state = { open: false }) => state,
    },
  });

  const FormWrapper = () => {
    const methods = useForm({
      defaultValues: {
        swapType,
        swappableBooks: [],
        swappableGenres: [],
      },
    });
    return (
      <FormProvider {...methods}>
        <SwapConditionsStep errors={{}} />
      </FormProvider>
    );
  };

  return (
    <Provider store={store}>
      <FormWrapper />
    </Provider>
  );
}

describe('SwapConditionsStep', () => {
  it('renders swap type options', () => {
    render(<Wrapper />);
    expect(screen.getByText('By Books')).toBeInTheDocument();
    expect(screen.getByText('By Genres')).toBeInTheDocument();
    expect(screen.getByText('Open to Offers')).toBeInTheDocument();
    expect(screen.getByText('Give Away')).toBeInTheDocument();
  });

  it('renders swap type label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.swapType')).toBeInTheDocument();
  });

  it('renders book form fields for BYBOOKS type', () => {
    render(<Wrapper swapType="BYBOOKS" />);
    expect(screen.getByText('addBook.coverPhoto')).toBeInTheDocument();
    expect(screen.getByText('addBook.bookTitle')).toBeInTheDocument();
    expect(screen.getByText('addBook.authorName')).toBeInTheDocument();
  });

  it('renders genre section for BYGENRES type', () => {
    render(<Wrapper swapType="BYGENRES" />);
    expect(screen.getByText('addBook.genreToSwap')).toBeInTheDocument();
    expect(screen.getByText('add')).toBeInTheDocument();
  });

  it('renders condition message for GIVEAWAY type', () => {
    render(<Wrapper swapType="GIVEAWAY" />);
    expect(screen.getByTestId('condition-msg')).toBeInTheDocument();
  });

  it('renders condition message for OPENTOOFFERS type', () => {
    render(<Wrapper swapType="OPENTOOFFERS" />);
    expect(screen.getByTestId('condition-msg')).toBeInTheDocument();
  });
});

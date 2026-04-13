import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../../../assets/category_filter.svg', () => ({ default: 'cat.svg' }));
vi.mock('../../../../assets/deleteIcon.png', () => ({ default: 'del.png' }));

vi.mock('../../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
  }) => (
    <button onClick={onClick} className={className} type={type as 'button' | 'submit'}>
      {children}
    </button>
  ),
}));

vi.mock('../../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import BookFilterReset from '../../../../components/Header/_components/BookFilter/BookFilterReset';

function Wrapper({ filterType = 'FILTER' }: { filterType?: string }) {
  const store = configureStore({
    reducer: {
      filter: (state = { isCategoryOrFilterOrSortBy: filterType }) => state,
    },
  });
  const FormWrap = () => {
    const methods = useForm({ defaultValues: { genre: [], language: [], condition: [] } });
    return (
      <FormProvider {...methods}>
        <BookFilterReset />
      </FormProvider>
    );
  };
  return (
    <Provider store={store}>
      <FormWrap />
    </Provider>
  );
}

describe('BookFilterReset', () => {
  it('renders Book Filter title for FILTER mode', () => {
    render(<Wrapper filterType="FILTER" />);
    expect(screen.getByText('Book Filter')).toBeInTheDocument();
  });

  it('renders Category Filter title for CATEGORY mode', () => {
    render(<Wrapper filterType="CATEGORY" />);
    expect(screen.getByText('Category Filter')).toBeInTheDocument();
  });

  it('renders Clear all button', () => {
    render(<Wrapper />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });
});

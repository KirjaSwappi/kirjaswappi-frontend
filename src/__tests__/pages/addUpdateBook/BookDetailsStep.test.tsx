import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({ name, placeholder }: { name: string; placeholder?: string }) => (
    <input data-testid={`field-${name}`} placeholder={placeholder} />
  ),
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string }) => <label>{label}</label>,
}));

vi.mock('../../../pages/addUpdateBook/_components/MultipleImageControllerField', () => ({
  default: ({ name }: { name: string }) => <div data-testid={`image-${name}`}>images</div>,
}));

vi.mock('../../../pages/addUpdateBook/types/interface', () => ({}));

import BookDetailsStep from '../../../pages/addUpdateBook/_components/BookDetailsStep';

function Wrapper() {
  const methods = useForm({
    defaultValues: {
      title: '',
      author: '',
      language: '',
      condition: '',
      description: '',
      coverPhotos: [],
    },
  });
  return (
    <FormProvider {...methods}>
      <BookDetailsStep
        errors={{}}
        languageOptions={[{ value: 'en', label: 'English' }]}
        conditionOptions={[{ value: 'new', label: 'New' }]}
      />
    </FormProvider>
  );
}

describe('BookDetailsStep', () => {
  it('renders cover photo label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.coverPhoto')).toBeInTheDocument();
  });

  it('renders book title label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.bookTitle')).toBeInTheDocument();
  });

  it('renders author name label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.authorName')).toBeInTheDocument();
  });

  it('renders book language label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.bookLanguage')).toBeInTheDocument();
  });

  it('renders book condition label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.bookCondition')).toBeInTheDocument();
  });

  it('renders short description label', () => {
    render(<Wrapper />);
    expect(screen.getByText('addBook.shortDescription')).toBeInTheDocument();
  });

  it('renders image upload component', () => {
    render(<Wrapper />);
    expect(screen.getByTestId('image-coverPhotos')).toBeInTheDocument();
  });
});

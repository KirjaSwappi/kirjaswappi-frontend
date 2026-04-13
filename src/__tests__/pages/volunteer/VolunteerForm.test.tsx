import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import VolunteerForm from '../../../pages/volunteer/form/VolunteerForm';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    disabled,
    type,
    className,
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    type?: string;
    className?: string;
  }) => (
    <button type={type as 'submit'} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/ControllerField', () => ({
  default: ({ name, placeholder }: { name: string; placeholder?: string }) => (
    <input data-testid={`input-${name}`} placeholder={placeholder} />
  ),
}));

vi.mock('../../../components/shared/InputLabel', () => ({
  default: ({ label }: { label: string }) => <label>{label}</label>,
}));

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { name: '', email: '', subject: '', description: '' },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('VolunteerForm', () => {
  it('renders all input fields', () => {
    render(
      <Wrapper>
        <VolunteerForm onSubmit={vi.fn()} isLoading={false} />
      </Wrapper>,
    );

    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-subject')).toBeInTheDocument();
    expect(screen.getByTestId('input-description')).toBeInTheDocument();
  });

  it('renders labels with translated text', () => {
    render(
      <Wrapper>
        <VolunteerForm onSubmit={vi.fn()} isLoading={false} />
      </Wrapper>,
    );

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('volunteer.email')).toBeInTheDocument();
    expect(screen.getByText('volunteer.subject')).toBeInTheDocument();
    expect(screen.getByText('volunteer.message')).toBeInTheDocument();
  });

  it('renders submit button with translated text', () => {
    render(
      <Wrapper>
        <VolunteerForm onSubmit={vi.fn()} isLoading={false} />
      </Wrapper>,
    );

    expect(screen.getByText('volunteer.submit')).toBeInTheDocument();
  });

  it('shows loading text when isLoading is true', () => {
    render(
      <Wrapper>
        <VolunteerForm onSubmit={vi.fn()} isLoading={true} />
      </Wrapper>,
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'loading' })).toBeDisabled();
  });

  it('submit button is not disabled when not loading', () => {
    render(
      <Wrapper>
        <VolunteerForm onSubmit={vi.fn()} isLoading={false} />
      </Wrapper>,
    );

    expect(screen.getByRole('button', { name: 'volunteer.submit' })).not.toBeDisabled();
  });
});

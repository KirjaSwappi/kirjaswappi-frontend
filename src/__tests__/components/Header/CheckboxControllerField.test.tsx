import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import CheckboxControllerField from '../../../components/Header/_components/CheckboxInputControllerField';

function Wrapper({ name = 'genres', value = 'Fantasy' }: { name?: string; value?: string }) {
  const methods = useForm({ defaultValues: { [name]: [] as string[] } });
  return (
    <FormProvider {...methods}>
      <CheckboxControllerField name={name} value={value} />
    </FormProvider>
  );
}

describe('CheckboxControllerField', () => {
  it('renders checkbox with value label', () => {
    render(<Wrapper />);
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
  });

  it('renders unchecked checkbox by default', () => {
    render(<Wrapper />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it('toggles on click', () => {
    render(<Wrapper />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

vi.mock('react-icons/ai', () => ({
  AiOutlineEye: () => <span data-testid="eye-open" />,
  AiOutlineEyeInvisible: () => <span data-testid="eye-closed" />,
}));

vi.mock('../../../components/shared/Input', () => ({
  default: (props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) => (
    <div>
      <input {...props} data-testid={`input-${props.name}`} />
      {props.error && <span data-testid="error">{props.error}</span>}
    </div>
  ),
}));

import ControlledPasswordField from '../../../components/shared/ControllerFieldPassword';

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { password: '' } });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('ControlledPasswordField', () => {
  it('renders password input', () => {
    render(
      <Wrapper>
        <ControlledPasswordField name="password" placeholder="Enter password" />
      </Wrapper>,
    );
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
  });

  it('shows eye open icon initially (password hidden)', () => {
    render(
      <Wrapper>
        <ControlledPasswordField name="password" />
      </Wrapper>,
    );
    expect(screen.getByTestId('eye-open')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(
      <Wrapper>
        <ControlledPasswordField name="password" />
      </Wrapper>,
    );
    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);
    expect(screen.getByTestId('eye-closed')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../components/shared/PasswordInput', () => ({
  default: (props: { placeholder?: string; value?: string; id?: string; error?: string }) => (
    <div>
      <input
        placeholder={props.placeholder}
        value={props.value}
        id={props.id}
        readOnly
        data-testid={`input-${props.id}`}
      />
      {props.error && <span data-testid={`error-${props.id}`}>{props.error}</span>}
    </div>
  ),
}));

import NewPassword from '../../../pages/auth/resetPassword/_component/NewPassword';

describe('NewPassword', () => {
  const defaultProps = {
    userPass: { password: '', confirmPassword: '' },
    handleChange: vi.fn(),
    errors: {},
    validateInput: vi.fn(),
  };

  it('should render password and confirm password inputs', () => {
    render(<NewPassword {...defaultProps} />);
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirmPassword')).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    render(<NewPassword {...defaultProps} />);
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
  });

  it('should display password error when provided', () => {
    render(<NewPassword {...defaultProps} errors={{ password: 'Password is required' }} />);
    expect(screen.getByTestId('error-password')).toHaveTextContent('Password is required');
  });

  it('should display confirm password error when provided', () => {
    render(
      <NewPassword {...defaultProps} errors={{ confirmPassword: 'Passwords do not match' }} />,
    );
    expect(screen.getByTestId('error-confirmPassword')).toHaveTextContent('Passwords do not match');
  });

  it('should display both password values', () => {
    render(
      <NewPassword
        {...defaultProps}
        userPass={{ password: 'abc123', confirmPassword: 'abc123' }}
      />,
    );
    expect(screen.getByTestId('input-password')).toHaveValue('abc123');
    expect(screen.getByTestId('input-confirmPassword')).toHaveValue('abc123');
  });
});

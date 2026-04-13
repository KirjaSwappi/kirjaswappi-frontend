import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../components/shared/Input', () => ({
  default: (props: { placeholder?: string; value?: string; id?: string; error?: string }) => (
    <div>
      <input
        placeholder={props.placeholder}
        value={props.value}
        id={props.id}
        readOnly
        data-testid={`input-${props.id}`}
      />
      {props.error && <span data-testid="error">{props.error}</span>}
    </div>
  ),
}));

import GetOTPByEmail from '../../../pages/auth/resetPassword/_component/GetOTPByEmail';

describe('GetOTPByEmail', () => {
  const defaultProps = {
    userInfo: { email: 'test@example.com' },
    handleChange: vi.fn(),
    validateInput: vi.fn(),
  };

  it('should render the email input', () => {
    render(<GetOTPByEmail {...defaultProps} />);
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  it('should display the email value', () => {
    render(<GetOTPByEmail {...defaultProps} />);
    expect(screen.getByTestId('input-email')).toHaveValue('test@example.com');
  });

  it('should render the helper text about OTP', () => {
    render(<GetOTPByEmail {...defaultProps} />);
    expect(screen.getByText('An OTP will be sent to the email address')).toBeInTheDocument();
  });

  it('should display error when provided', () => {
    render(<GetOTPByEmail {...defaultProps} error="Invalid email" />);
    expect(screen.getByTestId('error')).toHaveTextContent('Invalid email');
  });
});

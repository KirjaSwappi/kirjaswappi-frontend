import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PasswordInput from '../../../components/shared/PasswordInput';

describe('PasswordInput', () => {
  const defaultProps = {
    name: 'password',
    id: 'password',
    value: '',
    onChange: vi.fn(),
  };

  it('renders as password input by default', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('toggles visibility to text when eye button is clicked', () => {
    render(<PasswordInput {...defaultProps} />);
    const toggleBtn = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(toggleBtn);
    expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
  });

  it('toggles back to password on second click', () => {
    render(<PasswordInput {...defaultProps} />);
    const toggleBtn = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(toggleBtn);
    const hideBtn = screen.getByRole('button', { name: 'Hide password' });
    fireEvent.click(hideBtn);
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<PasswordInput {...defaultProps} onChange={onChange} />);
    const input = document.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('renders with placeholder', () => {
    render(<PasswordInput {...defaultProps} placeholder="Enter password" />);
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('shows aria-label "Show password" initially and "Hide password" after toggle', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Show password'));
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });
});

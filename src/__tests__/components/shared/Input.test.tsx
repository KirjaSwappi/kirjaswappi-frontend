import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../../components/shared/Input';

describe('Input Component', () => {
  it('renders with default text type', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with specified type', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter your name" />);
    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
  });

  it('renders with value', () => {
    render(<Input value="John Doe" />);
    const input = screen.getByDisplayValue('John Doe');
    expect(input).toBeInTheDocument();
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur event', () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus event', () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });

  it('applies default styling classes', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('w-full', 'h-[48px]', 'px-[14px]', 'py-2', 'bg-white');
    expect(input).toHaveClass('border', 'lg:border-grayDark', 'border-gray');
    expect(input).toHaveClass('focus:ring-primary', 'focus:border-primary');
    expect(input).toHaveClass('focus:outline-none');
    expect(input).toHaveClass('placeholder:text-sm', 'placeholder:text-grayDark');
  });

  it('applies error styling when error is present', () => {
    render(<Input error="This field is required" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('border-red');
    expect(input).not.toHaveClass('focus:ring-primary', 'focus:border-primary');
  });

  it('does not show error message by default', () => {
    render(<Input error="This field is required" />);
    expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
  });

  it('shows error message when showErrorMessage is true', () => {
    render(<Input error="This field is required" showErrorMessage={true} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error message styling', () => {
    render(<Input error="Error message" showErrorMessage={true} />);
    const errorMessage = screen.getByText('Error message');

    expect(errorMessage).toHaveClass('text-rose-500', 'text-xs', 'mt-1', 'pl-2');
  });

  it('passes through additional props', () => {
    render(<Input data-testid="custom-input" maxLength={10} required />);
    const input = screen.getByTestId('custom-input');

    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('required');
  });

  it('supports autoComplete attribute', () => {
    render(<Input autoComplete="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('supports name and id attributes', () => {
    render(<Input name="username" id="user-input" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('id', 'user-input');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);

    // The ref callback should be called with the input element
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('handles controlled input correctly', () => {
    const { rerender } = render(<Input value="initial" />);
    let input = screen.getByDisplayValue('initial');
    expect(input).toBeInTheDocument();

    rerender(<Input value="updated" />);
    input = screen.getByDisplayValue('updated');
    expect(input).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('handles readOnly state', () => {
    render(<Input readOnly />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextArea from '../../../components/shared/TextArea';

describe('TextArea', () => {
  it('renders a textarea element', () => {
    render(<TextArea />);
    expect(document.querySelector('textarea')).toBeInTheDocument();
  });

  it('renders with placeholder text', () => {
    render(<TextArea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    const onChange = vi.fn();
    render(<TextArea onChange={onChange} />);
    fireEvent.change(document.querySelector('textarea')!, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message when showErrorMessage and error are set', () => {
    render(<TextArea error="Required field" showErrorMessage />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('does not show error message when showErrorMessage is false', () => {
    render(<TextArea error="Required field" showErrorMessage={false} />);
    expect(screen.queryByText('Required field')).not.toBeInTheDocument();
  });

  it('applies error border class when error is present', () => {
    render(<TextArea error="Error" />);
    expect(document.querySelector('textarea')).toHaveClass('border-rose-500');
  });

  it('can be disabled', () => {
    render(<TextArea disabled />);
    expect(document.querySelector('textarea')).toBeDisabled();
  });

  it('displays the provided value', () => {
    render(<TextArea value="Some text" onChange={vi.fn()} />);
    expect(document.querySelector('textarea')).toHaveValue('Some text');
  });
});

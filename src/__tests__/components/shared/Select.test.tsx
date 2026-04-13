import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from '../../../components/shared/Select';

const options = [
  { label: 'Fiction', value: 'fiction' },
  { label: 'Non-Fiction', value: 'non-fiction' },
  { label: 'Science', value: 'science' },
];

describe('Select', () => {
  it('renders all options plus default placeholder', () => {
    render(<Select options={options} />);
    const selectEl = screen.getByRole('combobox');
    expect(selectEl.querySelectorAll('option')).toHaveLength(4);
  });

  it('renders default placeholder with name', () => {
    render(<Select options={options} name="genre" />);
    expect(screen.getByText('Select genre')).toBeInTheDocument();
  });

  it('renders default placeholder "Select options" without name', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  it('calls onChange when a value is selected', () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'fiction' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message when showErrorMessage and error are set', () => {
    render(<Select options={options} error="Selection required" showErrorMessage />);
    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('does not show error message when showErrorMessage is false', () => {
    render(<Select options={options} error="Selection required" />);
    expect(screen.queryByText('Selection required')).not.toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies error border class when error is present', () => {
    render(<Select options={options} error="Error" />);
    expect(screen.getByRole('combobox')).toHaveClass('border-rose-500');
  });
});

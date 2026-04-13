import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InputLabel from '../../../components/shared/InputLabel';

describe('InputLabel', () => {
  it('renders the label text', () => {
    render(<InputLabel label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders nothing when label is undefined', () => {
    const { container } = render(<InputLabel label={undefined} />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('shows required asterisk when required is true', () => {
    render(<InputLabel label="Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required asterisk by default', () => {
    render(<InputLabel label="Name" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<InputLabel label="Test" className="text-red-500" />);
    const label = screen.getByText('Test');
    expect(label).toHaveClass('text-red-500');
  });

  it('has default font classes', () => {
    render(<InputLabel label="Test" />);
    const label = screen.getByText('Test');
    expect(label).toHaveClass('font-poppins');
    expect(label).toHaveClass('text-sm');
  });
});

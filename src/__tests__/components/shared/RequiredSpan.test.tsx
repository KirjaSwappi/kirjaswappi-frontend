import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RequiredSpan from '../../../components/shared/RequiredSpan';

describe('RequiredSpan', () => {
  it('renders an asterisk', () => {
    render(<RequiredSpan />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<RequiredSpan />);
    expect(screen.getByText('*').tagName).toBe('SPAN');
  });

  it('has red text styling', () => {
    render(<RequiredSpan />);
    expect(screen.getByText('*')).toHaveClass('text-rose-600');
  });
});

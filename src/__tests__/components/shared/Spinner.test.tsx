import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '../../../components/shared/Spinner';

describe('Spinner', () => {
  it('renders the spinner overlay', () => {
    const { container } = render(<Spinner />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('z-50');
  });

  it('renders the loader image', () => {
    render(<Spinner />);
    const img = screen.getByAltText('loader');
    expect(img).toBeInTheDocument();
  });

  it('has spinning animation', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

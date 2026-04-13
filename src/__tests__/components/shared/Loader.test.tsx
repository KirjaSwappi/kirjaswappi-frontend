import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from '../../../components/shared/Loader';

describe('Loader', () => {
  it('renders the loader image', () => {
    render(<Loader />);
    expect(screen.getByAltText('loader')).toBeInTheDocument();
  });

  it('renders with fixed positioning overlay', () => {
    const { container } = render(<Loader />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('applies pulse animation to the image', () => {
    render(<Loader />);
    expect(screen.getByAltText('loader')).toHaveClass('animate-pulse');
  });

  it('applies spin animation to the spinner ring', () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

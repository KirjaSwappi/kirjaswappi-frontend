import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Spinner from '../../../components/shared/Spinner';

describe('Spinner', () => {
  it('renders the spinner image', () => {
    render(<Spinner />);
    expect(screen.getByAltText('loader')).toBeInTheDocument();
  });

  it('renders with fixed positioning overlay', () => {
    const { container } = render(<Spinner />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50');
  });

  it('applies pulse animation to the image', () => {
    render(<Spinner />);
    expect(screen.getByAltText('loader')).toHaveClass('animate-pulse');
  });

  it('applies spin animation to the spinner ring', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('uses dark overlay for variant="overlay"', () => {
    const { container } = render(<Spinner variant="overlay" />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('bg-opacity-70');
  });

  it('uses light overlay by default', () => {
    const { container } = render(<Spinner />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('bg-opacity-10');
  });
});

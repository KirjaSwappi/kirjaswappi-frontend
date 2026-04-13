import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookDescription from '../../../pages/bookDetails/_components/BookDescription';

describe('BookDescription', () => {
  it('returns null when description is empty', () => {
    const { container } = render(<BookDescription description="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders short description without More button', () => {
    render(<BookDescription description="A short description." />);
    expect(screen.getAllByText('A short description.').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /more/i })).not.toBeInTheDocument();
  });

  it('truncates long description and shows More button', () => {
    const longText = 'A'.repeat(200);
    render(<BookDescription description={longText} />);

    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });

  it('expands text when More is clicked', () => {
    const longText = 'B'.repeat(200);
    render(<BookDescription description={longText} />);

    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument();
  });

  it('collapses text when Show Less is clicked', () => {
    const longText = 'C'.repeat(200);
    render(<BookDescription description={longText} />);

    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    fireEvent.click(screen.getByRole('button', { name: /show less/i }));
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
  });
});

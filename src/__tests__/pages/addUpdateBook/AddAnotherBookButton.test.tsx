import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../../assets/plus.png', () => ({ default: 'plus.png' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
  }) => (
    <button onClick={onClick} className={className} type={type as 'button' | 'submit'}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import AddAnotherBookButton from '../../../pages/addUpdateBook/_components/AddAnotherBookButton';

describe('AddAnotherBookButton', () => {
  it('renders button text', () => {
    render(<AddAnotherBookButton addAnotherBook={vi.fn()} />);
    expect(screen.getByText('Add Another Book')).toBeInTheDocument();
  });

  it('calls addAnotherBook on click', () => {
    const addAnotherBook = vi.fn();
    render(<AddAnotherBookButton addAnotherBook={addAnotherBook} />);
    fireEvent.click(screen.getByText('Add Another Book'));
    expect(addAnotherBook).toHaveBeenCalled();
  });
});

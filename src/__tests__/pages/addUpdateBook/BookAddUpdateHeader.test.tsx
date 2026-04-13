import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../assets/leftArrow.png', () => ({ default: 'arrow.png' }));

import BookAddUpdateHeader from '../../../pages/addUpdateBook/_components/BookAddUpdateHeader';

describe('BookAddUpdateHeader', () => {
  it('renders title', () => {
    render(<BookAddUpdateHeader title="Add Book" onBack={vi.fn()} />);
    expect(screen.getByText('Add Book')).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(<BookAddUpdateHeader title="Test" onBack={vi.fn()} />);
    expect(screen.getByLabelText('Go back')).toBeInTheDocument();
  });

  it('calls onBack when clicked', () => {
    const onBack = vi.fn();
    render(<BookAddUpdateHeader title="Test" onBack={onBack} />);
    fireEvent.click(screen.getByLabelText('Go back'));
    expect(onBack).toHaveBeenCalled();
  });
});

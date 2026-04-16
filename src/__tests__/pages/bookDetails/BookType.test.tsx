import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookType from '../../../pages/bookDetails/_components/BookType';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe('BookType', () => {
  it('renders condition, language, and published year', () => {
    render(<BookType condition="Good" language="Finnish" publishedYear="2020" />);

    expect(screen.getByText('Book Condition')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('Finnish')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('returns null when condition is empty', () => {
    const { container } = render(<BookType condition="" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows dash for missing language', () => {
    render(<BookType condition="New" language="" publishedYear="2020" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('shows dash for missing publishedYear', () => {
    render(<BookType condition="New" language="Finnish" />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders all three section labels', () => {
    render(<BookType condition="Used" language="Swedish" publishedYear="2015" />);

    expect(screen.getByText('Book Condition')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Edition')).toBeInTheDocument();
  });
});

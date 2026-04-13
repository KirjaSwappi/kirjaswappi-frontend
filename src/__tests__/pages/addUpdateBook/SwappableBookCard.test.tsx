import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('react-icons/pi', () => ({
  PiDotsThreeBold: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <span data-testid="dots" {...props} />
  ),
}));

vi.mock('../../../assets/deleteIconRed.png', () => ({ default: 'delete.png' }));
vi.mock('../../../assets/editBlack.png', () => ({ default: 'edit.png' }));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
    type,
    onKeyDown,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
  }) => (
    <button onClick={onClick} className={className} type={type as 'button'} onKeyDown={onKeyDown}>
      {children}
    </button>
  ),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt || ''} src={src} />,
}));

import SwappableBookCard from '../../../pages/addUpdateBook/_components/SwappableBookCard';

describe('SwappableBookCard', () => {
  const baseProps = {
    id: 'book-1',
    index: 0,
    title: 'Test Book',
    author: 'Test Author',
    coverPhotoUrl: 'http://example.com/cover.jpg',
    swappableBookIndex: null as number | null,
    clicked: false,
    reference: React.createRef(),
    setSwappableBookIndex: vi.fn(),
    setClicked: vi.fn(),
    editAnotherBook: vi.fn(),
    deleteSwappableBookByIndex: vi.fn(),
  };

  it('renders title and author', () => {
    render(<SwappableBookCard {...baseProps} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
  });

  it('renders cover image', () => {
    render(<SwappableBookCard {...baseProps} />);
    expect(screen.getByAltText('Cover')).toBeInTheDocument();
  });

  it('opens menu on dots click', () => {
    render(<SwappableBookCard {...baseProps} />);
    fireEvent.click(screen.getByTestId('dots'));
    expect(baseProps.setSwappableBookIndex).toHaveBeenCalledWith(0);
    expect(baseProps.setClicked).toHaveBeenCalledWith(true);
  });

  it('shows edit/delete when menu is open', () => {
    render(<SwappableBookCard {...baseProps} swappableBookIndex={0} clicked={true} />);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls editAnotherBook on edit click', () => {
    render(<SwappableBookCard {...baseProps} swappableBookIndex={0} clicked={true} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(baseProps.editAnotherBook).toHaveBeenCalledWith(0);
  });

  it('calls deleteSwappableBookByIndex on delete click', () => {
    render(<SwappableBookCard {...baseProps} swappableBookIndex={0} clicked={true} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(baseProps.deleteSwappableBookByIndex).toHaveBeenCalledWith(0);
  });

  it('closes menu when clicking dots again', () => {
    const setSwappableBookIndex = vi.fn();
    const setClicked = vi.fn();
    render(
      <SwappableBookCard
        {...baseProps}
        swappableBookIndex={0}
        clicked={true}
        setSwappableBookIndex={setSwappableBookIndex}
        setClicked={setClicked}
      />,
    );
    fireEvent.click(screen.getByTestId('dots'));
    expect(setSwappableBookIndex).toHaveBeenCalledWith(null);
    expect(setClicked).toHaveBeenCalledWith(false);
  });

  it('does not show menu when different index is active', () => {
    render(<SwappableBookCard {...baseProps} swappableBookIndex={1} clicked={true} />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});

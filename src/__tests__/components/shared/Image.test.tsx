import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Image from '../../../components/shared/Image';

vi.mock('../../../assets/notFoundIcon.png', () => ({ default: 'notFoundIcon.png' }));

describe('Image Component', () => {
  it('renders an img inside a picture element', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Test" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('uses the provided src', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Test" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('falls back to notFoundIcon when src is undefined', () => {
    render(<Image src={undefined} alt="missing" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'notFoundIcon.png');
  });

  it('applies the alt text', () => {
    render(<Image src="https://example.com/photo.jpg" alt="My Alt" />);
    expect(screen.getByAltText('My Alt')).toBeInTheDocument();
  });

  it('uses empty string for alt when not provided', () => {
    const { container } = render(<Image src="https://example.com/photo.jpg" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', 'image');
  });

  it('applies className to the img element', () => {
    const { container } = render(
      <Image src="https://example.com/photo.jpg" className="rounded-full" />,
    );
    expect(container.querySelector('img')).toHaveClass('rounded-full');
  });

  it('starts with opacity-0 and transitions to opacity-100 on load', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Test" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('opacity-0');

    fireEvent.load(img);
    expect(img).toHaveClass('opacity-100');
  });

  it('calls onError and swaps src to notFoundIcon on image error', () => {
    render(<Image src="https://example.com/bad.jpg" alt="Bad" />);
    const img = screen.getByRole('img');

    Object.defineProperty(img, 'src', { writable: true, value: 'https://example.com/bad.jpg' });
    fireEvent.error(img);

    expect((img as HTMLImageElement).src).toContain('notFoundIcon.png');
  });

  it('calls onClick when provided', () => {
    const onClick = vi.fn();
    render(<Image src="https://example.com/photo.jpg" alt="Clickable" onClick={onClick} />);
    fireEvent.click(screen.getByRole('img'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onMouseOver when provided', () => {
    const onMouseOver = vi.fn();
    render(<Image src="https://example.com/photo.jpg" alt="Hover" onMouseOver={onMouseOver} />);
    fireEvent.mouseOver(screen.getByRole('img'));
    expect(onMouseOver).toHaveBeenCalledTimes(1);
  });

  it('has lazy loading attribute', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Lazy" />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('has async decoding attribute', () => {
    render(<Image src="https://example.com/photo.jpg" alt="Async" />);
    expect(screen.getByRole('img')).toHaveAttribute('decoding', 'async');
  });
});

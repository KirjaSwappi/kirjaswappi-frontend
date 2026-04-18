import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    disabled,
    type,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type as 'button' | 'submit'}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock('../../../assets/close.svg', () => ({ default: 'close.svg' }));
vi.mock('../../../assets/sendMessageIcon.png', () => ({ default: 'send.png' }));

vi.mock('../../../components/shared/SwapRequestModal/_components/SwapBookInformation', () => ({
  default: () => <div data-testid="swap-info">info</div>,
}));

import ModalHeader from '../../../components/shared/SwapRequestModal/_components/SwapModalHeader';
import SubmitButton from '../../../components/shared/SwapRequestModal/_components/SwapModalSubmitButton';
import ConditionDisplay from '../../../components/shared/SwapRequestModal/_components/SwapModalConditionDisplay';
import GenreTags from '../../../components/shared/SwapRequestModal/_components/SwapModalGenreTags';
import BookImage from '../../../components/shared/SwapRequestModal/_components/SwapModalBookImage';

describe('ModalHeader', () => {
  it('renders Swap Request title', () => {
    render(<ModalHeader onClose={vi.fn()} />);
    expect(screen.getByText('Swap Request')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<ModalHeader onClose={vi.fn()} />);
    expect(screen.getByAltText('close')).toBeInTheDocument();
  });
});

describe('SubmitButton', () => {
  it('renders Send Request text', () => {
    render(<SubmitButton disabled={false} />);
    expect(screen.getByText('Send Request')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<SubmitButton disabled={true} />);
    const btn = screen.getByText('Send Request').closest('button');
    expect(btn).toBeDisabled();
  });
});

describe('ConditionDisplay', () => {
  it('renders condition label and image', () => {
    render(<ConditionDisplay conditionItem={{ image: 'swap.png', labelKey: 'swap.byBooks' }} />);
    expect(screen.getByText('By Books')).toBeInTheDocument();
  });

  it('returns null when no conditionItem', () => {
    const { container } = render(<ConditionDisplay />);
    expect(container.firstChild).toBeNull();
  });
});

describe('GenreTags', () => {
  it('renders genre names', () => {
    render(<GenreTags swappableGenres={[{ name: 'Fantasy' }, { name: 'Sci-Fi' }]} />);
    expect(screen.getByText('Condition Genre:')).toBeInTheDocument();
    expect(screen.getByText(/Fantasy/)).toBeInTheDocument();
    expect(screen.getByText(/Sci-Fi/)).toBeInTheDocument();
  });

  it('returns null for empty genres', () => {
    const { container } = render(<GenreTags swappableGenres={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('BookImage', () => {
  it('renders cover image', () => {
    render(<BookImage coverPhotoUrls={['img1.jpg']} title="Test" />);
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });
});

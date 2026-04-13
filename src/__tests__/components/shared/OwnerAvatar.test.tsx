import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OwnerAvatar from '../../../components/shared/OwnerAvatar';

vi.mock('../../../redux/feature/auth/authApi', () => ({
  useGetUserProfileImageQuery: vi.fn(),
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ src, alt, className }: { src: string; alt?: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="owner-image" />
  ),
}));

import { useGetUserProfileImageQuery } from '../../../redux/feature/auth/authApi';

const mockQuery = useGetUserProfileImageQuery as ReturnType<typeof vi.fn>;

describe('OwnerAvatar Component', () => {
  it('renders profile image when imageUrl is available', () => {
    mockQuery.mockReturnValue({ currentData: { imageUrl: 'https://example.com/avatar.jpg' } });

    render(<OwnerAvatar ownerId="user-1" />);
    const img = screen.getByTestId('owner-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders FaRegUser icon when currentData is null', () => {
    mockQuery.mockReturnValue({ currentData: null });

    const { container } = render(<OwnerAvatar ownerId="user-1" />);
    expect(screen.queryByTestId('owner-image')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders fallback icon when imageUrl is null', () => {
    mockQuery.mockReturnValue({ currentData: { imageUrl: null } });

    const { container } = render(<OwnerAvatar ownerId="user-1" />);
    expect(screen.queryByTestId('owner-image')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('skips the query when ownerId is empty', () => {
    mockQuery.mockReturnValue({ currentData: null });

    render(<OwnerAvatar ownerId="" />);
    expect(mockQuery).toHaveBeenCalledWith({ userId: '' }, { skip: true });
  });

  it('does not skip query when ownerId is provided', () => {
    mockQuery.mockReturnValue({ currentData: null });

    render(<OwnerAvatar ownerId="user-1" />);
    expect(mockQuery).toHaveBeenCalledWith({ userId: 'user-1' }, { skip: false });
  });

  it('applies custom className to the image', () => {
    mockQuery.mockReturnValue({ currentData: { imageUrl: 'https://example.com/avatar.jpg' } });

    render(<OwnerAvatar ownerId="user-1" className="w-8 h-8" />);
    expect(screen.getByTestId('owner-image')).toHaveClass('w-8 h-8');
  });

  it('applies default className when not provided', () => {
    mockQuery.mockReturnValue({ currentData: { imageUrl: 'https://example.com/avatar.jpg' } });

    render(<OwnerAvatar ownerId="user-1" />);
    expect(screen.getByTestId('owner-image')).toHaveClass('w-3.5', 'h-3.5');
  });

  it('uses custom iconSize prop', () => {
    mockQuery.mockReturnValue({ currentData: null });

    const { container } = render(<OwnerAvatar ownerId="user-1" iconSize={20} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OfferedBy from '../../../pages/bookDetails/_components/OfferedBy';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('../../../components/shared/Button', () => ({
  default: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

const baseLocation = {
  address: '123 Street',
  city: 'Helsinki',
  country: 'Finland',
  latitude: 60.17,
  longitude: 24.94,
  postalCode: '00100',
  radiusKm: 10,
};

describe('OfferedBy', () => {
  it('renders owner name and Offered by label', () => {
    render(
      <MemoryRouter>
        <OfferedBy
          imageUrl="https://example.com/photo.jpg"
          ownerName="John Doe"
          ownerId="123"
          location={baseLocation}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Offered by')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders location city when available', () => {
    render(
      <MemoryRouter>
        <OfferedBy imageUrl="" ownerName="Jane" ownerId="456" location={baseLocation} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Helsinki')).toBeInTheDocument();
  });

  it('does not render location when city is empty', () => {
    render(
      <MemoryRouter>
        <OfferedBy
          imageUrl=""
          ownerName="Jane"
          ownerId="456"
          location={{ ...baseLocation, city: '' }}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Helsinki')).not.toBeInTheDocument();
  });

  it('navigates to user profile on owner name click', () => {
    render(
      <MemoryRouter>
        <OfferedBy imageUrl="" ownerName="Alice" ownerId="789" location={baseLocation} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Alice'));
    expect(mockNavigate).toHaveBeenCalledWith('/profile/user-profile/789');
  });

  it('renders profile image with correct alt text', () => {
    render(
      <MemoryRouter>
        <OfferedBy
          imageUrl="https://example.com/photo.jpg"
          ownerName="Bob"
          ownerId="101"
          location={baseLocation}
        />
      </MemoryRouter>,
    );

    expect(screen.getByAltText('profile')).toBeInTheDocument();
  });
});

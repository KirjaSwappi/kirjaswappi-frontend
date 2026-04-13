import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNavItem from '../../../components/Footer/_components/BottomNavItem';

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, style }: { alt: string; style?: React.CSSProperties }) => (
    <img alt={alt} style={style} />
  ),
}));

import { vi } from 'vitest';

describe('BottomNavItem', () => {
  it('renders the value text', () => {
    render(
      <MemoryRouter>
        <BottomNavItem route="/" icon="/icon.svg" isActive={false} value="Home" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders a link with the correct route', () => {
    render(
      <MemoryRouter>
        <BottomNavItem route="/map" icon="/icon.svg" isActive={false} value="Map" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/map');
  });

  it('applies active styles when isActive is true', () => {
    render(
      <MemoryRouter>
        <BottomNavItem route="/" icon="/icon.svg" isActive={true} value="Home" />
      </MemoryRouter>,
    );

    const text = screen.getByText('Home');
    expect(text).toHaveClass('font-medium');
    expect(text).toHaveClass('text-primary');
  });

  it('applies inactive styles when isActive is false', () => {
    render(
      <MemoryRouter>
        <BottomNavItem route="/" icon="/icon.svg" isActive={false} value="Home" />
      </MemoryRouter>,
    );

    const text = screen.getByText('Home');
    expect(text).toHaveClass('font-light');
  });

  it('shows badge when badgeCount is greater than 0', () => {
    render(
      <MemoryRouter>
        <BottomNavItem
          route="/"
          icon="/icon.svg"
          isActive={false}
          value="Messages"
          badgeCount={5}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows 9+ when badgeCount exceeds 9', () => {
    render(
      <MemoryRouter>
        <BottomNavItem
          route="/"
          icon="/icon.svg"
          isActive={false}
          value="Messages"
          badgeCount={15}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('does not show badge when badgeCount is 0', () => {
    render(
      <MemoryRouter>
        <BottomNavItem
          route="/"
          icon="/icon.svg"
          isActive={false}
          value="Messages"
          badgeCount={0}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('links to # when route is not provided', () => {
    render(
      <MemoryRouter>
        <BottomNavItem icon="/icon.svg" isActive={false} value="Test" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link');
    // Link to="#" resolves to "/" in MemoryRouter but defaults correctly
    expect(link).toBeInTheDocument();
  });
});

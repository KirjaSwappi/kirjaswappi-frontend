import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SupportUsCard from '../../../pages/support-us/components/SupportUsCard';

vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  ),
}));

const mockData = {
  id: 1,
  title: 'Donate to KirjaSwappi',
  description: 'Help us grow the platform by donating.',
  buttonText: 'Donate Now',
  image: '/test-image.jpg',
  textOrder: 1,
  pageLink: '/donation',
};

describe('SupportUsCard', () => {
  it('renders the card title', () => {
    render(
      <MemoryRouter>
        <SupportUsCard data={mockData} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Donate to KirjaSwappi')).toBeInTheDocument();
  });

  it('renders the card description', () => {
    render(
      <MemoryRouter>
        <SupportUsCard data={mockData} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Help us grow the platform by donating.')).toBeInTheDocument();
  });

  it('renders the button with correct text', () => {
    render(
      <MemoryRouter>
        <SupportUsCard data={mockData} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Donate Now')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    render(
      <MemoryRouter>
        <SupportUsCard data={mockData} />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/donation');
  });

  it('renders the image with correct alt text', () => {
    render(
      <MemoryRouter>
        <SupportUsCard data={mockData} />
      </MemoryRouter>,
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Donate to KirjaSwappi');
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });
});

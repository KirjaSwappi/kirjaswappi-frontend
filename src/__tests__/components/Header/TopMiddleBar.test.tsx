import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../data/menu', () => ({
  menu: [
    { id: 1, icon: 'book.svg', value: 'books', route: '/', isRoute: true, isShow: true },
    { id: 2, icon: 'map.svg', value: 'map', route: '/map', isRoute: true, isShow: true },
    {
      id: 3,
      icon: 'msg.svg',
      value: 'messages',
      route: '/user/messages',
      isRoute: true,
      isShow: true,
    },
    { id: 4, icon: 'hidden.svg', value: 'hidden', route: '/hidden', isRoute: true, isShow: false },
  ],
}));

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt?: string }) => <img alt={alt || ''} />,
}));

import TopMiddleBar from '../../../components/Header/_components/TopMiddleBar';

describe('TopMiddleBar', () => {
  const renderComponent = (path = '/') =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <TopMiddleBar />
      </MemoryRouter>,
    );

  it('renders visible menu items', () => {
    renderComponent();
    expect(screen.getByText('books')).toBeInTheDocument();
    expect(screen.getByText('map')).toBeInTheDocument();
    expect(screen.getByText('messages')).toBeInTheDocument();
  });

  it('hides menu items with isShow=false', () => {
    renderComponent();
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });

  it('highlights active route', () => {
    renderComponent('/');
    const booksLink = screen.getByText('books').closest('a');
    expect(booksLink?.className).toContain('bg-white');
  });
});

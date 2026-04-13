import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('react-icons/io5', () => ({
  IoCloseOutline: () => <span>close</span>,
}));

vi.mock('../../../assets/leftArrow.png', () => ({ default: 'leftArrow.png' }));

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

vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt, className }: { alt?: string; className?: string }) => (
    <img alt={alt || ''} className={className} />
  ),
}));

import ProfileSideDrawer from '../../../pages/profile/components/SideDrawer';

describe('Profile SideDrawer', () => {
  const createStore = (open = true) =>
    configureStore({
      reducer: {
        open: (state = { open }) => state,
      },
    });

  it('renders title', () => {
    render(
      <Provider store={createStore()}>
        <ProfileSideDrawer title="Genres">
          <div>content</div>
        </ProfileSideDrawer>
      </Provider>,
    );
    expect(screen.getByText('Genres')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Provider store={createStore()}>
        <ProfileSideDrawer>
          <div data-testid="child">child content</div>
        </ProfileSideDrawer>
      </Provider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders default title when none provided', () => {
    render(
      <Provider store={createStore()}>
        <ProfileSideDrawer>
          <div>c</div>
        </ProfileSideDrawer>
      </Provider>,
    );
    expect(screen.getByText('More Options')).toBeInTheDocument();
  });

  it('shows Save button when isShowSave=true', () => {
    const onSave = vi.fn();
    render(
      <Provider store={createStore()}>
        <ProfileSideDrawer isShowSave onSave={onSave}>
          <div>c</div>
        </ProfileSideDrawer>
      </Provider>,
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('has translate-x-full class when closed', () => {
    const { container } = render(
      <Provider store={createStore(false)}>
        <ProfileSideDrawer>
          <div>c</div>
        </ProfileSideDrawer>
      </Provider>,
    );
    expect(container.firstChild).toHaveClass('translate-x-full');
  });
});

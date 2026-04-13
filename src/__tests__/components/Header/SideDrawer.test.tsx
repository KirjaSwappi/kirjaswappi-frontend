import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import SideDrawer from '../../../components/Header/_components/SideDrawer';

describe('Header SideDrawer', () => {
  it('renders children when open', () => {
    render(
      <SideDrawer open={true}>
        <div data-testid="content">drawer content</div>
      </SideDrawer>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('has opacity-100 class when open', () => {
    const { container } = render(
      <SideDrawer open={true}>
        <div>c</div>
      </SideDrawer>,
    );
    expect(container.firstChild).toHaveClass('opacity-100');
  });

  it('has opacity-0 class when closed', () => {
    const { container } = render(
      <SideDrawer open={false}>
        <div>c</div>
      </SideDrawer>,
    );
    expect(container.firstChild).toHaveClass('opacity-0');
  });

  it('positions on right by default', () => {
    const { container } = render(
      <SideDrawer open={true}>
        <div>c</div>
      </SideDrawer>,
    );
    const inner = container.querySelector('.fixed.top-0');
    expect(inner?.className).toContain('right-0');
  });

  it('positions on left when left=true', () => {
    const { container } = render(
      <SideDrawer open={true} left>
        <div>c</div>
      </SideDrawer>,
    );
    const inner = container.querySelector('.fixed.top-0');
    expect(inner?.className).toContain('left-0');
  });
});

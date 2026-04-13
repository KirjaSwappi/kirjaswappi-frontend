import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../redux/hooks', () => ({
  useAppSelector: () => ({ userInformation: { id: '', email: '', name: '' } }),
}));

import Authenticate from '../../routes/Authenticate';

describe('Authenticate', () => {
  it('renders children when user is not logged in', () => {
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Authenticate>
          <div data-testid="child">Login Page</div>
        </Authenticate>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders children for different auth routes', () => {
    render(
      <MemoryRouter initialEntries={['/auth/register']}>
        <Authenticate>
          <div data-testid="register">Register Page</div>
        </Authenticate>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('register')).toBeInTheDocument();
  });
});

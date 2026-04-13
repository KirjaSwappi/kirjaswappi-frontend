import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Profile from '../../../pages/profile';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Profile Page', () => {
  it('renders as a route outlet wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/profile/settings']}>
        <Routes>
          <Route path="/profile" element={<Profile />}>
            <Route path="settings" element={<div data-testid="child-route">Settings</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('child-route')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders nothing when no child route matches', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />}>
            <Route path="settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(container.innerHTML).not.toContain('Settings');
  });

  it('renders different child routes correctly', () => {
    render(
      <MemoryRouter initialEntries={['/profile/notification']}>
        <Routes>
          <Route path="/profile" element={<Profile />}>
            <Route
              path="notification"
              element={<div data-testid="notification-route">Notifications</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('notification-route')).toBeInTheDocument();
  });
});

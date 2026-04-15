import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../../assets/editGray.png', () => ({ default: 'editGray.png' }));
vi.mock('../../../assets/plus.png', () => ({ default: 'plus.png' }));
vi.mock('../../../components/shared/Button', () => ({
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock('../../../components/shared/Image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import UserActionNavigation from '../../../pages/profile/components/UserActionNavigation';

function renderWithProviders(loading = false) {
  const authReducer = () => ({
    loading,
    error: null,
    message: null,
    success: false,
    userInformation: { id: '1', firstName: '', lastName: '', email: '', books: [] },
    otp: [],
    userEmail: '',
    isVerify: false,
  });
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <UserActionNavigation />
      </MemoryRouter>
    </Provider>,
  );
}

describe('UserActionNavigation', () => {
  it('should render Add Book and Edit Profile buttons', () => {
    renderWithProviders();
    expect(screen.getByText(/profile.addABook/)).toBeInTheDocument();
    expect(screen.getByText(/editProfile.title/)).toBeInTheDocument();
  });

  it('should render icons', () => {
    const { container } = renderWithProviders();
    const icons = container.querySelectorAll('img');
    expect(icons.length).toBe(2);
  });

  it('should show loading skeletons when loading', () => {
    const { container } = renderWithProviders(true);
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBe(2);
  });
});

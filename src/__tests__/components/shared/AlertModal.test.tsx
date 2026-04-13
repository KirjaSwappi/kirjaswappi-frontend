import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import AlertModal from '../../../components/shared/AlertModal';
import { setupTestStore } from '../../utils/test-utils';

const renderWithStore = (
  props: Parameters<typeof AlertModal>[0] = {},
  notificationState: { showAlert: boolean; message?: string },
) => {
  const store = setupTestStore({
    notification: {
      isShow: false,
      messageType: '',
      message: notificationState.message ?? '',
      showAlert: notificationState.showAlert,
      alertMessage: '',
      alertType: '',
      notifications: [],
      unreadCount: 0,
      isNotificationPanelOpen: false,
      wsConnectionStatus: 'disconnected',
    },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <AlertModal {...props} />
      </Provider>,
    ),
  };
};

describe('AlertModal', () => {
  it('is visible when showAlert is true', () => {
    renderWithStore({}, { showAlert: true, message: 'Are you sure?' });
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('is hidden when showAlert is false', () => {
    const { container } = renderWithStore({}, { showAlert: false, message: 'Hidden' });
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveClass('hidden');
  });

  it('renders default title "Leave Page?"', () => {
    renderWithStore({}, { showAlert: true });
    expect(screen.getByText('Leave Page?')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    renderWithStore({ alertTitle: 'Confirm Delete' }, { showAlert: true });
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('calls yes callback when Yes button is clicked', () => {
    const yesFn = vi.fn();
    renderWithStore({ yes: yesFn }, { showAlert: true });
    fireEvent.click(screen.getByText('Yes'));
    expect(yesFn).toHaveBeenCalledOnce();
  });

  it('calls no callback when No button is clicked', () => {
    const noFn = vi.fn();
    renderWithStore({ no: noFn }, { showAlert: true });
    fireEvent.click(screen.getByText('No'));
    expect(noFn).toHaveBeenCalledOnce();
  });

  it('renders custom button labels', () => {
    renderWithStore({ yesBtnValue: 'Confirm', noBtnValue: 'Cancel' }, { showAlert: true });
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('dispatches setAlert(false) when close button is clicked', () => {
    const { store } = renderWithStore({}, { showAlert: true });
    const closeBtn = screen.getByAltText('close').closest('button')!;
    fireEvent.click(closeBtn);
    expect(store.getState().notification.showAlert).toBe(false);
  });
});

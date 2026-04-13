import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import OTP from '../../../components/shared/OTP';
import { setupTestStore } from '../../utils/test-utils';

const renderOTP = (props: Parameters<typeof OTP>[0] = {}, otp: string[] = Array(6).fill('')) => {
  const store = setupTestStore({
    auth: {
      loading: false,
      error: null,
      message: null,
      success: false,
      userInformation: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        streetName: null,
        houseNumber: null,
        zipCode: 0,
        city: null,
        country: null,
        phoneNumber: null,
        aboutMe: null,
        favGenres: [],
        books: [],
      },
      otp,
      userEmail: '',
      isVerify: false,
    },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <OTP {...props} />
      </Provider>,
    ),
  };
};

describe('OTP', () => {
  it('renders 6 input fields', () => {
    renderOTP();
    const inputs = screen.getAllByPlaceholderText('-');
    expect(inputs).toHaveLength(6);
  });

  it('updates OTP value on digit input', () => {
    const { store } = renderOTP();
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    expect(store.getState().auth.otp[0]).toBe('5');
  });

  it('moves focus to next input after entering a digit', () => {
    renderOTP();
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[1]).toHaveFocus();
  });

  it('moves focus to previous input on backspace when empty', () => {
    renderOTP({}, ['1', '', '', '', '', '']);
    const inputs = screen.getAllByPlaceholderText('-');
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });
    expect(inputs[0]).toHaveFocus();
  });

  it('handles paste of 6-digit code', () => {
    const { store } = renderOTP();
    const inputs = screen.getAllByPlaceholderText('-');
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => '123456' },
    });
    expect(store.getState().auth.otp).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('shows error message when error prop is provided', () => {
    renderOTP({ error: 'Invalid OTP' });
    expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
  });

  it('does not show error message when otpMessageShow is false', () => {
    renderOTP({ otpMessageShow: false, error: 'Invalid OTP' });
    expect(screen.queryByText('Invalid OTP')).not.toBeInTheDocument();
  });
});

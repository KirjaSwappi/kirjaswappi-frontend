import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../utils/test-utils';
import MessageToastify from '../../../components/shared/MessageToastify';

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe('MessageToastify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders message when isShow is true', () => {
    renderWithProviders(<MessageToastify type="SUCCESS" value="Login successful" isShow={true} />);
    expect(screen.getByText('Login successful')).toBeInTheDocument();
  });

  it('hides message when isShow is false', () => {
    renderWithProviders(<MessageToastify type="SUCCESS" value="Login successful" isShow={false} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('hidden');
  });

  it('applies success color class', () => {
    renderWithProviders(<MessageToastify type="SUCCESS" value="Done" isShow={true} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-100');
    expect(alert).toHaveClass('text-green-600');
  });

  it('applies error color class', () => {
    renderWithProviders(<MessageToastify type="ERROR" value="Failed" isShow={true} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-rose-100');
    expect(alert).toHaveClass('text-rose-600');
  });

  it('applies warning color class', () => {
    renderWithProviders(<MessageToastify type="WARNING" value="Careful" isShow={true} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-100');
    expect(alert).toHaveClass('text-yellow-600');
  });

  it('applies no color class for unknown type', () => {
    renderWithProviders(<MessageToastify type="" value="Unknown" isShow={true} />);
    const alert = screen.getByRole('alert');
    expect(alert).not.toHaveClass('bg-green-100');
    expect(alert).not.toHaveClass('bg-rose-100');
    expect(alert).not.toHaveClass('bg-yellow-100');
  });

  it('has aria-live attribute for accessibility', () => {
    renderWithProviders(<MessageToastify type="SUCCESS" value="Done" isShow={true} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});

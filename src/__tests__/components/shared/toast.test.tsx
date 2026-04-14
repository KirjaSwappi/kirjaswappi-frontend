import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import { showToast } from '../../../components/shared/toast';

vi.mock('react-toastify', () => ({
  toast: vi.fn(),
}));

describe('showToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls toast with success styling', () => {
    showToast('success', 'Operation successful');
    expect(toast).toHaveBeenCalledWith(
      'Operation successful',
      expect.objectContaining({
        position: 'bottom-left',
      }),
    );
  });

  it('calls toast with error styling', () => {
    showToast('error', 'Something went wrong');
    expect(toast).toHaveBeenCalledWith(
      'Something went wrong',
      expect.objectContaining({
        position: 'bottom-left',
      }),
    );
  });

  it('applies success className', () => {
    showToast('success', 'Done');
    const call = (toast as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[1].className).toContain('bg-primary');
  });

  it('applies error className', () => {
    showToast('error', 'Failed');
    const call = (toast as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[1].className).toContain('bg-[#EA244E]');
  });

  it('includes font-poppins styling', () => {
    showToast('success', 'Test');
    const call = (toast as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[1].className).toContain('font-poppins');
  });
});

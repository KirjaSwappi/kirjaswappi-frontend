import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSwapModal } from '../../hooks/useSwapModal';

// Mock Redux hooks
const mockDispatch = vi.fn();
const mockUseAppDispatch = vi.fn(() => mockDispatch);
const mockUseAppSelector = vi.fn();

vi.mock('../../redux/hooks', () => ({
  useAppDispatch: () => mockUseAppDispatch(),
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}));

// Mock Redux actions
vi.mock('../../redux/feature/swap/swapSlice', () => ({
  setSwapModal: vi.fn((value: boolean) => ({ type: 'swap/setSwapModal', payload: value })),
}));

import { setSwapModal } from '../../redux/feature/swap/swapSlice';

describe('useSwapModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return swap modal state and control functions', () => {
    mockUseAppSelector.mockReturnValue(false);

    const { result } = renderHook(() => useSwapModal());

    expect(result.current.swapModalOpen).toBe(false);
    expect(result.current.setSwapModalOpen).toBeInstanceOf(Function);
    expect(result.current.openSwapModal).toBeInstanceOf(Function);
    expect(result.current.closeSwapModal).toBeInstanceOf(Function);
    expect(result.current.toggleSwapModal).toBeInstanceOf(Function);
  });

  it('should reflect the current swap modal state from Redux', () => {
    mockUseAppSelector.mockReturnValue(true);

    const { result } = renderHook(() => useSwapModal());

    expect(result.current.swapModalOpen).toBe(true);
  });

  it('should dispatch setSwapModal with true when openSwapModal is called', () => {
    mockUseAppSelector.mockReturnValue({ swapModalOpen: false });

    const { result } = renderHook(() => useSwapModal());

    act(() => {
      result.current.openSwapModal();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));
  });

  it('should dispatch setSwapModal with false when closeSwapModal is called', () => {
    mockUseAppSelector.mockReturnValue({ swapModalOpen: true });

    const { result } = renderHook(() => useSwapModal());

    act(() => {
      result.current.closeSwapModal();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(false));
  });

  it('should dispatch setSwapModal with provided value when setSwapModalOpen is called', () => {
    mockUseAppSelector.mockReturnValue({ swapModalOpen: false });

    const { result } = renderHook(() => useSwapModal());

    act(() => {
      result.current.setSwapModalOpen(true);
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));

    act(() => {
      result.current.setSwapModalOpen(false);
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(false));
  });

  it('should toggle modal from false to true when toggleSwapModal is called', () => {
    mockUseAppSelector.mockReturnValue(false);

    const { result } = renderHook(() => useSwapModal());

    act(() => {
      result.current.toggleSwapModal();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));
  });

  it('should toggle modal from true to false when toggleSwapModal is called', () => {
    mockUseAppSelector.mockReturnValue(true);

    const { result } = renderHook(() => useSwapModal());

    act(() => {
      result.current.toggleSwapModal();
    });

    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(false));
  });

  it('should handle multiple operations correctly', () => {
    let modalState = false;
    mockUseAppSelector.mockImplementation(() => modalState);

    const { result, rerender } = renderHook(() => useSwapModal());

    // Open modal
    act(() => {
      result.current.openSwapModal();
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));

    // Toggle (should close) - update state and rerender
    modalState = true;
    rerender();
    act(() => {
      result.current.toggleSwapModal();
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(false));

    // Set explicitly to true
    act(() => {
      result.current.setSwapModalOpen(true);
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(true));

    // Close
    act(() => {
      result.current.closeSwapModal();
    });
    expect(mockDispatch).toHaveBeenCalledWith(setSwapModal(false));
  });

  it('should memoize functions with useCallback', () => {
    mockUseAppSelector.mockReturnValue(false);

    const { result, rerender } = renderHook(() => useSwapModal());

    const firstFunctions = {
      setSwapModalOpen: result.current.setSwapModalOpen,
      openSwapModal: result.current.openSwapModal,
      closeSwapModal: result.current.closeSwapModal,
      toggleSwapModal: result.current.toggleSwapModal,
    };

    // Rerender should return the same function references due to useCallback
    rerender();
    const secondFunctions = {
      setSwapModalOpen: result.current.setSwapModalOpen,
      openSwapModal: result.current.openSwapModal,
      closeSwapModal: result.current.closeSwapModal,
      toggleSwapModal: result.current.toggleSwapModal,
    };

    expect(firstFunctions.setSwapModalOpen).toBe(secondFunctions.setSwapModalOpen);
    expect(firstFunctions.openSwapModal).toBe(secondFunctions.openSwapModal);
    expect(firstFunctions.closeSwapModal).toBe(secondFunctions.closeSwapModal);
    expect(firstFunctions.toggleSwapModal).toBe(secondFunctions.toggleSwapModal);
  });

  it('should update toggleSwapModal function when modal state changes', () => {
    let modalState = false;
    mockUseAppSelector.mockImplementation(() => modalState);

    const { result, rerender } = renderHook(() => useSwapModal());

    const toggleWhenClosed = result.current.toggleSwapModal;

    // Change state and rerender
    modalState = true;
    rerender();

    const toggleWhenOpen = result.current.toggleSwapModal;

    // Function should be different due to useCallback dependency change
    expect(toggleWhenClosed).not.toBe(toggleWhenOpen);
  });
});
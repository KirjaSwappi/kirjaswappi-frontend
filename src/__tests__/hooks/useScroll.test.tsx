import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useScroll from '../../hooks/useScroll';

describe('useScroll', () => {
  let scrollEvent: Event;
  let originalScrollY: number;

  beforeEach(() => {
    // Store original scrollY
    originalScrollY = window.scrollY;

    // Create a scroll event
    scrollEvent = new Event('scroll', { bubbles: false });

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    // Restore original scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: originalScrollY,
    });
    vi.restoreAllMocks();
  });

  it('should initialize with scrolled as false', () => {
    const { result } = renderHook(() => useScroll());

    expect(result.current.scrolled).toBe(false);
  });

  it('should set scrolled to true when scrollY is greater than 70', () => {
    const { result } = renderHook(() => useScroll());

    // Set scrollY to 71
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 71,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(true);
  });

  it('should set scrolled to false when scrollY is less than or equal to 70', () => {
    const { result } = renderHook(() => useScroll());

    // First scroll beyond 70
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 71,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(true);

    // Then scroll back to 70
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 70,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(false);
  });

  it('should set scrolled to false when scrollY is exactly 70', () => {
    const { result } = renderHook(() => useScroll());

    // Set scrollY to exactly 70
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 70,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(false);
  });

  it('should set scrolled to false when scrollY is 0', () => {
    const { result } = renderHook(() => useScroll());

    // Set scrollY to 0
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(false);
  });

  it('should handle multiple scroll events correctly', () => {
    const { result } = renderHook(() => useScroll());

    // Scroll to 50 (should be false)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 50,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(false);

    // Scroll to 80 (should be true)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 80,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(true);

    // Scroll to 60 (should be false)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 60,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(false);
  });

  it('should handle edge case values', () => {
    const { result } = renderHook(() => useScroll());

    // Test with 69 (should be false)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 69,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(false);

    // Test with 71 (should be true)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 71,
    });

    act(() => {
      window.dispatchEvent(scrollEvent);
    });

    expect(result.current.scrolled).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScroll());

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should handle rapid scroll changes', () => {
    const { result } = renderHook(() => useScroll());

    // Rapidly change scroll positions
    const positions = [0, 50, 100, 30, 80, 10];

    positions.forEach((position) => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        value: position,
      });

      act(() => {
        window.dispatchEvent(scrollEvent);
      });

      const expected = position > 70;
      expect(result.current.scrolled).toBe(expected);
    });
  });
});

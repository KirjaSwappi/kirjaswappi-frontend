import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, type MockInstance } from 'vitest';
import { useIsMobile } from '../../hooks/useIsMobile';

describe('useIsMobile', () => {
  let mockInnerWidth: number;
  let addEventListenerSpy: MockInstance;
  let removeEventListenerSpy: MockInstance;

  beforeEach(() => {
    // Mock window.innerWidth
    mockInnerWidth = 1024;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: mockInnerWidth,
    });

    // Mock event listeners
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize as false when window width is greater than or equal to breakpoint', () => {
    mockInnerWidth = 1024;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockInnerWidth,
    });

    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(false);
  });

  it('should initialize as true when window width is less than breakpoint', () => {
    mockInnerWidth = 768;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockInnerWidth,
    });

    const { result } = renderHook(() => useIsMobile(1024));
    expect(result.current).toBe(true);
  });

  it('should use default breakpoint of 1024 when no breakpoint provided', () => {
    mockInnerWidth = 800;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockInnerWidth,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should add resize event listener on mount', () => {
    renderHook(() => useIsMobile());
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should remove resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should update isMobile when window is resized', () => {
    mockInnerWidth = 1200; // Start with desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockInnerWidth,
    });

    const { result } = renderHook(() => useIsMobile(1024));

    expect(result.current).toBe(false);

    // Simulate resize to mobile width
    act(() => {
      mockInnerWidth = 768;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: mockInnerWidth,
      });

      // Trigger the resize event
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    });

    expect(result.current).toBe(true);
  });

  it('should handle multiple resizes correctly', () => {
    mockInnerWidth = 800; // Start with mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockInnerWidth,
    });

    const { result } = renderHook(() => useIsMobile(1024));

    expect(result.current).toBe(true);

    // Resize to desktop
    act(() => {
      mockInnerWidth = 1200;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: mockInnerWidth,
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(false);

    // Resize back to mobile
    act(() => {
      mockInnerWidth = 600;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: mockInnerWidth,
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true);
  });

  it('should work with custom breakpoint', () => {
    mockInnerWidth = 800;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: mockInnerWidth,
    });

    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false); // 800 > 768, so not mobile

    act(() => {
      mockInnerWidth = 700;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: mockInnerWidth,
      });
      window.dispatchEvent(new Event('resize'));
    });
    expect(result.current).toBe(true); // 700 < 768, so mobile
  });

  it('should re-attach event listener when breakpoint changes', () => {
    const { rerender } = renderHook(({ breakpoint }) => useIsMobile(breakpoint), {
      initialProps: { breakpoint: 1024 },
    });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    // Change breakpoint
    rerender({ breakpoint: 768 });

    // Should have removed old listener and added new one
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});

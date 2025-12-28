import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSkeleton } from '../../hooks/useSkeleton';

describe('useSkeleton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with showSkeleton as true', () => {
    const { result } = renderHook(() => useSkeleton());

    expect(result.current.showSkeleton).toBe(true);
  });

  it('should set showSkeleton to false after 1 second', () => {
    const { result } = renderHook(() => useSkeleton());

    // Initially true
    expect(result.current.showSkeleton).toBe(true);

    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.showSkeleton).toBe(false);
  });

  it('should not change showSkeleton before 1 second', () => {
    const { result } = renderHook(() => useSkeleton());

    // Check at 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.showSkeleton).toBe(true);

    // Check at 999ms
    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current.showSkeleton).toBe(true);
  });

  it('should handle multiple timer advances correctly', () => {
    const { result } = renderHook(() => useSkeleton());

    // Advance in steps
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.showSkeleton).toBe(true);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current.showSkeleton).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.showSkeleton).toBe(false);
  });

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useSkeleton());

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should not set showSkeleton to false if unmounted before timeout', () => {
    const { result, unmount } = renderHook(() => useSkeleton());

    // Unmount before timeout
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.showSkeleton).toBe(true);

    unmount();

    // Advance remaining time - should not cause state update since component is unmounted
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // State should still be true since component was unmounted
    expect(result.current.showSkeleton).toBe(true);
  });

  it('should work correctly with real timers', () => {
    vi.useRealTimers();

    const { result } = renderHook(() => useSkeleton());

    expect(result.current.showSkeleton).toBe(true);

    // Wait for more than 1 second
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(result.current.showSkeleton).toBe(false);
        resolve(void 0);
      }, 1100);
    });
  });

  it('should handle rapid re-mounts', () => {
    // Test that each mount gets its own timer
    const { result: result1, unmount: unmount1 } = renderHook(() => useSkeleton());
    const { result: result2, unmount: unmount2 } = renderHook(() => useSkeleton());

    expect(result1.current.showSkeleton).toBe(true);
    expect(result2.current.showSkeleton).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result1.current.showSkeleton).toBe(false);
    expect(result2.current.showSkeleton).toBe(false);

    unmount1();
    unmount2();
  });
});

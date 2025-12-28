import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useDebounce from '../../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value update', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // Initial value should be returned immediately
    expect(result.current).toBe('initial');

    // Update the value
    act(() => {
      rerender({ value: 'updated', delay: 500 });
    });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time to complete the delay
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now the debounced value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset the timer when value changes before delay expires', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    // Start the debounce with 'first'
    act(() => {
      rerender({ value: 'first', delay: 500 });
    });

    // Advance 300ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should still be 'first'
    expect(result.current).toBe('first');

    // Now change to 'second' - this should reset the timer
    act(() => {
      rerender({ value: 'second', delay: 500 });
    });

    // Advance another 499ms (total would be 799ms, but timer was reset)
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // Value should still be 'first' because timer was reset
    expect(result.current).toBe('first');

    // Advance 1 more ms to complete the new delay
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Now value should be 'second'
    expect(result.current).toBe('second');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 1000 },
    });

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'updated', delay: 1000 });
    });

    // Advance 999ms
    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(result.current).toBe('initial');

    // Advance 1 more ms
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe('updated');
  });
});

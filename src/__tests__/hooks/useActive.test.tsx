import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useActive } from '../../hooks/useActive';

describe('useActive', () => {
  it('should initialize with active as false', () => {
    const { result } = renderHook(() => useActive());

    expect(result.current.active).toBe(false);
  });

  it('should allow setting active state directly', () => {
    const { result } = renderHook(() => useActive());

    expect(result.current.active).toBe(false);

    act(() => {
      result.current.setActive(true);
    });

    expect(result.current.active).toBe(true);

    act(() => {
      result.current.setActive(false);
    });

    expect(result.current.active).toBe(false);
  });

  it('should toggle active state with handleToggle', () => {
    const { result } = renderHook(() => useActive());

    expect(result.current.active).toBe(false);

    act(() => {
      result.current.handleToggle();
    });

    expect(result.current.active).toBe(true);

    act(() => {
      result.current.handleToggle();
    });

    expect(result.current.active).toBe(false);
  });

  it('should handle multiple toggles correctly', () => {
    const { result } = renderHook(() => useActive());

    // Start: false
    expect(result.current.active).toBe(false);

    // Toggle 1: true
    act(() => {
      result.current.handleToggle();
    });
    expect(result.current.active).toBe(true);

    // Toggle 2: false
    act(() => {
      result.current.handleToggle();
    });
    expect(result.current.active).toBe(false);

    // Toggle 3: true
    act(() => {
      result.current.handleToggle();
    });
    expect(result.current.active).toBe(true);

    // Toggle 4: false
    act(() => {
      result.current.handleToggle();
    });
    expect(result.current.active).toBe(false);
  });

  it('should allow mixing setActive and handleToggle', () => {
    const { result } = renderHook(() => useActive());

    // Start with setActive
    act(() => {
      result.current.setActive(true);
    });
    expect(result.current.active).toBe(true);

    // Then toggle
    act(() => {
      result.current.handleToggle();
    });
    expect(result.current.active).toBe(false);

    // Set to true again
    act(() => {
      result.current.setActive(true);
    });
    expect(result.current.active).toBe(true);

    // Toggle again
    act(() => {
      result.current.handleToggle();
    });
    expect(result.current.active).toBe(false);
  });
});

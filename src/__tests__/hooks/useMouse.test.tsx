import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMouseClick } from '../../hooks/useMouse';

describe('useMouseClick', () => {
  let mockCallback: vi.MockedFunction<() => void>;
  let addEventListenerSpy: vi.SpyInstance;
  let removeEventListenerSpy: vi.SpyInstance;
  let eventHandler: (event: MouseEvent) => void;

  beforeEach(() => {
    mockCallback = vi.fn();
    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    // Capture the event handler when it's added
    addEventListenerSpy.mockImplementation((event, handler) => {
      if (event === 'mousedown') {
        eventHandler = handler as (event: MouseEvent) => void;
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMouseClick());

    expect(result.current.clicked).toBe(false);
    expect(result.current.reference.current).toBeNull();
  });

  it('should call onOutsideClick and set clicked to false when clicking outside the referenced element', () => {
    const { result } = renderHook(() => useMouseClick(mockCallback));

    // Set up the reference
    const mockElement = document.createElement('div');
    act(() => {
      (result.current.reference as any).current = mockElement;
    });

    // Set clicked to true initially
    act(() => {
      result.current.setClicked(true);
    });

    expect(result.current.clicked).toBe(true);

    // Create a click event outside the element
    const outsideElement = document.createElement('div');
    const outsideClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(outsideClickEvent, 'target', { value: outsideElement });

    // Mock contains to return false (outside)
    mockElement.contains = vi.fn(() => false);

    act(() => {
      eventHandler(outsideClickEvent);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result.current.clicked).toBe(false);
  });

  it('should not call onOutsideClick when clicking inside the referenced element', () => {
    const { result } = renderHook(() => useMouseClick(mockCallback));

    // Set up the reference
    const mockElement = document.createElement('div');
    act(() => {
      (result.current.reference as any).current = mockElement;
    });

    // Create a click event inside the element
    const insideClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(insideClickEvent, 'target', { value: mockElement });

    // Mock contains to return true (inside)
    mockElement.contains = vi.fn(() => true);

    act(() => {
      eventHandler(insideClickEvent);
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call onOutsideClick when clicking on a button element', () => {
    const { result } = renderHook(() => useMouseClick(mockCallback));

    // Set up the reference
    const mockElement = document.createElement('div');
    act(() => {
      (result.current.reference as any).current = mockElement;
    });

    // Create a button element and click event
    const buttonElement = document.createElement('button');
    const buttonClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(buttonClickEvent, 'target', { value: buttonElement });

    // Mock contains to return false (outside)
    mockElement.contains = vi.fn(() => false);

    act(() => {
      eventHandler(buttonClickEvent);
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should allow manual setting of clicked state', () => {
    const { result } = renderHook(() => useMouseClick());

    expect(result.current.clicked).toBe(false);

    act(() => {
      result.current.setClicked(true);
    });

    expect(result.current.clicked).toBe(true);

    act(() => {
      result.current.setClicked(false);
    });

    expect(result.current.clicked).toBe(false);
  });

  it('should handle null reference gracefully', () => {
    const { result } = renderHook(() => useMouseClick(mockCallback));

    // Ensure reference is null
    expect(result.current.reference.current).toBeNull();

    // Create a click event
    const clickEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(clickEvent, 'target', { value: document.body });

    act(() => {
      eventHandler(clickEvent);
    });

    // Should not crash and callback should not be called since reference is null
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should work without onOutsideClick callback', () => {
    const { result } = renderHook(() => useMouseClick());

    // Set up the reference
    const mockElement = document.createElement('div');
    act(() => {
      (result.current.reference as any).current = mockElement;
    });

    // Set clicked to true
    act(() => {
      result.current.setClicked(true);
    });

    // Create a click event outside
    const outsideElement = document.createElement('div');
    const outsideClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
    });
    Object.defineProperty(outsideClickEvent, 'target', { value: outsideElement });

    // Mock contains to return false
    mockElement.contains = vi.fn(() => false);

    act(() => {
      eventHandler(outsideClickEvent);
    });

    // Should not crash and clicked should be false
    expect(result.current.clicked).toBe(false);
  });

  it('should clean up event listeners on unmount', () => {
    const { unmount } = renderHook(() => useMouseClick(mockCallback));

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });

  it('should update event listener when onOutsideClick changes', () => {
    const { rerender } = renderHook(({ callback }) => useMouseClick(callback), {
      initialProps: { callback: mockCallback },
    });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

    const newCallback = vi.fn();
    rerender({ callback: newCallback });

    // Should have removed the old listener and added a new one
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  });
});
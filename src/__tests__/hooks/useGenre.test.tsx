import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGenre } from '../../hooks/useGenre';

describe('useGenre', () => {
  it('should initialize with empty genreName', () => {
    const { result } = renderHook(() => useGenre());
    expect(result.current.genreName).toBe('');
  });

  it('should allow setting genreName', () => {
    const { result } = renderHook(() => useGenre());

    act(() => {
      result.current.setGenreName('Fiction');
    });

    expect(result.current.genreName).toBe('Fiction');
  });

  it('should update genreName when set multiple times', () => {
    const { result } = renderHook(() => useGenre());

    act(() => {
      result.current.setGenreName('Fiction');
    });
    expect(result.current.genreName).toBe('Fiction');

    act(() => {
      result.current.setGenreName('Non-Fiction');
    });
    expect(result.current.genreName).toBe('Non-Fiction');

    act(() => {
      result.current.setGenreName('Science Fiction');
    });
    expect(result.current.genreName).toBe('Science Fiction');
  });

  it('should handle empty string updates', () => {
    const { result } = renderHook(() => useGenre());

    act(() => {
      result.current.setGenreName('Fiction');
    });
    expect(result.current.genreName).toBe('Fiction');

    act(() => {
      result.current.setGenreName('');
    });
    expect(result.current.genreName).toBe('');
  });

  it('should handle special characters and unicode', () => {
    const { result } = renderHook(() => useGenre());

    act(() => {
      result.current.setGenreName('Sci-Fi & Fantasy');
    });
    expect(result.current.genreName).toBe('Sci-Fi & Fantasy');

    act(() => {
      result.current.setGenreName('历史小说'); // Chinese characters
    });
    expect(result.current.genreName).toBe('历史小说');
  });
});
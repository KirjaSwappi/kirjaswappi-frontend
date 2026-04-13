import { describe, it, expect } from 'vitest';
import { cn } from '../../utility/cn';

describe('cn utility', () => {
  it('merges multiple class strings', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra');
  });

  it('resolves tailwind conflicts with last value winning', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles undefined and null inputs', () => {
    expect(cn('base', undefined, null, 'extra')).toBe('base extra');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles array inputs', () => {
    expect(cn(['px-2', 'py-1'])).toBe('px-2 py-1');
  });
});

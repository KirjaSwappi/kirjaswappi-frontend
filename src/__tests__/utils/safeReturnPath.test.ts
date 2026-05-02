import { describe, expect, it } from 'vitest';
import { safeReturnPath } from '../../utility/safeReturnPath';

describe('safeReturnPath', () => {
  it('returns / for null or empty input', () => {
    expect(safeReturnPath(null)).toBe('/');
    expect(safeReturnPath(undefined)).toBe('/');
    expect(safeReturnPath('')).toBe('/');
  });

  it('accepts valid internal paths', () => {
    expect(safeReturnPath('/books')).toBe('/books');
    expect(safeReturnPath('/profile/abc?foo=bar')).toBe('/profile/abc?foo=bar');
    expect(safeReturnPath('/books/123#section')).toBe('/books/123#section');
  });

  it('rejects protocol-relative URLs', () => {
    expect(safeReturnPath('//evil.com')).toBe('/');
    expect(safeReturnPath('//evil.com/path')).toBe('/');
  });

  it('rejects backslash-based bypass', () => {
    expect(safeReturnPath('/\\evil.com')).toBe('/');
    expect(safeReturnPath('/\\\\evil.com')).toBe('/');
  });

  it('rejects scheme-based redirects', () => {
    expect(safeReturnPath('https://evil.com')).toBe('/');
    expect(safeReturnPath('javascript:alert(1)')).toBe('/');
    expect(safeReturnPath('data:text/html,<script>alert(1)</script>')).toBe('/');
  });

  it('rejects paths with control characters', () => {
    expect(safeReturnPath('/path\x00evil')).toBe('/');
    expect(safeReturnPath('/path\x0d\x0aevil')).toBe('/');
  });

  it('rejects encoded double-slash', () => {
    expect(safeReturnPath('%2f%2fevil.com')).toBe('/');
  });

  it('rejects paths not starting with /', () => {
    expect(safeReturnPath('evil.com/path')).toBe('/');
    expect(safeReturnPath('relative/path')).toBe('/');
  });

  it('returns / on malformed URI encoding', () => {
    expect(safeReturnPath('%E0%A4%A')).toBe('/');
  });
});

import { describe, it, expect } from 'vitest';

import { getGenreIcon, defaultGenreIcon } from '../../../../components/Header/_components/BookFilter/genreIcons';

describe('getGenreIcon', () => {
  it('returns an icon for Fiction', () => {
    expect(getGenreIcon('Fiction')).toBeDefined();
    expect(getGenreIcon('Fiction')).not.toBe(defaultGenreIcon);
  });

  it('returns an icon for Adventure', () => {
    expect(getGenreIcon('Adventure')).toBeDefined();
    expect(getGenreIcon('Adventure')).not.toBe(defaultGenreIcon);
  });

  it('returns an icon for Non-Fiction', () => {
    expect(getGenreIcon('Non-Fiction')).toBeDefined();
    expect(getGenreIcon('Non-Fiction')).not.toBe(defaultGenreIcon);
  });

  it('returns default icon for unknown genre', () => {
    expect(getGenreIcon('UnknownGenre')).toBe(defaultGenreIcon);
  });
});

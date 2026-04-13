import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../../assets/Adventure.svg', () => ({ default: 'adventure.svg' }));
vi.mock('../../../../assets/FictionIcon.svg', () => ({ default: 'fiction.svg' }));
vi.mock('../../../../assets/Non-Fiction.svg', () => ({ default: 'nonfiction.svg' }));

import { genreIcons } from '../../../../components/Header/_components/BookFilter/genreIcons';

describe('genreIcons', () => {
  it('has Fiction icon', () => {
    expect(genreIcons['Fiction']).toBeDefined();
  });

  it('has Adventure icon', () => {
    expect(genreIcons['Adventure']).toBeDefined();
  });

  it('has Non-Fiction icon', () => {
    expect(genreIcons['Non-Fiction']).toBeDefined();
  });
});

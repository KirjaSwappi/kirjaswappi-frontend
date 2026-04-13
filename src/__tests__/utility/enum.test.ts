import { describe, it, expect } from 'vitest';
import { FilterItemEnum, SortByEnum } from '../../utility/enum';

describe('FilterItemEnum', () => {
  it('has CATEGORY value', () => {
    expect(FilterItemEnum.CATEGORY).toBe('CATEGORY');
  });

  it('has FILTER value', () => {
    expect(FilterItemEnum.FILTER).toBe('FILTER');
  });

  it('has SORTBY value', () => {
    expect(FilterItemEnum.SORTBY).toBe('SORTBY');
  });
});

describe('SortByEnum', () => {
  it('has title value', () => {
    expect(SortByEnum.title).toBe('title');
  });

  it('has author value', () => {
    expect(SortByEnum.author).toBe('author');
  });

  it('has language value', () => {
    expect(SortByEnum.language).toBe('language');
  });

  it('has condition value', () => {
    expect(SortByEnum.condition).toBe('condition');
  });
});

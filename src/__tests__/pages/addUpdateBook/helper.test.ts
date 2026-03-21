import { describe, it, expect } from 'vitest';
import { buildFormData } from '../../../../src/pages/addUpdateBook/helper';
import type { IAddUpdateBook } from '../../../../src/pages/addUpdateBook/types/interface';
import { SwapType } from '../../../../types/enum';

describe('buildFormData helper', () => {
  it('should append genres independently instead of comma-separating', async () => {
    const mockBookData: IAddUpdateBook = {
      title: 'Test Title',
      author: 'Test Author',
      description: 'Test Description',
      language: 'English',
      condition: 'NEW',
      genres: ['Fiction', 'Adventure'],
      coverPhotos: [],
      swapType: SwapType.OPENTOOFFERS,
      swappableBooks: [],
      swappableGenres: [],
      address: null,
    };

    const formData = await buildFormData(mockBookData, 'user-123', 'book-456');

    expect(formData.get('title')).toBe('Test Title');
    expect(formData.get('author')).toBe('Test Author');

    // FormData.getAll should return array with two elements for genres
    const appendedGenres = formData.getAll('genres');
    expect(appendedGenres).toEqual(['Fiction', 'Adventure']);
  });
});

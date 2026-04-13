import { describe, it, expect } from 'vitest';
import { buildFormData, getDefaultValues, SWAP_TYPES } from '../../../pages/addUpdateBook/helper';
import type { IAddUpdateBook } from '../../../pages/addUpdateBook/types/interface';
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

  it('appends ownerId and bookId', async () => {
    const mockBookData: IAddUpdateBook = {
      title: 'T',
      author: 'A',
      description: '',
      language: 'en',
      condition: 'Good',
      genres: [],
      coverPhotos: [],
      swapType: SwapType.GIVEAWAY,
      swappableBooks: [],
      swappableGenres: [],
      address: null,
    };

    const formData = await buildFormData(mockBookData, 'owner1', 'book1');
    expect(formData.get('ownerId')).toBe('owner1');
    expect(formData.get('id')).toBe('book1');
  });

  it('appends location when address provided', async () => {
    const mockBookData: IAddUpdateBook = {
      title: 'T',
      author: 'A',
      description: '',
      language: 'en',
      condition: 'Good',
      genres: [],
      coverPhotos: [],
      swapType: SwapType.GIVEAWAY,
      swappableBooks: [],
      swappableGenres: [],
      address: {
        latitude: 60,
        longitude: 24,
        address: 'Helsinki',
        city: 'Helsinki',
        country: 'Finland',
        postalCode: '00100',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    };

    const formData = await buildFormData(mockBookData);
    expect(formData.get('location')).toBeTruthy();
  });

  it('handles ByGenres swap type', async () => {
    const mockBookData: IAddUpdateBook = {
      title: 'T',
      author: 'A',
      description: '',
      language: 'en',
      condition: 'Good',
      genres: [],
      coverPhotos: [],
      swapType: SwapType.BYGENRES,
      swappableBooks: [],
      swappableGenres: ['Fiction', 'Drama'],
      address: null,
    };

    const formData = await buildFormData(mockBookData);
    const condition = JSON.parse(formData.get('swapCondition') as string);
    expect(condition.genres).toBe('Fiction,Drama');
  });
});

describe('getDefaultValues', () => {
  it('returns defaults when no bookData', () => {
    const result = getDefaultValues();
    expect(result.title).toBe('');
    expect(result.author).toBe('');
    expect(result.swapType).toBe(SwapType.BYBOOKS);
    expect(result.swappableBooks).toEqual([
      { id: '', title: '', author: '', coverPhoto: null, flag: false },
    ]);
    expect(result.swappableGenres).toEqual([]);
  });

  it('uses bookData values when provided', () => {
    const bookData = {
      title: 'Test Book',
      author: 'Author',
      description: 'Desc',
      language: 'English',
      condition: 'Good',
      genres: ['Fiction'],
      coverPhotoUrls: ['url1'],
      swapCondition: {
        swapType: 'OpenForOffers',
        swappableBooks: [],
        swappableGenres: [],
      },
      location: {
        latitude: 60,
        longitude: 24,
        address: 'Helsinki',
        city: 'Helsinki',
        country: 'Finland',
        postalCode: '00100',
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getDefaultValues(bookData as any);
    expect(result.title).toBe('Test Book');
    expect(result.swapType).toBe(SwapType.OPENTOOFFERS);
  });

  it('parses swappable books from bookData', () => {
    const bookData = {
      swapCondition: {
        swapType: 'ByBooks',
        swappableBooks: [{ id: '1', title: 'B1', author: 'A1', coverPhotoUrl: 'url' }],
        swappableGenres: [],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getDefaultValues(bookData as any);
    expect(result.swappableBooks[0].title).toBe('B1');
    expect(result.swappableBooks[0].flag).toBe(true);
  });

  it('parses swappable genres from bookData', () => {
    const bookData = {
      swapCondition: {
        swapType: 'ByGenres',
        swappableBooks: [],
        swappableGenres: [{ name: 'Fiction' }, { name: 'Drama' }],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getDefaultValues(bookData as any);
    expect(result.swappableGenres).toEqual(['Fiction', 'Drama']);
  });

  it('falls back to BYBOOKS for invalid swapType', () => {
    const bookData = {
      swapCondition: {
        swapType: 'InvalidType',
        swappableBooks: [],
        swappableGenres: [],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = getDefaultValues(bookData as any);
    expect(result.swapType).toBe(SwapType.BYBOOKS);
  });
});

describe('SWAP_TYPES', () => {
  it('has 4 entries', () => {
    expect(SWAP_TYPES).toHaveLength(4);
  });

  it('includes all swap types', () => {
    const values = SWAP_TYPES.map((t) => t.value);
    expect(values).toContain(SwapType.OPENTOOFFERS);
    expect(values).toContain(SwapType.BYBOOKS);
    expect(values).toContain(SwapType.BYGENRES);
    expect(values).toContain(SwapType.GIVEAWAY);
  });
});

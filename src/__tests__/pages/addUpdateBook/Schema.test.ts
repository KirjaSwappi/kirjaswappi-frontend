import { describe, it, expect } from 'vitest';

import { validationSchemas } from '../../../pages/addUpdateBook/Schema';

describe('addUpdateBook validation schemas', () => {
  const [bookDetails, otherDetails, conditionDetails] = validationSchemas;

  describe('bookDetails', () => {
    it('requires title', async () => {
      await expect(bookDetails.validateAt('title', { title: '' })).rejects.toThrow(
        'Book title is required',
      );
    });

    it('requires author', async () => {
      await expect(bookDetails.validateAt('author', { author: '' })).rejects.toThrow(
        'Author name is required',
      );
    });

    it('requires language', async () => {
      await expect(bookDetails.validateAt('language', { language: '' })).rejects.toThrow(
        'Book language is required',
      );
    });

    it('requires condition', async () => {
      await expect(bookDetails.validateAt('condition', { condition: '' })).rejects.toThrow(
        'Book condition is required',
      );
    });

    it('accepts valid data', async () => {
      const file = new File(['data'], 'test.jpg', { type: 'image/jpeg' });
      const result = await bookDetails.validate({
        coverPhotos: [file],
        title: 'Test',
        author: 'Author',
        language: 'English',
        condition: 'Good',
      });
      expect((result as { title: string }).title).toBe('Test');
    });
  });

  describe('otherDetails', () => {
    it('requires genres', async () => {
      await expect(otherDetails.validateAt('genres', { genres: [] })).rejects.toThrow(
        'Please select at least one genre.',
      );
    });

    it('accepts valid genres', async () => {
      const result = await otherDetails.validate({
        genres: ['Fiction'],
        address: {
          latitude: 60.1699,
          longitude: 24.9384,
          address: '123 Street',
          city: 'Helsinki',
          country: 'Finland',
          postalCode: '00100',
        },
      });
      expect((result as { genres: string[] }).genres).toEqual(['Fiction']);
    });
  });

  describe('conditionDetails', () => {
    it('requires swapType', async () => {
      await expect(conditionDetails.validateAt('swapType', { swapType: '' })).rejects.toThrow(
        'Swap type is required',
      );
    });

    it('requires swappableBooks when swapType is ByBooks', async () => {
      await expect(
        conditionDetails.validate({ swapType: 'ByBooks', swappableBooks: [] }),
      ).rejects.toThrow();
    });

    it('requires swappableGenres when swapType is ByGenres', async () => {
      await expect(
        conditionDetails.validate({ swapType: 'ByGenres', swappableGenres: [] }),
      ).rejects.toThrow();
    });

    it('does not require swappableBooks for GiveAway', async () => {
      const result = await conditionDetails.validate({
        swapType: 'GiveAway',
        swappableBooks: [],
      });
      expect((result as { swapType: string }).swapType).toBe('GiveAway');
    });
  });
});

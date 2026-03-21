import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import {
  goToTop,
  blobToBase64,
  convertedURLToFile,
  urlToDataUrl,
  getFileToUrl,
  options,
  isString,
  isUserProfile,
  truncateText,
} from '../../utility/helper';

// Mock URL.createObjectURL for tests
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:mock-url'),
});

// Declare global for test environment
declare const global: {
  fetch: unknown;
  URL: {
    createObjectURL: unknown;
  };
  FileReader: unknown;
};

describe('Helper Utility Functions', () => {
  describe('goToTop', () => {
    it('should call window.scrollTo with default top value of 0', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      goToTop();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0 });
      scrollToSpy.mockRestore();
    });

    it('should call window.scrollTo with custom top value', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      goToTop(500);

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 500 });
      scrollToSpy.mockRestore();
    });
  });

  describe('blobToBase64', () => {
    it('should convert blob to base64 successfully', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const result = await blobToBase64(blob);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('data:text/plain;base64,');
    });

    it('should handle blob conversion errors', async () => {
      const mockBlob = {
        type: 'text/plain',
      } as Blob;

      // Mock FileReader to simulate error
      const originalFileReader = global.FileReader;
      global.FileReader = vi.fn().mockImplementation(() => ({
        onloadend: null,
        onerror: null,
        readAsDataURL: function () {
          this.onerror(new Error('Read error'));
        },
      })) as unknown as typeof FileReader;

      await expect(blobToBase64(mockBlob)).rejects.toThrow();

      global.FileReader = originalFileReader;
    });
  });

  describe('convertedURLToFile', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return undefined for empty URL', async () => {
      const result = await convertedURLToFile('');
      expect(result).toBeUndefined();
    });

    it('should convert valid image URL to File object', async () => {
      const mockBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      (global.fetch as Mock).mockResolvedValue(mockResponse);

      const result = await convertedURLToFile('https://example.com/image.jpg');

      expect(result).toBeInstanceOf(File);
      expect(result?.name).toBe('image.jpg.jpeg');
      expect(result?.type).toBe('image/jpeg');
    });

    it('should handle unsupported file formats', async () => {
      const mockBlob = new Blob(['fake data'], { type: 'application/pdf' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      (global.fetch as Mock).mockResolvedValue(mockResponse);

      const result = await convertedURLToFile('https://example.com/document.pdf');

      expect(result).toBeUndefined();
    });

    it('should handle fetch errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as Mock).mockRejectedValue(new Error('Network error'));

      const result = await convertedURLToFile('https://example.com/image.jpg');

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Error converting URL to file:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('urlToDataUrl', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should convert URL to data URL successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      (global.fetch as Mock).mockResolvedValue(mockResponse);

      const result = await urlToDataUrl('https://example.com/image.jpg');

      expect(typeof result).toBe('string');
      expect(result).toContain('data:image/jpeg;base64,');
    });

    it('should return fallback data URL for non-ok response', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockResponse = {
        ok: false,
        status: 404,
      };

      (global.fetch as Mock).mockResolvedValue(mockResponse);

      const result = await urlToDataUrl('https://example.com/missing.jpg');

      expect(result).toContain('data:image/png;base64,');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should return fallback data URL for empty URL after trim', async () => {
      const result = await urlToDataUrl('   ');
      expect(result).toContain('data:image/png;base64,');
    });
  });

  describe('getFileToUrl', () => {
    it('should return object URL for File instance', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = getFileToUrl(file);

      expect(typeof result).toBe('string');
      expect(result).toContain('blob:');
    });

    it('should return string URL as-is', () => {
      const url = 'https://example.com/image.jpg';
      const result = getFileToUrl(url);

      expect(result).toBe(url);
    });

    it('should return empty string for falsy string values', () => {
      expect(getFileToUrl('')).toBe('');
      expect(getFileToUrl(null as string | null)).toBe('');
      expect(getFileToUrl(undefined as string | undefined)).toBe('');
    });
  });

  describe('options', () => {
    it('should convert string array to options format', () => {
      const input = ['option1', 'option2', 'option3'];
      const result = options(input);

      expect(result).toEqual([
        { label: 'option1', value: 'option1' },
        { label: 'option2', value: 'option2' },
        { label: 'option3', value: 'option3' },
      ]);
    });

    it('should return undefined for empty array', () => {
      const result = options([]);
      expect(result).toBeUndefined();
    });

    it('should return undefined for null/undefined input', () => {
      expect(options(null)).toBeUndefined();
      expect(options(undefined)).toBeUndefined();
    });
  });

  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(true)).toBe(false);
    });
  });

  describe('isUserProfile', () => {
    it('should return true when user IDs match', () => {
      expect(isUserProfile('123', '123')).toBe(true);
      expect(isUserProfile('abc', 'abc')).toBe(true);
    });

    it('should return undefined when user IDs do not match', () => {
      expect(isUserProfile('123', '456')).toBeUndefined();
      expect(isUserProfile('abc', 'def')).toBeUndefined();
    });

    it('should handle string conversion for numeric IDs', () => {
      expect(isUserProfile('123', 123 as string | number)).toBe(true);
      expect(isUserProfile(123 as string | number, '123')).toBe(true);
    });
  });

  describe('truncateText', () => {
    it('should return original text if length is less than maxLength', () => {
      const text = 'Hello';
      const result = truncateText(text, 10);

      expect(result).toBe('Hello');
    });

    it('should truncate text and add ellipsis when exceeding maxLength', () => {
      const text = 'Hello World';
      const result = truncateText(text, 8);

      expect(result).toBe('Hello Wo...');
    });

    it('should handle edge case where maxLength equals text length', () => {
      const text = 'Hello';
      const result = truncateText(text, 5);

      expect(result).toBe('Hello');
    });

    it('should handle empty string', () => {
      const result = truncateText('', 5);
      expect(result).toBe('');
    });

    it('should handle maxLength of 0', () => {
      const text = 'Hello';
      const result = truncateText(text, 0);

      expect(result).toBe('...');
    });
  });
});

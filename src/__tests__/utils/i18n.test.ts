import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock i18next and its plugins before importing
vi.mock('i18next', () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockResolvedValue(undefined),
    changeLanguage: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('react-i18next', () => ({
  initReactI18next: vi.fn(),
}));

// Mock the parsePropertiesString function
vi.mock('../../utility/parseProperties', () => ({
  parsePropertiesString: vi.fn((input: string) => {
    // Simple mock implementation for testing
    const result: Record<string, string> = {};
    input.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      result[key] = value;
    });
    return result;
  }),
}));

// Mock the raw locale files
vi.mock('../locales/en.properties?raw', () => ({
  default: 'key1=value1\nkey2=value2',
}));

vi.mock('../locales/fi.properties?raw', () => ({
  default: 'avain1=arvo1\navain2=arvo2',
}));

vi.mock('../locales/sv.properties?raw', () => ({
  default: 'nyckel1=värde1\nnyckel2=värde2',
}));

// Import after mocking
import { setLanguage } from '../../utility/i18n';
import i18n from 'i18next';

describe('i18n Utility Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setLanguage', () => {
    it('should change language and save to localStorage for valid language', () => {
      setLanguage('en');

      expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
      expect(localStorage.getItem('language')).toBe('en');
    });

    it('should accept all valid languages', () => {
      const validLanguages = ['fi', 'en', 'sv'];

      validLanguages.forEach((lang) => {
        setLanguage(lang);

        expect(i18n.changeLanguage).toHaveBeenCalledWith(lang);
        expect(localStorage.getItem('language')).toBe(lang);
      });
    });

    it('should not change language for invalid language', () => {
      setLanguage('invalid-lang');

      expect(i18n.changeLanguage).not.toHaveBeenCalled();
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('should handle empty string as invalid', () => {
      setLanguage('');

      expect(i18n.changeLanguage).not.toHaveBeenCalled();
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('should handle case-sensitive language codes', () => {
      setLanguage('EN'); // uppercase

      expect(i18n.changeLanguage).not.toHaveBeenCalled();
      expect(localStorage.getItem('language')).toBeNull();
    });
  });
});

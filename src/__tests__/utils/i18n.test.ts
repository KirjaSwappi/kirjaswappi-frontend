import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import i18n from '../../utility/i18n';
import { setLanguage } from '../../utility/i18n';

describe('i18n Utility Functions', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let changeLanguageSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    changeLanguageSpy = vi.spyOn(i18n, 'changeLanguage');
  });

  afterEach(async () => {
    localStorage.clear();
    changeLanguageSpy.mockRestore();
    await i18n.changeLanguage('en');
    localStorage.setItem('language', 'en');
  });

  describe('setLanguage', () => {
    it('should change language and save to localStorage for valid language', () => {
      setLanguage('en');

      expect(changeLanguageSpy).toHaveBeenCalledWith('en');
      expect(localStorage.getItem('language')).toBe('en');
    });

    it('should accept all valid languages', () => {
      const validLanguages = ['fi', 'en', 'sv'];

      validLanguages.forEach((lang) => {
        setLanguage(lang);

        expect(changeLanguageSpy).toHaveBeenCalledWith(lang);
        expect(localStorage.getItem('language')).toBe(lang);
      });
    });

    it('should not change language for invalid language', () => {
      setLanguage('invalid-lang');

      expect(changeLanguageSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('should handle empty string as invalid', () => {
      setLanguage('');

      expect(changeLanguageSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('should handle case-sensitive language codes', () => {
      setLanguage('EN'); // uppercase

      expect(changeLanguageSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem('language')).toBeNull();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { useTermsOfServiceData } from '../../../pages/termsOfService/components/useTermsOfServiceData';

describe('useTermsOfServiceData', () => {
  it('returns CategorySectionData with 8 sections', () => {
    const { result } = renderHook(() => useTermsOfServiceData());
    expect(result.current.CategorySectionData).toHaveLength(8);
  });

  it('each section has required fields', () => {
    const { result } = renderHook(() => useTermsOfServiceData());
    result.current.CategorySectionData.forEach((section) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('category');
      expect(section).toHaveProperty('Mobilecategory');
      expect(section).toHaveProperty('title');
    });
  });

  it('getSectionById returns correct section', () => {
    const { result } = renderHook(() => useTermsOfServiceData());
    const section = result.current.getSectionById(2);
    expect(section).toBeDefined();
    expect(section?.id).toBe(2);
  });

  it('getSectionById returns undefined for non-existent id', () => {
    const { result } = renderHook(() => useTermsOfServiceData());
    expect(result.current.getSectionById(999)).toBeUndefined();
  });

  it('section 2 has children with points', () => {
    const { result } = renderHook(() => useTermsOfServiceData());
    const section = result.current.getSectionById(2);
    expect(section?.children).toBeDefined();
    expect(section?.children?.[0].points).toBeDefined();
    expect(section?.children?.[0].points?.length).toBe(3);
  });
});

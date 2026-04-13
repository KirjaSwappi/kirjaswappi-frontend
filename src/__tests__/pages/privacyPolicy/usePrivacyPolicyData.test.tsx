import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { usePrivacyPolicyData } from '../../../pages/privacyPolicy/components/usePrivacyPolicyData';

describe('usePrivacyPolicyData', () => {
  it('returns CategorySectionData with 11 sections', () => {
    const { result } = renderHook(() => usePrivacyPolicyData());
    expect(result.current.CategorySectionData).toHaveLength(11);
  });

  it('each section has required fields', () => {
    const { result } = renderHook(() => usePrivacyPolicyData());
    result.current.CategorySectionData.forEach((section) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('category');
      expect(section).toHaveProperty('Mobilecategory');
      expect(section).toHaveProperty('title');
    });
  });

  it('getSectionById returns correct section', () => {
    const { result } = renderHook(() => usePrivacyPolicyData());
    const section = result.current.getSectionById(1);
    expect(section).toBeDefined();
    expect(section?.id).toBe(1);
  });

  it('getSectionById returns undefined for non-existent id', () => {
    const { result } = renderHook(() => usePrivacyPolicyData());
    expect(result.current.getSectionById(999)).toBeUndefined();
  });

  it('section 1 has children with subHeadings', () => {
    const { result } = renderHook(() => usePrivacyPolicyData());
    const section1 = result.current.getSectionById(1);
    expect(section1?.children).toBeDefined();
    expect(section1?.children?.length).toBe(3);
    expect(section1?.children?.[0]).toHaveProperty('subHeading');
  });

  it('sections with paragraphs have paragraph field', () => {
    const { result } = renderHook(() => usePrivacyPolicyData());
    const section4 = result.current.getSectionById(4);
    expect(section4?.paragraph).toBeDefined();
  });
});

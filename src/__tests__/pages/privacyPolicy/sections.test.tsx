import { describe, it, expect } from 'vitest';
import { getPrivacyPolicySections } from '../../../pages/privacyPolicy/constants/sections';

const mockT = (key: string) => key;

describe('getPrivacyPolicySections', () => {
  const sections = getPrivacyPolicySections(mockT);

  it('returns 3 category sections', () => {
    expect(sections).toHaveLength(3);
  });

  it('first section is Information category', () => {
    expect(sections[0].category).toBe('privacypolicy.category.information');
    expect(sections[0].items).toHaveLength(3);
  });

  it('second section is Usage category', () => {
    expect(sections[1].category).toBe('privacypolicy.category.usage');
    expect(sections[1].items).toHaveLength(4);
  });

  it('third section is Additional category', () => {
    expect(sections[2].category).toBe('privacypolicy.category.additional');
    expect(sections[2].items).toHaveLength(5);
  });

  it('each item has key, title and content', () => {
    sections.forEach((section) => {
      section.items.forEach((item) => {
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('content');
      });
    });
  });

  it('personal info item has correct key', () => {
    expect(sections[0].items[0].key).toBe('personal');
  });

  it('security item has correct key', () => {
    const usageSection = sections[1];
    const securityItem = usageSection.items.find((i) => i.key === 'security');
    expect(securityItem).toBeDefined();
  });
});

export interface PrivacyPolicyItem {
  key: string;
  title: string;
  content: React.ReactNode;
}

export interface PrivacyPolicySection {
  category: string;
  items: PrivacyPolicyItem[];
}

export interface PrivacyPolicySectionProps {
  category: string;
  items: PrivacyPolicyItem[];
  openSections: Record<string, boolean>;
  toggleSection: (key: string) => void;
}

export interface PrivacyPolicyField {
  item: string;
  collected: string;
}

export interface PrivacyPolicyBold {
  title: string;
  content: string;
}

export interface PrivacyPolicyTranslationItem {
  title: string;
  fields?: PrivacyPolicyField[];
  list?: string[];
  bold?: PrivacyPolicyBold[];
  paragraphs?: string[];
  paragraph?: string;
}

export interface PrivacyPolicyTranslationSection {
  category: string;
  items: PrivacyPolicyTranslationItem[];
}

export interface PrivacyPolicyTranslation {
  introduction: string;
  sections: PrivacyPolicyTranslationSection[];
}

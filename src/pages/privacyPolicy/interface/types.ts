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

import React from 'react';
import { Link } from 'react-router-dom';
import { PrivacyPolicyTranslationItem } from '../interface/types';

interface PrivacyPolicySectionProps {
  category: string;
  items: PrivacyPolicyTranslationItem[];
}

const PrivacyPolicySection: React.FC<PrivacyPolicySectionProps> = ({ category, items }) => {
  return (
    <div className="sm:pt-4 lg:pt-0">
      <p className="px-4 pt-[20px] font-poppins font-semibold text-[16px] pb-[12px] leading-[28px] lg:tracking-[0px]">
        {category}
      </p>
      <div className="block lg:hidden bg-white">
        {items.map((item, idx) => (
          <Link key={idx} to={item.title} className="block px-4 py-3 text-[15px] text-gray-700">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicySection;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import About from './About';
import MyLibrary from './MyLibrary';
import RatingAndReview from './RatingAndReview';

export default function UserTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [
    {
      label: t('about'),
      content: <About />,
    },
    {
      label: t('profile.booksListed'),
      content: <MyLibrary />,
    },
    {
      label: t('profile.ratingAndReviews'),
      content: <RatingAndReview />,
    },
  ];

  return (
    <div>
      <div className="flex gap-1 sm:gap-2">
        {tabs?.map((tab, index) => (
          <Button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-2 sm:px-3 py-2 rounded-full text-xs font-poppins font-medium ${
              index === activeTab ? 'bg-primary text-white' : 'text-grayDark border border-grayDark'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="bg-[#E4E4E4] w-full h-[1px] mt-2 mb-5"></div>
      {tabs[activeTab]?.content}
    </div>
  );
}

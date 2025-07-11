import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import About from './About';
import BooksListed from './BooksListed';
import RatingAndReview from './RatingAndReview';
import UserProfile from './UserProfile';

export default function ProfileDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [
    {
      label: t('about'),
      content: <About />,
      hideOnLg: true,
    },
    {
      label: t('profile.booksListed'),
      content: <BooksListed />,
    },
    {
      label: 'Pending Swaps',
      content: <RatingAndReview />,
    },
    {
      label: 'Bookmarked',
      content: <RatingAndReview />,
    },
  ];

  return (
    <div className="pt-6">
      <div className="container">
        <div className="flex gap-5">
          <div className="lg:max-h-[87vh] lg:min-h-[87vh] w-[30%] xl:w-3/12 bg-white rounded-xl relative">
            <UserProfile />
          </div>
          <div className="w-[70%] xl:w-9/12">
            <div className="flex gap-1 sm:gap-2 pb-5">
              {tabs.map((tab, index) => (
                <Button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-2 sm:px-3 py-2 rounded-full text-xs font-poppins font-medium flex items-center gap-2 ${
                    index === activeTab
                      ? 'bg-primary text-white'
                      : 'text-grayDark border border-grayDark'
                  } ${tab.hideOnLg ? 'lg:hidden' : ''}`}
                >
                  {tab.label}
                  <div
                    className={`${
                      index === activeTab
                        ? 'bg-white text-primary'
                        : 'text-white border bg-grayDark'
                    } w-5 h-5 flex items-center justify-center rounded-full font-semibold leading-none`}
                  >
                    <p className="leading-none text-sx mt-0.5">10</p>
                  </div>
                </Button>
              ))}
            </div>
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`${activeTab === index ? 'block' : 'hidden'} ${
                  tab.hideOnLg ? 'lg:hidden' : ''
                }`}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import About from './About';
import BooksListed from './BooksListed';
import UserActionNavigation from './UserActionNavigation';
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
      content: <BooksListed />,
    },
    {
      label: 'Bookmarked',
      content: <BooksListed />,
    },
  ];

  return (
    <div className="lg:pt-6">
      <div className="lg:container">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:max-h-[87vh] lg:min-h-[87vh] w-full xl:w-3/12 lg:bg-white rounded-xl relative">
            <UserProfile />
          </div>
          <div className="w-full xl:w-9/12 px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {tabs.map((tab, index) => (
                  <Button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`px-2 sm:px-3 h-8 rounded-full text-xs font-poppins font-medium flex items-center gap-2 ${
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
                      } w-4 h-4 flex items-center justify-center rounded-full font-semibold leading-none`}
                    >
                      <p className="leading-none text-[8px] mt-0.5">0</p>
                    </div>
                  </Button>
                ))}
              </div>
              <UserActionNavigation />
            </div>
            <div className="mt-5">
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
    </div>
  );
}

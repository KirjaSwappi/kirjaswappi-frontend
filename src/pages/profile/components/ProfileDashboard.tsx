import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import { useAppSelector } from '../../../redux/hooks';
import About from './About';
import BooksListed from './BooksListed';
import TabsSkeleton from './Skeletons/TabsSkeleton';
import UserActionNavigation from './UserActionNavigation';
import UserProfile from './UserProfile';

export default function ProfileDashboard() {
  const { t } = useTranslation();
  const { userInformation, loading } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(1);
  // const { id } = useParams();
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
      authRequired: true,
    },
    {
      label: 'Bookmarked',
      content: <BooksListed />,
      authRequired: true,
      hideOnMobile: true,
    },
  ];

  const filteredTabs = tabs.filter((tab) => {
    if (tab.authRequired && !userInformation?.id) {
      return false;
    }
    return true;
  });

  return (
    <div className="lg:pt-6">
      <div className="lg:container">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:max-h-[87vh] lg:min-h-[87vh] w-full lg:w-4/12 xl:w-3/12 lg:bg-white rounded-xl relative">
            <UserProfile />
          </div>
          <div className="w-full lg:w-8/12 xl:w-9/12 px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {loading ? (
                  <TabsSkeleton />
                ) : (
                  filteredTabs.map((tab, index) => (
                    <Button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`px-2 sm:px-3 h-8 rounded-full text-xs font-poppins font-medium flex items-center gap-2 ${
                        index === activeTab
                          ? 'bg-primary text-white'
                          : 'text-grayDark border border-grayDark'
                      } 
    ${tab.hideOnLg ? 'lg:hidden' : ''} 
    ${tab.hideOnMobile ? 'lg:flex hidden' : ''}`}
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
                  ))
                )}
              </div>
              <div className={`${!userInformation.email && 'hidden'}`}>
                <UserActionNavigation />
              </div>
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

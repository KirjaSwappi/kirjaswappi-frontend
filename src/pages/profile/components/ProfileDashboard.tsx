import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Button from '../../../components/shared/Button';
import { useGetUserByIdQuery } from '../../../redux/feature/auth/authApi';
import { useGetAllBooksQuery } from '../../../redux/feature/book/bookApi';
import { useGetInboxByStatusQuery } from '../../../redux/feature/messages/inboxApi';
import { useAppSelector } from '../../../redux/hooks';
import About from './About';
import BookmarkedBooks from './BookmarkedBooks';
import BooksListed from './BooksListed';
import PendingSwaps from './PendingSwaps';
import TabsSkeleton from './Skeletons/TabsSkeleton';
import UserActionNavigation from './UserActionNavigation';
import UserProfile from './UserProfile';

export default function ProfileDashboard() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { userInformation, loading } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(1);
  const { data: booksData } = useGetAllBooksQuery({ ownerId: id }, { skip: !id });
  const booksCount = booksData?.page?.totalElements ?? 0;
  const isOwnProfile = String(userInformation?.id) === String(id);
  const { data: pendingSwapsData } = useGetInboxByStatusQuery(
    { status: 'Pending' },
    { skip: !isOwnProfile || !userInformation.id },
  );
  const pendingSwapsCount = pendingSwapsData?.length ?? 0;
  const { data: userData } = useGetUserByIdQuery(
    { userId: id as string },
    { skip: !id || !isOwnProfile },
  );
  const bookmarkedCount = userData?.favBooks?.length ?? 0;
  const tabs = [
    {
      label: t('about'),
      content: <About />,
      hideOnLg: true,
      hideCount: true,
    },
    {
      label: t('profile.booksListed'),
      content: <BooksListed />,
      count: booksCount,
    },
    {
      label: 'Pending Swaps',
      content: <PendingSwaps />,
      permission: false,
      count: pendingSwapsCount,
    },
    {
      label: 'Bookmarked',
      content: <BookmarkedBooks />,
      hideOnMobile: true,
      permission: false,
      count: bookmarkedCount,
    },
  ];
  // IF ID AND USER ID DON'T MATCH, HIDE THE TABS THAT USER RELATED TAB
  const filteredTabs = tabs.filter((tab) => {
    if (String(userInformation?.id) === String(id)) {
      return true;
    }
    if (tab.permission === false) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 1024) {
        setActiveTab(0);
      } else {
        setActiveTab(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (activeTab === null) return null;

  return (
    <div className="lg:pt-6">
      <div className="lg:container">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:max-h-[87vh] lg:min-h-[87vh] w-full lg:w-4/12 xl:w-3/12 lg:bg-white rounded-xl relative">
            <UserProfile />
          </div>
          <div className="w-full lg:w-8/12 xl:w-9/12 px-4 lg:px-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 sm:gap-2 ">
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
                      {!tab.hideCount && (
                        <div
                          className={`${
                            index === activeTab
                              ? 'bg-white text-primary'
                              : 'text-white border bg-grayDark'
                          } w-4 h-4 flex items-center justify-center rounded-full font-semibold leading-none`}
                        >
                          <p className="leading-none text-[8px] mt-0.5">{tab.count ?? 0}</p>
                        </div>
                      )}
                    </Button>
                  ))
                )}
              </div>
              {userInformation.id === id && (
                <div className={`${!userInformation.email && 'hidden'}`}>
                  <UserActionNavigation />
                </div>
              )}
            </div>
            <div className="mt-5 pb-32">
              {filteredTabs.map((tab, index) => (
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

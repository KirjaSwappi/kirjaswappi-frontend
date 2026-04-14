import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import locationIcon from '../../../assets/location-icon.png';
import Image from '../../../components/shared/Image';
import { useGetUserByIdQuery } from '../../../redux/feature/auth/authApi';
import { useGetAllBooksQuery } from '../../../redux/feature/book/bookApi';
import { useGetInboxByStatusQuery } from '../../../redux/feature/messages/inboxApi';
import { useAppSelector } from '../../../redux/hooks';
import BookList from './BookList';
export default function About() {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const { userInformation } = useAppSelector((state) => state.auth);
  const isOwnProfile = userId === userInformation.id;
  const { data } = useGetUserByIdQuery({ userId: userId as string }, { skip: !userId });
  const { data: booksData } = useGetAllBooksQuery({ ownerId: userId }, { skip: !userId });
  const { data: completedSwaps } = useGetInboxByStatusQuery(
    { status: 'Completed' },
    { skip: !isOwnProfile },
  );
  const booksCount = booksData?.page?.totalElements ?? 0;
  const swapsCount = isOwnProfile ? (completedSwaps?.length ?? 0) : '-';
  return (
    <div>
      {data?.aboutMe && (
        <p className="text-xs font-light font-poppins text-grayDark">{data.aboutMe}</p>
      )}
      <div className="bg-white py-2 px-5 grid grid-cols-2 my-5 rounded-lg">
        <div className="relative">
          <div className="text-center after:absolute after:right-0 after:top-0 after:h-[30px] after:w-[1px] after:bg-[#E4E4E4]">
            <p className="text-grayDark text-xs font-poppins font-normal">
              {t('profile.totalSwaps')}
            </p>
            <h3 className="text-black text-xs font-normal font-poppins">{swapsCount}</h3>
          </div>
        </div>

        <div className="text-center">
          <p className="text-grayDark text-xs font-poppins font-normal">
            {t('profile.booksListed')}
          </p>
          <h3 className="text-black text-xs font-normal font-poppins">{booksCount}</h3>
        </div>
      </div>
      {data?.city && (
        <div className="flex items-center gap-1 my-5">
          <Image src={locationIcon} alt="location" />
          <p className="text-xs font-poppins font-normal">{data.city}</p>
        </div>
      )}
      <div className="bg-[#E4E4E4] w-full h-[1px] my-5"></div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base text-black font-medium font-poppins">{t('profile.myLibrary')}</h1>
      </div>
      <div>
        <BookList />
      </div>
    </div>
  );
}

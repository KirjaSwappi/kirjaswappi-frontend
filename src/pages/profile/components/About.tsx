import { useTranslation } from 'react-i18next';
import locationIcon from '../../../assets/location-icon.png';
import rating from '../../../assets/rating.png';
import upArrowIcon from '../../../assets/upArrow.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
import { useAppSelector } from '../../../redux/hooks';
import BookList from './BookList';
export default function About() {
  const { t } = useTranslation();
  const {
    userInformation: { aboutMe },
  } = useAppSelector((state) => state.auth);
  return (
    <div>
      {aboutMe && <p className="text-xs font-light font-poppins text-grayDark">{aboutMe}</p>}
      <div className="bg-white py-2 px-5 grid grid-cols-3 my-5 rounded-2xl">
        <div className="relative">
          <div className="text-center after:absolute after:right-0 after:top-0 after:h-[30px] after:w-[1px] after:bg-[#E4E4E4]">
            <p className="text-grayDark text-xs font-poppins font-normal">
              {t('profile.totalSwaps')}
            </p>
            <h3 className="text-black text-xs font-normal font-poppins">3</h3>
          </div>
        </div>
        <div className="relative">
          <div className="text-center flex flex-col items-center after:absolute after:right-0 after:top-0 after:h-[30px] after:w-[1px] after:bg-[#E4E4E4]">
            <p className="text-grayDark text-xs font-poppins font-normal ">
              {t('profile.usersReviews')}
            </p>
            <h3 className="text-black text-xs font-normal font-poppins flex items-center gap-1">
              <Image src={rating} alt="rating" /> <span className="inline-block mt-[2px]">4.3</span>
            </h3>
          </div>
        </div>

        <div className="text-center">
          <p className="text-grayDark text-xs font-poppins font-normal">
            {t('profile.booksListed')}
          </p>
          <h3 className="text-black text-xs font-normal font-poppins">8</h3>
        </div>
      </div>
      <div className="flex items-center gap-1 my-5">
        <Image src={locationIcon} alt="location" />
        <p className="text-xs font-poppins font-normal">Senate Square, Helsinki</p>
      </div>
      <div className="flex items-center gap-1">
        <Image src={upArrowIcon} alt="profile" />
        <p className="text-xs font-normal font-poppins text-black">
          95% {t('profile.positiveSwaps')}
        </p>
      </div>
      <div className="bg-[#E4E4E4] w-full h-[1px] my-5"></div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base text-black font-medium font-poppins">{t('profile.myLibrary')}</h1>
        <Button className="text-primary underline font-poppins font-normal text-sm">
          {t('profile.seeAll')}
        </Button>
      </div>
      <div>
        <BookList />
      </div>
    </div>
  );
}

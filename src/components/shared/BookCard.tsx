import { FaRegClock } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import locationIcon from '../../assets/location-icon.png';
import profile from '../../assets/profile.svg';
import { IBook } from '../../pages/books/interface';
import { useAppSelector } from '../../redux/hooks';
import BookCardSwapButton from './BookCardSwapButton';
import Image from './Image';
export default function BookCard({
  book,
  isProfile = false,
}: {
  book: IBook;
  isProfile?: boolean;
}) {
  if (!book) return null;
  const navigate = useNavigate();
  const { title, author, coverPhotoUrl, id, ownerName, ownerProfilePhoto, coverPhotoUrls } = book;
  const imageUrl = Array.isArray(coverPhotoUrls) ? coverPhotoUrls[0] : coverPhotoUrl;

  // =========== GET USER ID FROM STORE ===========
  const {
    userInformation: { email },
  } = useAppSelector((state) => state.auth);

  // =========== NAVIGATE TO BOOK DETAILS PAGE ===========
  const handleNavigate = (): void => {
    navigate(`/book-details/${id}`, {
      state: 'book-details',
    });
  };
  return (
    <div className={`${isProfile ? '' : 'shadow-lg '} rounded-lg overflow-hidden`}>
      <div className="h-full flex flex-col">
        <div className="relative">
          <div className={`${isProfile ? 'h-[156px] lg:h-[174px]' : 'h-[156px] lg:h-[214px]'} `}>
            <Image
              className="w-full h-full object-cover"
              src={imageUrl}
              alt={`${title} || 'Your favorite book'`}
            />
          </div>
          {isProfile && email && (
            <div className="absolute bottom-2 left-2">
              <BookCardSwapButton />
            </div>
          )}
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={handleNavigate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleNavigate();
          }}
          className={`${isProfile ? 'p-0 mt-2' : 'p-3 '} cursor-pointer`}
        >
          <h1
            className="font-poppins font-medium text-xs mt-1 leading-[100%] text-gray-900 mb-0.5 
            truncate"
          >
            {title}
          </h1>
          <p
            className={`font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600 
              ${isProfile ? '' : 'mb-2'} `}
          >
            {' '}
            by {author}
          </p>
          <div className={`${isProfile ? 'hidden' : 'block'}`}>
            <div className="flex items-center mb-1.5 lg:mb-2">
              <Image src={locationIcon} alt="Location" className="mr-1 flex-shrink-0 w-4 h-4" />
              <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
                Helsinki
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {ownerProfilePhoto && (
                  <div className="w-3.5 h-3.5 rounded-full">
                    <Image
                      src={ownerProfilePhoto || profile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {ownerName && (
                  <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
                    {ownerName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <FaRegClock className="text-sx text-grayDark" />
                <p className="font-poppins font-normal text-sx text-grayDark">29 mins. ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

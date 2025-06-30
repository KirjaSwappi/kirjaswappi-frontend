import { useNavigate } from 'react-router-dom';
import { IBook } from '../../pages/books/interface';
import Image from './Image';
import userProfileImg from '../../assets/userprofile.png';
import locationIcon from '../../assets/location-icon.png';
import clockIcon from '../../assets/clock.png';
import exchangeIcon from '../../assets/exchangeicon.png';

export default function BookCard({ book }: { book: IBook }) {
  if (!book) return null;
  const navigate = useNavigate();
  const { title, author, coverPhotoUrl, id } = book;

  return (
    <div
      className="
    w-[145px]
    xm:w-[158px]
    xlg:w-[165px]
    sm:w-[168px]
    lg:w-[212px]
    sm:h-[264px]
    lg:h-[314px]
    gap-[20px]
    xm:gap-[24px]
    xlg:gap-[28px]
    sm:gap-[32px]
    lg:gap-[56px]
    shadow-lg
    flex flex-col
    bg-white
    rounded-lg
    shadow-sm
    overflow-hidden
  "
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() =>
          navigate(`/book-details/${id}`, {
            state: 'book-details',
          })
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate(`/book-details/${id}`, {
              state: 'book-details',
            });
          }
        }}
        className="cursor-pointer h-full flex flex-col"
      >
        {/* Book Cover Image */}
        <div className="w-full h-[156px] lg:h-[214px] lg:w-[212px] bg-gray-100 overflow-hidden rounded-t-lg flex-shrink-0 relative">
          <Image
            className="w-full h-full object-cover"
            src={coverPhotoUrl}
            alt={`${title} || 'Your favorite book'`}
          />
          {/* Exchange Icon */}
          <div className="absolute bottom-2 left-2 bg-blue-500 flex items-center justify-center w-7 h-7 rounded-full p-2 gap-2.5">
            <img src={exchangeIcon} alt="Exchange" className="w-[10px] h-[8.33px]" />
          </div>
        </div>

        {/* Book Info Section */}
        <div className="flex-1 px-3 py-1.5 lg:px-4 lg:py-2 flex flex-col">
          {/* Book Title */}
          <h1 className="font-poppins font-medium text-[12px] mt-1 leading-[100%] text-gray-900 mb-0.5 truncate">
            {title && title}
          </h1>

          {/* Author */}
          {author && (
            <p className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600 mb-1.5">
              by {author}
            </p>
          )}

          {/* Location */}
          <div className="flex items-center mb-1.5 lg:mb-2">
            <img src={locationIcon} alt="Location" className="mr-1 flex-shrink-0 w-4 h-4" />
            <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
              Helsinki
            </span>
          </div>

          {/* User Info - Different layout for sm vs lg */}
          <div className="lg:flex lg:items-center lg:justify-between">
            {/* User Info */}
            <div className="flex items-center mb-1.5 lg:mb-0">
              <div className="flex-shrink-0 mr-1.5 overflow-hidden w-3.5 h-3.5 rounded-full">
                <img src={userProfileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
                Tanvir Rayhan
              </span>
            </div>

            {/* Timestamp - Below name on small, beside on large */}
            <div className="flex items-center ml-0 lg:ml-0 mt-1 lg:mt-0">
              <img src={clockIcon} alt="Clock" className="mr-1 w-[9px] h-[9px]" />
              <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-[#808080]">
                29 mins ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

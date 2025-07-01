import { useNavigate } from 'react-router-dom';
import exchangeIcon from '../../assets/exchangeicon.png';
import locationIcon from '../../assets/location-icon.png';
import profile from '../../assets/profile.svg';
import { IBook } from '../../pages/books/interface';
import Button from './Button';
import Image from './Image';
export default function BookCard({ book }: { book: IBook }) {
  if (!book) return null;
  const navigate = useNavigate();
  const { title, author, coverPhotoUrl, id, ownerName, ownerProfilePhoto } = book;
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="relative">
          <div className="h-[156px] lg:h-[214px]">
            <Image
              className="w-full h-full object-cover"
              src={coverPhotoUrl}
              alt={`${title} || 'Your favorite book'`}
            />
          </div>
          <div className="absolute bottom-2 left-2">
            <Button
              type="button"
              className="relative group flex items-center bg-blue-500 rounded-full p-2 gap-2.5 
                transition-all duration-300 w-7 h-7 hover:w-[100px] hover:h-[28px] hover:rounded-[20px] 
                focus:w-[97px] focus:h-[28px] focus:rounded-[20px] overflow-hidden shadow-md"
              tabIndex={0}
              aria-label="Swap Book"
            >
              <Image
                src={exchangeIcon}
                alt="Exchange"
                className="w-[10px] h-[8.33px] flex-shrink-0"
              />
              <span
                className="absolute opacity-0 group-hover:opacity-100 group-focus:opacity-100 
                  transition-opacity duration-300 pointer-events-none select-none text-white font-poppins 
                  font-normal text-[12px] leading-[100%] whitespace-nowrap w-[66px] h-[18px] top-[9px] 
                  left-[23.33px] [letter-spacing:0]"
              >
                Swap Book
              </span>
            </Button>
          </div>
        </div>
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
          className="p-3 cursor-pointer"
        >
          <h1
            className="font-poppins font-medium text-xs mt-1 leading-[100%] text-gray-900 mb-0.5 
            truncate"
          >
            {title}
          </h1>
          <p
            className="font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600 
              mb-2"
          >
            {' '}
            by {author}
          </p>
          <div className="flex items-center mb-1.5 lg:mb-2">
            <Image src={locationIcon} alt="Location" className="mr-1 flex-shrink-0 w-4 h-4" />
            <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
              Helsinki
            </span>
          </div>
          <div className="flex items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}

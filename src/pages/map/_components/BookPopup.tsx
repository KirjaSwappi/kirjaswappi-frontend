import { Link } from 'react-router-dom';
import Image from '../../../components/shared/Image';
import { IBookWithLocation } from '../types/interface';

export default function BookPopup({ books }: { books: IBookWithLocation[] }) {
  const isSingle = books.length === 1;

  return (
    <div
      className={`${
        isSingle
          ? 'w-[220px]'
          : 'w-[260px] max-h-[320px] overflow-y-auto rounded-r-3xl rounded-tl-3xl bg-[#1A1A1A] p-4 '
      }`}
    >
      {/* BOOK LIST */}
      <div className={`flex flex-col gap-3 ${isSingle ? 'p-4' : 'p-0 '}`}>
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/book-details/${book.id}`}
            className={`flex items-center gap-3 p-0 bg-[#1A1A1A] transition rounded-r-full rounded-tl-full ${isSingle ? 'p-4' : 'p-0'}`}
          >
            <div
              className={`relative flex-shrink-0  ${
                isSingle ? 'w-[48px] h-[48px]' : 'w-[48px] h-[48px]'
              }`}
            >
              <Image
                src={book.coverPhotoUrl}
                alt={book.title}
                className="object-cover rounded-md w-full h-full"
              />
            </div>
            {/* TEXT */}
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-white truncate font-poppins !my-0">
                {book.title}
              </h3>
              <p className="text-xs text-white truncate font-light font-poppins !my-0">
                By {book.author}
              </p>
              <p className="text-[8px] text-gray font-light font-poppins !my-0 ">
                {book.createdAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

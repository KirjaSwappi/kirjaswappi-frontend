import { Link } from 'react-router-dom';
import Image from '../../../components/shared/Image';

interface BookPopupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  books: any[];
}

export default function BookPopup({ books }: BookPopupProps) {
  const isSingle = books.length === 1;

  return (
    <div
      className={`p-0 ${isSingle ? 'min-w-[280px]' : 'overflow-y-auto min-w-[213px] min-h-[85px]'}`}
    >
      {!isSingle && (
        <div className="p-3">
          <h3 className="font-semibold text-base text-gray">{books.length} books available</h3>
        </div>
      )}
      <div className="p-2">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/book-details/${book.id}`}
            className={`flex items-center gap-3 hover:bg-gray-50 p-3 rounded-xl transition-colors mb-2 last:mb-0`}
          >
            <div className="flex-shrink-0">
              <Image
                src={book.coverPhotoUrl}
                alt={book.title}
                className={`object-cover rounded-lg shadow-sm ${
                  isSingle ? 'w-14 h-18' : 'w-12 h-16'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold truncate mb-1 ${
                  isSingle ? 'text-base text-gray-900' : 'text-sm text-gray-900'
                }`}
              >
                {book.title}
              </h3>
              <p
                className={`truncate mb-1 text-xs ${isSingle ? 'text-gray-600' : 'text-gray-600'}`}
              >
                By {book.author}
              </p>
              <p className="text-xs text-gray">{book.createdAt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

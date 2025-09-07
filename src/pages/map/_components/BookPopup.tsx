import { Link } from 'react-router-dom';
import { IBookWithLocation } from '../interface';
import Image from '../../../components/shared/Image';

interface BookPopupProps {
  books: IBookWithLocation[];
  onBookClick: (bookId: string) => void;
}

export default function BookPopup({ books, onBookClick }: BookPopupProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  if (books.length === 1) {
    const book = books[0];
    return (
      <div className="p-0 min-w-[280px]">
        <Link
          to={`/book-details/${book.id}`}
          className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-xl transition-colors"
          onClick={() => onBookClick(book.id)}
        >
          <div className="flex-shrink-0">
            <Image
              src={book.coverPhotoUrl}
              alt={book.title}
              className="w-14 h-18 object-cover rounded-lg shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600 truncate mb-1">By {book.author}</p>
            <p className="text-xs text-gray-500">{formatTimeAgo(book.createdAt)}</p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-0 max-h-96 overflow-y-auto min-w-[320px]">
      <div className="p-3 border-b border-gray-100">
        <h3 className="font-semibold text-base text-gray-900">{books.length} books available</h3>
      </div>
      <div className="p-2">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/book-details/${book.id}`}
            className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-xl transition-colors mb-2 last:mb-0"
            onClick={() => onBookClick(book.id)}
          >
            <div className="flex-shrink-0">
              <Image
                src={book.coverPhotoUrl}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg shadow-sm"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">{book.title}</h4>
              <p className="text-xs text-gray-600 truncate mb-1">By {book.author}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(book.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

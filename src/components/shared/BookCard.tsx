import { useNavigate } from 'react-router-dom';
import { IBook } from '../../pages/books/interface';
import Image from './Image';

export default function BookCard({ book }: { book: IBook }) {
  if (!book) return null;
  const navigate = useNavigate();

  const { title, author, coverPhotoUrl, id } = book;
  return (
    <div className="sm:max-w-[168px] max-h-[264px] flex flex-col">
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
        className="cursor-pointer"
      >
        <div className="h-[190px] mb-2 rounded-md overflow-hidden	">
          <Image
            className="mx-auto h-full object-cover"
            src={coverPhotoUrl}
            alt={`${title} || 'Your favorite book'`}
          />
        </div>
        <div>
          <h1 className="font-medium text-black text-xs leading-none mb-1 font-poppins truncate">
            {title && title}
          </h1>
          {author && <p className="text-black font-light text-[10px] font-poppins">by {author}</p>}
        </div>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';
import BookCard from '../../../components/shared/BookCard';
import BookSkeleton from '../../../components/shared/skeleton/BookSkeleton';
import { useSkeleton } from '../../../hooks/useSkeleton';
import { useGetAllBooksQuery } from '../../../redux/feature/book/bookApi';
import { useAppSelector } from '../../../redux/hooks';
import { IBook } from '../../books/interface';
import AddBookComponent from './AddBookAction';

export default function BooksListed() {
  const { showSkeleton } = useSkeleton();
  const params = useParams();
  const {
    userInformation: { email, id },
  } = useAppSelector((state) => state.auth);
  const userId = params.id || id;
  const { data, isLoading } = useGetAllBooksQuery({ userId: userId }, { skip: !userId });
  // const { data, isLoading } = useGetBooksListedByIdQuery({ id: userId });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-3 xl:gap-4">
      {id === params.id && !isLoading && (
        <div className={`${!email && 'hidden'}`}>
          <AddBookComponent />
        </div>
      )}
      {isLoading || showSkeleton
        ? Array.from({ length: 10 }, (_, index) => <BookSkeleton key={index} />)
        : data?._embedded?.books &&
          data?._embedded?.books?.map((book: IBook, index: number) => {
            // console.log(book);
            return (
              <BookCard isProfile key={index} book={book} hasPermission={id === book.ownerId} />
            );
          })}
    </div>
  );
}

import BookCard from '../../../components/shared/BookCard';
import BookSkeleton from '../../../components/shared/skeleton/BookSkeleton';
import { useSkeleton } from '../../../hooks/useSkeleton';
import { useAppSelector } from '../../../redux/hooks';
import { IBook } from '../../books/interface';

export default function BookList() {
  const { showSkeleton } = useSkeleton();
  const {
    loading,
    userInformation: { books },
  } = useAppSelector((state) => state.auth);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 sm:gap-[8px] lg:gap-[24px]">
      {loading || showSkeleton
        ? Array.from({ length: 10 }, (_, index) => <BookSkeleton key={index} />)
        : books && books?.map((book: IBook, index: number) => <BookCard key={index} book={book} />)}
    </div>
  );
}

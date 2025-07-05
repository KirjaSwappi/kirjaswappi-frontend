import BookCard from '../../../components/shared/BookCard';
import Button from '../../../components/shared/Button';
import BookSkeleton from '../../../components/shared/skeleton/BookSkeleton';
import { useGetMoreBooksByBookIdQuery } from '../../../redux/feature/book/bookApi';
import { IBook } from '../../books/interface';

export default function MoreFromThisUserBooks({ bookId }: { bookId: string | undefined }) {
  if (!bookId) return;
  const { isFetching, isLoading, data: moreBooks } = useGetMoreBooksByBookIdQuery({ id: bookId });
  const isInitialLoading = isFetching || isLoading;
  return (
    <div>
      <div className="bg-[#E4E4E4] w-full h-[1px] my-5"></div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base text-black font-medium font-poppins">More from this user</h1>
        <Button className="text-primary underline font-poppins font-normal text-sm">See all</Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2 pt-6">
        {moreBooks &&
          moreBooks.map((book: IBook, idx: number) => {
            if (idx === moreBooks.length - 1) {
              return (
                <div key={idx}>
                  <BookCard book={book} />
                </div>
              );
            }
            return <BookCard book={book} key={idx} />;
          })}
        {isInitialLoading && Array.from({ length: 6 }, (_, index) => <BookSkeleton key={index} />)}
      </div>
    </div>
  );
}

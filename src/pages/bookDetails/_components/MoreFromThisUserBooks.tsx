import BookCard from '../../../components/shared/BookCard';
import Button from '../../../components/shared/Button';
import BookSkeleton from '../../../components/shared/skeleton/BookSkeleton';
import { useGetMoreBooksByBookIdQuery } from '../../../redux/feature/book/bookApi';
import { useAppSelector } from '../../../redux/hooks';
import { IBook } from '../../books/interface';

export default function MoreFromThisUserBooks({ bookId }: { bookId: string | undefined }) {
  if (!bookId) return;
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const { isFetching, isLoading, data: moreBooks } = useGetMoreBooksByBookIdQuery({ id: bookId });
  const isInitialLoading = isFetching || isLoading;

  return (
    <div>
      <span className="bg-[#E4E4E4] w-full h-[1px] my-5 block lg:hidden"></span>
      <div className="flex items-center justify-between mt-5 lg:mt-14 mb-4 lg:mb-6">
        <h1 className="text-base text-blackOlive font-medium font-poppins">More from this user</h1>
        <Button className="text-primary underline font-poppins font-normal text-sm lg:hidden">
          See all
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 lg:gap-3 xl:gap-6">
        {moreBooks &&
          moreBooks.map((book: IBook, idx: number) => {
            if (idx === moreBooks.length - 1) {
              return (
                <div key={idx}>
                  <BookCard book={book} hasPermission={book.owner.id === id} />
                </div>
              );
            }
            return <BookCard book={book} key={idx} hasPermission={book.owner.id === id} />;
          })}
        {isInitialLoading && Array.from({ length: 6 }, (_, index) => <BookSkeleton key={index} />)}
      </div>
    </div>
  );
}

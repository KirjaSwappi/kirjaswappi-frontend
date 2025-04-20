import BookCard from "../../../components/shared/BookCard";
import BookSkeleton from "../../../components/shared/skeleton/BookSkeleton";
import { useSkeleton } from "../../../hooks/useSkeleton";
import { useAppSelector } from "../../../redux/hooks";
import { IBook } from "../../books/interface";
import AddBookComponent from "./AddBookComponent";

export default function MyLibrary() {
  const { showSkeleton } = useSkeleton();
  const {
    loading,
    userInformation: { books },
  } = useAppSelector((state) => state.auth);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-2">
      <AddBookComponent />
      {loading || showSkeleton
        ? Array.from({ length: 10 }, (_, index) => <BookSkeleton key={index} />)
        : books &&
          books?.map((book: IBook, index: number) => (
            <BookCard key={index} book={book} />
          ))}
    </div>
  );
}

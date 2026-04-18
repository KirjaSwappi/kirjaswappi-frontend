import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BookCard from '../../../components/shared/BookCard';
import BookSkeleton from '../../../components/shared/skeleton/BookSkeleton';
import { IBook } from '../../books/types/interface';
import { useGetUserByIdQuery } from '../../../redux/feature/auth/authApi';
import { useAppSelector } from '../../../redux/hooks';

export default function BookmarkedBooks() {
  const { t } = useTranslation();
  const { id: userId } = useParams();
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useGetUserByIdQuery({ userId: userId as string }, { skip: !userId });

  const favBooks = (data?.favBooks ?? []) as IBook[];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-3 xl:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (favBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500 font-medium">{t('profile.noBookmarks')}</p>
        <p className="text-xs text-gray-400 mt-1">{t('profile.bookmarksHint')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-3 xl:gap-4">
      {favBooks.map((book) => (
        <BookCard key={book.id} book={book} isProfile hasPermission={id === book.ownerId} />
      ))}
    </div>
  );
}

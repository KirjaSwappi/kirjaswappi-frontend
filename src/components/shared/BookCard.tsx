import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { FaRegClock } from 'react-icons/fa6';
import { PiDotsThreeBold } from 'react-icons/pi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import deleteIcon from '../../assets/deleteIconRed.png';
import editIcon from '../../assets/editBlack.png';
import locationIcon from '../../assets/location-icon.png';
import { useMouseClick } from '../../hooks/useMouse';
import { IBook } from '../../pages/books/types/interface';
import {
  useDeleteBookByIdMutation,
  useLazyGetBookByIdQuery,
} from '../../redux/feature/book/bookApi';
import {
  useAddFavouriteBookMutation,
  useGetUserByIdQuery,
  useRemoveFavouriteBookMutation,
} from '../../redux/feature/auth/authApi';
import { setBookLoading } from '../../redux/feature/book/bookSlice';
import { setLoginModalOpen } from '../../redux/feature/open/openSlice';
import { setBookIdToSwapWith, setSwapBook, setSwapModal } from '../../redux/feature/swap/swapSlice';
import { useAppSelector } from '../../redux/hooks';
import BookCardSwapButton from './BookCardSwapButton';
import Button from './Button';
import DeleteConfirmModal from './DeleteConfirmModal';
import Image from './Image';
import OwnerAvatar from './OwnerAvatar';
import { showToast } from './toast';

export default function BookCard({
  book,
  isProfile = false,
  hasPermission = false,
}: {
  book: IBook;
  isProfile?: boolean;
  hasPermission?: boolean;
}) {
  if (!book) return null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // =========== EDIT/DELETE POPUP CONTROL ===========
  const [open, setOpen] = useState<boolean>(false);
  const { clicked, setClicked, reference } = useMouseClick();
  const userId = useAppSelector((state) => state.auth.userInformation.id);
  const { title, author, coverPhotoUrl, id, offeredBy, coverPhotoUrls } = book;
  // =========== API -> QUERY | MUTATION  ===========
  const [deleteBookById, { isLoading }] = useDeleteBookByIdMutation();
  const [trigger, { isLoading: bookLoading }] = useLazyGetBookByIdQuery();
  const [addFavouriteBook] = useAddFavouriteBookMutation();
  const [removeFavouriteBook] = useRemoveFavouriteBookMutation();
  const { data: userData } = useGetUserByIdQuery({ userId: userId! }, { skip: !userId });
  const isBookmarked = (userData?.favBooks ?? []).some((fav: { id: string }) => fav.id === id);
  // =========== NAVIGATE TO BOOK DETAILS PAGE ===========
  const handleNavigate = (): void => {
    navigate(`/book-details/${id}`, {
      state: 'book-details',
    });
  };

  // =========== DELETE BOOK HANDLER ===========
  const handleBookDeleteById = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await deleteBookById({ id }).unwrap();
      setClicked(false);
      showToast('success', t('toast.bookDeleted'));
      setOpen(false);
    } catch (error) {
      showToast('error', t('toast.bookDeleteFailed'));
    }
  };

  // =========== BOOKMARK HANDLER ===========
  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      dispatch(setLoginModalOpen(true));
      return;
    }
    try {
      if (isBookmarked) {
        await removeFavouriteBook({ userId, bookId: id }).unwrap();
        showToast('success', t('bookmark.removed'));
      } else {
        await addFavouriteBook({ userId, bookId: id }).unwrap();
        showToast('success', t('bookmark.added'));
      }
    } catch {
      showToast('error', t('bookmark.failed'));
    }
  };

  const handleSwap = async () => {
    const response = await trigger({ id }).unwrap();
    dispatch(setSwapBook(response));
    dispatch(setBookIdToSwapWith(id));
    dispatch(setSwapModal(true));
  };
  // =========== IS LOGIN OR SWAP MODAL ===========
  const isLoginOrSwap = () => {
    if (!userId) dispatch(setLoginModalOpen(true));
    else {
      handleSwap();
    }
  };

  useEffect(() => {
    dispatch(setBookLoading(bookLoading));
  }, [bookLoading, dispatch]);

  const imageUrl = Array.isArray(coverPhotoUrls) ? coverPhotoUrls[0] : coverPhotoUrl;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleNavigate();
      }}
      className={`${isProfile ? '' : 'shadow-lg '} rounded-lg`}
    >
      <div className="h-full flex flex-col relative">
        <div id="deleteEditPopup" className="relative">
          <DeleteConfirmModal
            title={t('common.areYouSure')}
            open={open}
            onClose={(e) => {
              e?.stopPropagation();
              setOpen(false);
            }}
            onDelete={(e) => handleBookDeleteById(e)}
            isLoading={isLoading}
          />
          {hasPermission && (
            <div className="absolute right-2 top-2 cursor-pointer z-10 bg-white rounded-[4px] w-6 h-6 flex items-center justify-center shadow-sm">
              <PiDotsThreeBold
                size={24}
                className="text-blackOlive"
                onClick={(e) => {
                  e.stopPropagation();
                  setClicked((prev) => !prev);
                }}
              />
            </div>
          )}
          {!hasPermission && userId && (
            <button
              type="button"
              className="absolute left-2 top-2 z-10 bg-white rounded-[4px] w-6 h-6 flex items-center justify-center shadow-sm cursor-pointer border-0 p-0"
              onClick={handleBookmark}
              aria-label={isBookmarked ? t('bookmark.removed') : t('bookmark.added')}
            >
              {isBookmarked ? (
                <BsBookmarkFill className="w-3.5 h-3.5 text-primary" />
              ) : (
                <BsBookmark className="w-3.5 h-3.5 text-grayDark" />
              )}
            </button>
          )}
          {hasPermission && clicked && (
            <div
              ref={reference}
              className="absolute right-2 top-10 w-[138px] bg-white shadow-lg rounded-md z-10"
            >
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/update-book/${id}`);
                }}
                className="flex items-center gap-2 p-2 border-b border-[#D3D3D3] w-full cursor-pointer"
                type="button"
              >
                <Image src={editIcon} alt="edit" className="h-[18px]" />
                <p className="font-poppins font-normal text-sm">{t('edit')}</p>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
                className="flex items-center gap-2 p-2 w-full"
                type="button"
              >
                <Image src={deleteIcon} alt="delete" className="h-[18px]" />
                <p className="font-poppins font-normal text-sm text-[#EA244E] cursor-pointer">
                  {t('delete')}
                </p>
              </Button>
            </div>
          )}
          <div className="relative">
            <div className={`${isProfile ? 'h-[156px] lg:h-[174px]' : 'h-[156px] lg:h-[214px]'} `}>
              <Image
                className="w-full h-full object-cover rounded-t-md"
                src={imageUrl}
                alt={title || 'Book cover'}
              />
            </div>
            {!hasPermission && (
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  isLoginOrSwap();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    isLoginOrSwap();
                  }
                }}
                className="w-full absolute left-1 bottom-2 p-2"
              >
                <BookCardSwapButton />
              </div>
            )}
          </div>
        </div>
        <div className={`${isProfile ? 'p-0 mt-2' : 'p-3 '} cursor-pointer`}>
          <h1
            className="font-poppins font-medium text-xs mt-1 leading-[100%] text-gray-900 mb-0.5 
            truncate"
          >
            {title}
          </h1>
          <p
            className={`font-poppins font-light text-[10px] mt-[2px] leading-[13.77px] text-gray-600 
              ${isProfile ? '' : 'mb-2'} `}
          >
            {' '}
            {t('by')} {author}
          </p>
          <div className={`${isProfile ? 'hidden' : 'block'}`}>
            <div className="flex items-center mb-1.5 lg:mb-2">
              <Image src={locationIcon} alt="Location" className="mr-1 flex-shrink-0 w-4 h-4" />
              <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700 capitalize">
                {book?.location?.city || book?.bookLocation || t('common.unknown')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded-full">
                  <OwnerAvatar ownerId={book.ownerId} />
                </div>
                {offeredBy && (
                  <span className="font-poppins font-normal text-[10px] leading-[13.77px] text-gray-700">
                    {offeredBy}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <FaRegClock className="text-xs text-grayDark" />
                <p className="font-poppins font-normal text-xs text-grayDark">{book?.offeredAgo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

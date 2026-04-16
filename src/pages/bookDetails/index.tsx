import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { IoShareSocialOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import editIcon from '../../assets/editBlack.png';
import exchangeIcon from '../../assets/exchangeIcon.png';
import leftArrowIcon from '../../assets/leftArrow.png';
import Breadcrumb from '../../components/shared/Breadcrumb';
import ErrorState from '../../components/shared/ErrorState';
import Image from '../../components/shared/Image';
import Spinner from '../../components/shared/Spinner';
import PageTitle from '../../components/shared/PageTitle';
import { useLoginModalOrSwapRequest } from '../../hooks/useLoginOrSwapRequest';
import {
  useGetUserProfileImageQuery,
  useAddFavouriteBookMutation,
  useRemoveFavouriteBookMutation,
  useGetUserByIdQuery,
} from '../../redux/feature/auth/authApi';
import { setLoginModalOpen } from '../../redux/feature/open/openSlice';
import { useGetBookByIdQuery } from '../../redux/feature/book/bookApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { goToTop } from '../../utility/helper';
import { showToast } from '../../components/shared/toast';
import BookActionButton from './_components/BookActionButton';
import BookDescription from './_components/BookDescription';
import BookImageSlider from './_components/BookImageSlider';
import BookType from './_components/BookType';
import Exchanges from './_components/Exchanges';
import MoreFromThisUserBooks from './_components/MoreFromThisUserBooks';
import OfferedBy from './_components/OfferedBy';
import SwapRequestButton from './_components/SwapRequestButton';
import VerticalImageSlider from './_components/VerticalImageSlider';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isProfile, setProfile] = useState(false);
  const { handleLoginOrSwap } = useLoginModalOrSwapRequest();
  const { userInformation } = useAppSelector((state) => state.auth);
  const { loginModalOpen } = useAppSelector((state) => state.open);
  const {
    data: bookData,
    isLoading: bookLoading,
    isError,
  } = useGetBookByIdQuery({ id: id }, { skip: !id });
  const { data: userProfile } = useGetUserProfileImageQuery(
    { userId: bookData?.owner?.id },
    {
      skip: !bookData?.owner?.id,
    },
  );
  const { t } = useTranslation();
  const [addFavouriteBook] = useAddFavouriteBookMutation();
  const [removeFavouriteBook] = useRemoveFavouriteBookMutation();
  const { data: currentUserData } = useGetUserByIdQuery(
    { userId: userInformation?.id ?? '' },
    { skip: !userInformation?.id },
  );
  const isBookmarked = (currentUserData?.favBooks ?? []).some(
    (fav: { id: string }) => fav.id === id,
  );

  // =========== HANDLERS ===========
  const handleBookmark = async () => {
    if (!userInformation?.id) {
      dispatch(setLoginModalOpen(true));
      return;
    }
    if (!id) return;
    try {
      if (isBookmarked) {
        await removeFavouriteBook({ userId: userInformation.id, bookId: id }).unwrap();
        showToast('success', t('bookmark.removed'));
      } else {
        await addFavouriteBook({ userId: userInformation.id, bookId: id }).unwrap();
        showToast('success', t('bookmark.added'));
      }
    } catch {
      showToast('error', t('bookmark.failed'));
    }
  };

  const handleShare = async () => {
    if (!id) return;
    const url = `${window.location.origin}/book-details/${id}`;
    const shareData = { title: bookData?.title || 'KirjaSwappi', url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        showToast('success', t('share.linkCopied'));
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      showToast('error', t('share.failed'));
    }
  };

  useEffect(() => {
    if (userInformation?.id === bookData?.owner?.id) setProfile(true);
    else setProfile(false);
  }, [bookData?.owner?.id, userInformation.id]);

  useEffect(() => {
    goToTop();
  }, [id]);

  const navigateToEditBook = () => {
    if (isProfile) navigate(`/profile/update-book/${id}`);
  };

  const isEditBookOrSwapRequestFn = () => {
    if (isProfile) navigateToEditBook();
    else handleLoginOrSwap(bookData, id);
  };

  if (bookLoading) return <Spinner variant="overlay" />;

  if (isError)
    return (
      <ErrorState
        message={t('bookDetails.errorMessage')}
        onRetry={() => window.location.reload()}
        retryLabel={t('bookDetails.tryAgain')}
      />
    );

  return (
    <div className="bg-light lg:bg-white min-h-screen pb-20">
      <PageTitle title={bookData?.title || t('bookDetails.title')} />
      {!loginModalOpen && (
        <div className="lg:hidden left-0 top-0 w-full flex justify-between px-4 bg-white h-14 z-50 fixed">
          <div className="flex items-center gap-4">
            <Image
              src={leftArrowIcon}
              alt="Go back"
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-black text-base font-medium leading-none mt-[3px]">
              {t('bookDetails.title')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              title="Share"
              className="cursor-pointer bg-transparent border-0 p-0"
            >
              <IoShareSocialOutline className="w-5 h-5 text-black" />
            </button>
            {isProfile ? (
              <Image
                src={editIcon}
                alt="Edit book"
                onClick={navigateToEditBook}
                className="w-6 h-6 cursor-pointer"
              />
            ) : (
              <button
                type="button"
                onClick={handleBookmark}
                title="Bookmark"
                className="cursor-pointer bg-transparent border-0 p-0"
              >
                {isBookmarked ? (
                  <BsBookmarkFill className="w-5 h-5 text-primary" />
                ) : (
                  <BsBookmark className="w-5 h-5 text-black" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="bg-light pt-6 hidden lg:block">
        <div className="container">
          <Breadcrumb />
        </div>
      </div>
      <div className="lg:before:w-full lg:before:h-[340px] lg:before:bg-light lg:before:absolute mt-12 lg:mt-0">
        <div className="container">
          <div className=" flex flex-col lg:flex-row items-start gap-5 xl:gap-10 pt-6">
            <div className="w-full lg:w-[45%]">
              <div className="lg:hidden mx-auto w-[160px] h-[190px] mb-9 lg:mb-16">
                <BookImageSlider images={bookData?.coverPhotoUrls || []} />
              </div>
              <div className="hidden lg:block">
                <VerticalImageSlider images={bookData?.coverPhotoUrls || []} />
              </div>
              <div className="ml-auto -mt-8 xl:mt-5 w-10/12 hidden lg:block">
                {bookData?.condition && (
                  <BookType
                    condition={bookData?.condition}
                    language={bookData?.language}
                    publishedYear={bookData?.publishedYear}
                  />
                )}
              </div>
            </div>
            <div className="w-full lg:w-[53%] z-10">
              <div className="text-center lg:text-left">
                <h1 className="font-medium lg:font-semibold text-black lg:text-[#262626] text-sm lg:text-3xl xl:text-[40px] xl:leading-[48px] mb-2 font-poppins">
                  {bookData?.title}
                </h1>
                {bookData?.author && (
                  <p className="text-blackOlive text-sm font-poppins font-normal">
                    {' '}
                    {t('bookDetails.byAuthor', { author: bookData?.author })}
                  </p>
                )}
                <div className="flex items-center justify-center lg:justify-start flex-wrap  gap-2 mt-3">
                  {bookData?.genres?.map((favItem: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="lg:border border-[#BADBFD] px-2 py-1.5 rounded-md text-smokyBlack lg:bg-[#DBEDFF] lg:text-primary">
                        <p className="font-light text-xs font-poppins">{favItem}</p>
                      </div>
                      <span
                        className={`${
                          bookData?.genres.length - 1 === index ? 'hidden' : 'block'
                        } inline-block mx-2 font-poppins font-light text-sm lg:hidden`}
                      >
                        |
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col-reverse lg:flex-col">
                  <div>
                    <h3 className="text-sm font-normal font-poppins text-smokyBlack mt-8 lg:mt-5 mb-2 text-left ">
                      {t('bookDetails.bookDescription')}
                    </h3>
                    <BookDescription description={bookData?.description} />
                  </div>
                  <div>
                    <div className="flex flex-col lg:items-center lg:flex-row gap-3 items-center mt-8 mb-2">
                      <div className="flex items-center justify-center bg-primary w-10 h-10 rounded-full">
                        <Image src={exchangeIcon} alt="exchangeIcon" className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-poppins font-normal text-sm text-blackOlive">
                          {t('bookDetails.exchangeCondition')}
                        </h3>
                        <p className="text-[10px] text-blackOlive">
                          {t('bookDetails.eitherOneOfThese')}
                        </p>
                      </div>
                    </div>
                    <div className="lg:mt-5">
                      <Exchanges swapCondition={bookData?.swapCondition} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <OfferedBy
                  imageUrl={userProfile?.imageUrl}
                  ownerName={bookData?.owner?.name}
                  ownerId={bookData?.owner?.id}
                  location={bookData?.location}
                />
              </div>
              <div className="mt-5 hidden lg:block">
                <BookActionButton
                  btnValue={isProfile ? t('books.editBook') : t('bookDetails.requestSwap')}
                  onClick={isEditBookOrSwapRequestFn}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                  isBookmarked={isBookmarked}
                  isOwner={isProfile}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 lg:hidden">
          {bookData?.condition && (
            <BookType
              condition={bookData?.condition}
              language={bookData?.language}
              publishedYear={bookData?.publishedYear}
            />
          )}
        </div>
        <div className="container lg:hidden">
          <OfferedBy
            imageUrl={userProfile?.imageUrl}
            ownerName={bookData?.owner?.name}
            ownerId={bookData?.owner?.id}
            location={bookData?.location}
          />
        </div>
      </div>
      <div className="container">
        <MoreFromThisUserBooks bookId={id} />
      </div>
      {!loginModalOpen && !isProfile && (
        <SwapRequestButton ownerName={bookData?.owner?.name} onClick={isEditBookOrSwapRequestFn} />
      )}
    </div>
  );
}

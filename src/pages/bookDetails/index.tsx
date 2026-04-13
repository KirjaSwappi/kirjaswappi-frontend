import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import editIcon from '../../assets/editBlack.png';
import exchangeIcon from '../../assets/exchangeIcon.png';
import bookmarkIcon from '../../assets/icon_bookmark.png';
import leftArrowIcon from '../../assets/leftArrow.png';
import shareIcon from '../../assets/share.png';
import Breadcrumb from '../../components/shared/Breadcrumb';
import Image from '../../components/shared/Image';
import Loader from '../../components/shared/Loader';
import PageTitle from '../../components/shared/PageTitle';
import { useLoginModalOrSwapRequest } from '../../hooks/useLoginOrSwapRequest';
import { useGetUserProfileImageQuery } from '../../redux/feature/auth/authApi';
import { useGetBookByIdQuery } from '../../redux/feature/book/bookApi';
import { useAppSelector } from '../../redux/hooks';
import { goToTop } from '../../utility/helper';
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

  if (bookLoading) return <Loader />;

  if (isError)
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="font-poppins text-grayDark text-sm mb-4">{t('bookDetails.errorMessage')}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-poppins text-sm text-white bg-primary px-4 py-2 rounded-lg cursor-pointer"
          >
            {t('bookDetails.tryAgain')}
          </button>
        </div>
      </div>
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
            <Image src={shareIcon} alt="Share" className="h-5" />
            <Image
              src={isProfile ? editIcon : bookmarkIcon}
              alt={isProfile ? 'Edit book' : 'Bookmark'}
              onClick={navigateToEditBook}
              className="w-6 h-6"
            />
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

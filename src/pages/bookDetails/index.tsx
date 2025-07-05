import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import bookDetailsBg from '../../assets/bookdetailsbg.jpg';
import editIcon from '../../assets/editBlack.png';
import exchangeIcon from '../../assets/exchangeIcon.png';
import BookMarkIcon from '../../assets/icon_bookmark.png';
import leftArrowIcon from '../../assets/leftArrow.png';
import locationIcon from '../../assets/location-icon.png';
import profileIcon from '../../assets/profileIcon.png';
import shareIcon from '../../assets/share-icon.png';
import upArrowIcon from '../../assets/upArrow.png';
import Button from '../../components/shared/Button';
import Image from '../../components/shared/Image';
import Loader from '../../components/shared/Loader';
import BookSkeleton from '../../components/shared/skeleton/BookSkeleton';
import { useGetUserProfileImageQuery } from '../../redux/feature/auth/authApi';
import { useGetBookByIdQuery } from '../../redux/feature/book/bookApi';
import { setSwapBook, setSwapModal } from '../../redux/feature/swap/swapSlice';
import { useAppSelector } from '../../redux/hooks';
import { goToTop } from '../../utility/helper';
import BookImageSlider from './_components/BookImageSlider';
import BookType from './_components/BookType';
import Exchanges from './_components/Exchanges';
import SwapRequestButton from './_components/SwapRequestButton';
import VerticalImageSlider from './_components/VerticalImageSlider';

export default function BookDetails() {
  const MAX_LENGTH = 95;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfile, setProfile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { userInformation } = useAppSelector((state) => state.auth);
  const { data: bookData, isLoading: bookLoading } = useGetBookByIdQuery({ id: id }, { skip: !id });
  const { data: userProfile } = useGetUserProfileImageQuery(
    { userId: bookData?.owner?.id },
    {
      skip: !bookData?.owner?.id,
    },
  );
  useEffect(() => {
    if (userInformation?.id === bookData?.owner?.id) {
      setProfile(true);
    }
  }, [bookData?.owner?.id]);

  const navigateToEditBook = () => {
    if (isProfile) {
      navigate(`/profile/update-book/${id}`);
    }
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const loginModalOrSwapRequestModal = (): void => {
    // =========== If user has in state show the swap request modal ===========
    // console.log('test', bookData);
    if (userInformation.email) {
      dispatch(setSwapModal(true));
      dispatch(setSwapBook(bookData));
    } else {
      // =========== If user state is empty show the login modal for login user ===========
      console.log('ok');
    }
  };

  if (bookLoading) return <Loader />;
  goToTop();
  return (
    <div className="bg-white ">
      <div className="lg:hidden absolute left-0 top-0 w-full flex justify-between px-4 bg-white h-14">
        <div className="flex items-center gap-4">
          <Image
            src={leftArrowIcon}
            alt="icon"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-black text-base font-medium leading-none mt-[3px]">Book Details</h2>
        </div>
        <div className="flex items-center gap-4">
          <Image src={shareIcon} alt="icon" />
          <Image
            src={isProfile ? editIcon : BookMarkIcon}
            alt="icon"
            onClick={navigateToEditBook}
          />
        </div>
      </div>
      <div className="lg:hidden w-full h-[172px] mt-14 lg:mt-0">
        <Image src={bookDetailsBg} className="w-full h-full" />
      </div>
      {/* <Breadcrumb /> */}
      <div className="before:w-full before:h-[340px] before:bg-[#f2f4f8] before:absolute">
        <div className="lg:hidden mx-auto w-[160px] h-[190px] -mt-32 mb-16">
          <BookImageSlider images={bookData?.coverPhotoUrls || []} />
        </div>
        <div className="container">
          <div className=" flex items-start gap-5 lg:gap-10 pt-6">
            <div className="w-[45%]">
              <VerticalImageSlider images={bookData?.coverPhotoUrls || []} />
              {/* ================== START BOOK CONDITION TYPE [BOOK -> CONDITION, LANGUAGE, & LENGTH]================== */}
              <div className="w-[497px] ml-auto mt-5">
                {bookData?.condition && <BookType condition={bookData?.condition} />}
              </div>
            </div>
            <div className="max-w-[55%] z-10">
              <div className="text-center lg:text-left">
                <h1 className="font-medium lg:font-semibold text-black lg:text-[#262626] text-sm lg:text-[40px] leading-none lg:leading-[48px] mb-2 font-poppins">
                  {bookData?.title}
                </h1>
                {bookData.author && (
                  <p className="text-[#404040] text-sm font-poppins font-normal">
                    {' '}
                    by {bookData.author}
                  </p>
                )}

                <div className="flex items-center justify-center lg:justify-start flex-wrap  gap-2 mt-3">
                  {bookData?.genres?.map((favItem: string[], index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="border border-[#BADBFD] px-2 py-1.5 rounded-md bg-[#DBEDFF] text-primary">
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
                <h3 className="text-sm font-normal font-poppins text-smokyBlack mt-5 mb-2 ">
                  Book Description
                </h3>
                <p className="text-xs font-light font-poppins text-grayDark">
                  {bookData?.description}
                </p>
                <div className="flex flex-col lg:items-center lg:flex-row gap-3 items-center mt-9 mb-3">
                  <div className="flex items-center justify-center bg-primary w-10 h-10 rounded-full">
                    <Image src={exchangeIcon} alt="exchangeIcon" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-normal text-sm text-[#404040]">
                      Exchange Condition
                    </h3>
                    <p className="text-[10px] text-[#404040]">Either one of these</p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Exchanges swapCondition={bookData?.swapCondition} />
              </div>
            </div>
          </div>
        </div>
        {/* ================== START Exchanges Condition ==================  */}
        {/* <div className="pl-4">
          <Exchanges swapCondition={bookData?.swapCondition} />
        </div> */}
        {/* ================== END Exchanges Condition ==================  */}
        <div className="container text-left mb-5">
          <h3 className="text-sm font-normal font-poppins text-smokyBlack mt-5 mb-2 ">
            Book Description
          </h3>
          <p className="text-xs font-light font-poppins text-grayDark">
            {isExpanded || bookData?.description?.length <= MAX_LENGTH
              ? bookData?.description
              : `${bookData?.description.substring(0, MAX_LENGTH)}...`}
            {bookData?.description.length > MAX_LENGTH && (
              <button
                onClick={toggleReadMore}
                className="text-primary ml-1 text-sm font-normal font-poppins"
              >
                {isExpanded ? ' More Less' : ' More'}
              </button>
            )}
          </p>
        </div>
        {/* ================== START BOOK CONDITION TYPE [BOOK -> CONDITION, LANGUAGE, & LENGTH]================== */}
        {bookData?.condition && <BookType condition={bookData?.condition} />}
        <div className="container">
          <div className=" flex items-center gap-1 my-5">
            <Image src={locationIcon} alt="location" />
            <p className="text-xs font-poppins font-normal">Senate Square, Helsinki</p>
          </div>
          <div>
            <h3 className="text-xs font-normal font-poppins text-grayDark mb-2">Offered by</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Image
                  className="w-4 h-4 rounded-full"
                  src={(userProfile?.imageUrl && userProfile?.imageUrl) || profileIcon}
                  alt="profile"
                />
                <p className="text-xs font-normal font-poppins text-black">
                  {bookData?.owner?.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Image src={upArrowIcon} alt="profile" />
                <p className="text-xs font-normal font-poppins text-black">95% Positive Swaps</p>
              </div>
            </div>
          </div>
          <div className="bg-[#E4E4E4] w-full h-[1px] my-5"></div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base text-black font-medium font-poppins">More from this user</h1>
            <Button className="text-primary underline font-poppins font-normal text-sm">
              See all
            </Button>
          </div>
        </div>
        <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <BookSkeleton key={index} />
          ))}
        </div>
      </div>
      {/* ================== SWAP REQUEST BUTTON CONTAINER ON THE FOOTER [SCREEN SIZE: MOBILE] ================== */}
      {!isProfile && (
        <SwapRequestButton
          ownerName={bookData?.owner?.name}
          onClick={loginModalOrSwapRequestModal}
        />
      )}
    </div>
  );
}

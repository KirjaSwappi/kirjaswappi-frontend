import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import bookDetailsBg from '../../assets/bookdetailsbg.jpg';
import editIcon from '../../assets/editBlack.png';
import exchangeIcon from '../../assets/exchange.png';
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
import BookType from './_components/BookType';
import Exchanges from './_components/Exchanges';
import SwapRequestButton from './_components/SwapRequestButton';

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
    <div>
      <div className="absolute left-0 top-0 w-full flex justify-between px-4 bg-white h-14">
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
      <div className="w-full h-[172px] mt-14">
        <Image src={bookDetailsBg} className="w-full h-full" />
      </div>
      <div className="mx-auto w-[160px] h-[190px] -mt-32">
        <Image src={bookData?.coverPhotoUrls[0]} className="w-full h-full rounded-lg" />
      </div>
      <div className=" pb-32">
        <div className="container text-center my-5 ">
          <h1 className="font-medium text-black text-sm leading-none mb-1 font-poppins">
            {bookData?.title}
          </h1>
          <div className="flex items-center justify-center flex-wrap">
            {bookData?.genres?.map((favItem: string[], index: number) => (
              <div key={index} className="flex items-center">
                <p className="text-black font-light text-xs font-poppins">{favItem}</p>
                <span
                  className={`${
                    bookData?.genres.length - 1 === index ? 'hidden' : 'block'
                  } inline-block mx-2 font-poppins font-light text-sm`}
                >
                  |
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center mt-9 mb-3">
            <Image src={exchangeIcon} alt="exchangeIcon" />
            <h3 className="font-poppins font-normal text-sm text-[#404040]">Exchange Condition</h3>
            <p className="text-[10px] text-[#404040]">Either one of these</p>
          </div>
        </div>
        {/* ================== START Exchanges Condition ==================  */}
        <div className="pl-4">
          <Exchanges swapCondition={bookData?.swapCondition} />
        </div>
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
      {/* ==================SWAP REQUEST BUTTON CONTAINER ON THE FOOTER [SCREEN SIZE: MOBILE]================== */}
      {!isProfile && (
        <SwapRequestButton
          ownerName={bookData?.owner?.name}
          onClick={loginModalOrSwapRequestModal}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import exchangeIcon from '../../assets/exchangeIcon.png';
import leftArrowIcon from '../../assets/leftArrow.png';
import locationIcon from '../../assets/location-icon.png';
import profileIcon from '../../assets/profileIcon.png';
import Breadcrumb from '../../components/shared/Breadcrumb';
import Image from '../../components/shared/Image';
import Loader from '../../components/shared/Loader';
import { useGetUserProfileImageQuery } from '../../redux/feature/auth/authApi';
import { useGetBookByIdQuery } from '../../redux/feature/book/bookApi';
import { setSwapBook, setSwapModal } from '../../redux/feature/swap/swapSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { goToTop } from '../../utility/helper';
import BookActionButton from './_components/BookActionButton';
import BookDescription from './_components/BookDescription';
import BookImageSlider from './_components/BookImageSlider';
import BookType from './_components/BookType';
import Exchanges from './_components/Exchanges';
import SwapRequestButton from './_components/SwapRequestButton';
import VerticalImageSlider from './_components/VerticalImageSlider';
export default function BookDetails() {
  // const MAX_LENGTH = 95;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isProfile, setProfile] = useState(false);
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

  // const navigateToEditBook = () => {
  //   if (isProfile) {
  //     navigate(`/profile/update-book/${id}`);
  //   }
  // };

  // const toggleReadMore = () => {
  //   setIsExpanded(!isExpanded);
  // };

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
    <div className="bg-light lg:bg-white min-h-screen">
      <div className="lg:hidden absolute left-0 top-0 w-full flex justify-between px-4 bg-white h-14 z-50">
        <div className="flex items-center gap-4">
          <Image
            src={leftArrowIcon}
            alt="icon"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-black text-base font-medium leading-none mt-[3px]">Book Details</h2>
        </div>
        {/* <div className="flex items-center gap-4">
          <Image src={shareIcon} alt="icon" />
          <Image
            src={isProfile ? editIcon : BookMarkIcon}
            alt="icon"
            onClick={navigateToEditBook}
          />
        </div> */}
      </div>
      {/* <div className="lg:hidden w-full h-[172px] mt-14 lg:mt-0">
        <Image src={bookDetailsBg} className="w-full h-full" />
      </div> */}

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
                {bookData?.condition && <BookType condition={bookData?.condition} />}
              </div>
            </div>
            <div className="w-full lg:w-[53%] z-10">
              <div className="text-center lg:text-left">
                <h1 className="font-medium lg:font-semibold text-black lg:text-[#262626] text-sm lg:text-3xl xl:text-[40px] leading-none xl:leading-[48px] mb-2 font-poppins">
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
                <BookDescription description={bookData.description} />
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
              <div className="flex flex-row-reverse justify-end gap-8 mt-14">
                <div className="flex  gap-1 my-5">
                  <span className="block w-[1px] h-4 bg-[#B2B2B2] mr-8"></span>
                  <Image src={locationIcon} alt="location" />
                  <p className="text-xs font-poppins font-normal">Senate Square, Helsinki</p>
                </div>
                <div>
                  <div className="flex gap-8 items-end">
                    <div>
                      <h3 className="text-xs font-normal font-poppins text-grayDark mb-2">
                        Offered by
                      </h3>
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
                    </div>
                    {/* <span className="block w-[1px] h-4 bg-[#B2B2B2]"></span>
                    <div className="flex items-center gap-1">
                      <Image src={upArrowIcon} alt="profile" />
                      <p className="text-xs font-normal font-poppins text-black">
                        95% Positive Swaps
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="mt-8 hidden lg:block">
                <BookActionButton btnValue="Request Swap" onClick={() => console.log('o')} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================== START Exchanges Condition ==================  */}
      {/* <div className="pl-4">
          <Exchanges swapCondition={bookData?.swapCondition} />
        </div> */}
      {/* ================== END Exchanges Condition ==================  */}
      {/* <div className="container text-left mb-5">
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
        </div> */}
      {/* {bookData?.condition && <BookType condition={bookData?.condition} />} */}
      {/* <div className="container">
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
        </div> */}
      {/* <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <BookSkeleton key={index} />
          ))}
        </div> */}
      {/* </div> */}
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

import { FaRegUser } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import locationIcon from '../../../assets/location-icon.png';
import profileCover from '../../../assets/profileCover.jpg';
import Image from '../../../components/shared/Image';
import {
  useGetUserByIdQuery,
  useGetUserCoverImageQuery,
  useGetUserProfileImageQuery,
} from '../../../redux/feature/auth/authApi';
import { useGetAllBooksQuery } from '../../../redux/feature/book/bookApi';
import { useGetInboxByStatusQuery } from '../../../redux/feature/messages/inboxApi';
import { useAppSelector } from '../../../redux/hooks';
import { isFetchBaseQueryError } from '../../../utility/rtkError';
export default function UserProfile() {
  const params = useParams();
  const {
    userInformation: { id },
  } = useAppSelector((state) => state.auth);
  const userId = params.id || id;
  const {
    data: imageData,
    isLoading,
    error,
  } = useGetUserProfileImageQuery(
    { userId: userId },
    { skip: !userId, refetchOnMountOrArgChange: true },
  );
  const {
    data: coverImage,
    isLoading: isCoverLoading,
    error: coverError,
  } = useGetUserCoverImageQuery(
    { userId: userId },
    { skip: !userId, refetchOnMountOrArgChange: true },
  );
  const { data, isLoading: isUserLoading } = useGetUserByIdQuery(
    { userId: userId as string },
    {
      skip: !userId,
    },
  );
  const { data: booksData } = useGetAllBooksQuery({ ownerId: userId }, { skip: !userId });
  const isOwnProfile = userId === id;
  const { data: completedSwaps } = useGetInboxByStatusQuery(
    { status: 'Completed' },
    { skip: !isOwnProfile },
  );
  const booksCount = booksData?.page?.totalElements ?? 0;
  const swapsCount = isOwnProfile ? (completedSwaps?.length ?? 0) : '-';

  return (
    <div>
      <div>
        <div className="w-full h-[108px] z-0 overflow-hidden lg:rounded-t-xl">
          {isCoverLoading ? (
            <div className="w-full h-full bg-platinum animate-pulse shadow-sm"></div>
          ) : (
            <div className=" h-[108px]">
              {coverImage?.imageUrl === undefined ||
              (isFetchBaseQueryError(coverError) && coverError.status === 403) ? (
                <Image src={profileCover} className="w-full h-full " />
              ) : (
                <Image
                  src={coverImage?.imageUrl as string}
                  className="w-full h-full object-cover bg-top"
                />
              )}
            </div>
          )}
        </div>
        <div className="absolute top-4/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-white border-2 border-white">
          {isLoading ? (
            <div className="w-full h-full bg-platinum animate-pulse rounded-full shadow-sm"></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {imageData?.imageUrl === undefined ||
              (isFetchBaseQueryError(error) && error?.status === 403) ? (
                <FaRegUser size={48} className="text-night" />
              ) : (
                <Image
                  src={imageData?.imageUrl as string}
                  className="w-[80px] h-[80px] object-cover relative rounded-full border-2 border-white"
                />
              )}
            </div>
          )}
        </div>
        {isUserLoading ? (
          <div className=" mt-16 px-3 flex flex-col gap-2">
            <div className="w-full h-4 bg-platinum animate-pulse shadow-sm rounded-md"></div>
            <div className="w-8/12 h-3 bg-platinum animate-pulse shadow-sm rounded-md"></div>
            <div className="w-5/12 h-3 bg-platinum animate-pulse shadow-sm rounded-md"></div>
          </div>
        ) : (
          <div className="text-center mt-16 px-3">
            <h1 className="font-medium text-black text-sm leading-none mb-3 font-poppins">
              {data?.firstName + ' ' + data?.lastName}
            </h1>
            <div className="flex items-center justify-center gap-1 lg:gap-1.5 flex-wrap">
              {data?.favGenres?.map((favItem: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center lg:bg-primary-light lg:px-2 lg:py-1 lg:rounded"
                >
                  <p className="text-smokyBlack lg:text-primary font-light text-xs font-poppins">
                    {favItem}
                  </p>
                  <span
                    className={`lg:hidden ${
                      data?.favGenres.length - 1 === index ? 'hidden' : 'block'
                    } inline-block mx-2 font-poppins font-light text-sm`}
                  >
                    |
                  </span>
                </div>
              ))}
            </div>
            <p className="text-grayDark font-poppins text-xs font-normal mt-3 text-center hidden lg:block">
              {data?.aboutMe}
            </p>
          </div>
        )}
        <div className="hidden lg:block border-y border-AntiFlashWhite mt-5 text-center">
          <div className="flex items-center py-2 px-4 justify-evenly">
            <div className="flex flex-col gap-1 items-center">
              <h4 className="font-poppins text-xs font-light text-[#262626]">Total Swaps</h4>
              <p className="font-poppins text-xs font-medium text-smokyBlack">{swapsCount}</p>
            </div>
            <span className="h-12 w-[1px] block bg-platinumMix"></span>
            <div className="flex flex-col gap-1 items-center">
              <h4 className="font-poppins text-xs font-light text-[#262626]">Books Listed</h4>
              <p className="font-poppins text-xs font-medium text-smokyBlack">{booksCount}</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block border-b border-AntiFlashWhite px-4 py-5">
          {data?.city && (
            <div className="flex flex-row gap-1 items-center">
              <Image src={locationIcon} alt="edit" className="w-4" />
              <p className="font-poppins text-xs font-light text-blackOlive">{data.city}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

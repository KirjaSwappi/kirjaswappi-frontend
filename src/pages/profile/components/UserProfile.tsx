import { FaRegUser } from 'react-icons/fa6';
import locationIcon from '../../../assets/location-icon.png';
import profileCover from '../../../assets/profileCover.jpg';
import ratingIcon from '../../../assets/rating.png';
import starIcon from '../../../assets/star.png';
import Image from '../../../components/shared/Image';
import {
  useGetUserCoverImageQuery,
  useGetUserProfileImageQuery,
} from '../../../redux/feature/auth/authApi';
import { useAppSelector } from '../../../redux/hooks';
import UserTabView from './UserTabView';
export default function UserProfile() {
  // const { t } = useTranslation();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { open } = useAppSelector((state) => state.open);
  const {
    userInformation: { id, firstName, lastName, favGenres },
  } = useAppSelector((state) => state.auth);
  const { data: imageData, isLoading } = useGetUserProfileImageQuery({ userId: id }, { skip: !id });
  const { data: coverImage } = useGetUserCoverImageQuery({ userId: id }, { skip: !id });

  return (
    <div>
      <div className="container">
        <div className="flex gap-5">
          <div className="lg:min-h-[87vh] w-[30%] xl:w-3/12 bg-white rounded-xl relative">
            <div className="w-full h-[108px] z-0 overflow-hidden rounded-t-xl">
              {coverImage?.imageUrl === undefined ? (
                <Image src={profileCover} className="w-full h-full " />
              ) : (
                <Image
                  src={coverImage?.imageUrl as string}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute top-4/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-white">
              {isLoading ? (
                <div className="w-full h-full bg-platinum animate-pulse rounded-full shadow-sm"></div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {imageData?.imageUrl === undefined ? (
                    <FaRegUser size={72} className="text-night" />
                  ) : (
                    <Image
                      src={imageData?.imageUrl as string}
                      className="w-[80px] h-[80px] object-cover relative rounded-full border-2 border-white"
                    />
                  )}
                  <div className="min-w-7 h-7 bg-white cursor-pointer z-[99999999px] absolute -bottom-2 rounded-full flex items-center justify-center border border-[#E5E5E5] gap-1 px-2">
                    <Image src={starIcon} alt="edit" className="w-3" />
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-16 px-3">
              <h1 className="font-medium text-black text-sm leading-none mb-3 font-poppins">
                {firstName + ' ' + lastName}
              </h1>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {favGenres?.map((favItem, index) => (
                  <div key={index} className="flex items-center bg-primary-light px-2 py-1 rounded">
                    <p className="text-black lg:text-primary font-light text-xs font-poppins">
                      {favItem}
                    </p>
                    <span
                      className={`lg:hidden bg- ${
                        favGenres.length - 1 === index ? 'hidden' : 'block'
                      } inline-block mx-2 font-poppins font-light text-sm`}
                    >
                      |
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-y border-AntiFlashWhite mt-5 text-center">
              <div className="flex items-center py-2 px-4 justify-between">
                <div className="flex flex-col gap-1 items-center">
                  <h4 className="font-poppins text-xs font-light text-[#262626]">Total Swaps</h4>
                  <p className="font-poppins text-xs font-medium text-smokyBlack">3</p>
                </div>
                <span className="h-12 w-[1px] block bg-[#E5E5E5]"></span>
                <div className="flex flex-col gap-1 items-center">
                  <h4 className="font-poppins text-xs font-light text-[#262626]">User Reviews</h4>
                  <div className="flex items-center flex-row gap-1">
                    <Image src={ratingIcon} alt="ratingIcon" />
                    <p className="font-poppins text-xs font-medium text-smokyBlack">3.5</p>
                  </div>
                </div>
                <span className="h-12 w-[1px] block bg-[#E5E5E5]"></span>
                <div className="flex flex-col gap-1 items-center">
                  <h4 className="font-poppins text-xs font-light text-[#262626]">Books Listed</h4>
                  <p className="font-poppins text-xs font-medium text-smokyBlack">3</p>
                </div>
              </div>
            </div>
            <div className="border-b border-AntiFlashWhite px-4 py-5">
              <div className="flex flex-row gap-1 items-center">
                <Image src={locationIcon} alt="edit" className="w-4" />
                <p className="font-poppins text-xs font-light text-[#404040]">
                  Senate Square, Helsinki
                </p>
              </div>
            </div>
          </div>
          <div className="w-[70%] xl:w-9/12">
            <UserTabView />
          </div>
        </div>
      </div>
      {/* <div className="absolute left-0 top-0 w-full flex justify-between px-4 h-14 bg-white">
        <div className="flex items-center gap-4">
          <h2>{t('profile.myProfile')}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Image src={rightMenu} alt="icon" onClick={() => dispatch(setOpen(!open))} />
        </div>
      </div>
      <Settings />
      <div className="w-full h-[88px] z-0 mt-14">
        {coverImage?.imageUrl === undefined ? (
          <Image src={bookDetailsBg} className="w-full h-full " />
        ) : (
          <Image src={coverImage?.imageUrl as string} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="absolute top-4/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-white">
        {isLoading ? (
          <div className="w-full h-full bg-platinum animate-pulse rounded-full shadow-sm"></div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {imageData?.imageUrl === undefined ? (
              <FaRegUser size={72} className="text-night" />
            ) : (
              <Image
                src={imageData?.imageUrl as string}
                className="w-[120px] h-[120px] object-cover relative rounded-full"
              />
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/profile/edit-user')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate('/profile/edit-user');
                }
              }}
              className="w-7 h-7 bg-white cursor-pointer z-[99999999px] absolute bottom-0 right-2 rounded-full flex items-center justify-center"
            >
              <Image src={editIcon} alt="edit" />
            </div>
          </div>
        )}
      </div>
      <div className="container mt-20 pb-28">
        <div className="text-center my-5 ">
          <h1 className="font-medium text-black text-sm leading-none mb-2 font-poppins">
            {firstName + ' ' + lastName}
          </h1>
          <div className="flex items-center justify-center flex-wrap">
            {favGenres?.map((favItem, index) => (
              <div key={index} className="flex items-center">
                <p className="text-black font-light text-xs font-poppins">{favItem}</p>
                <span
                  className={`${
                    favGenres.length - 1 === index ? 'hidden' : 'block'
                  } inline-block mx-2 font-poppins font-light text-sm`}
                >
                  |
                </span>
              </div>
            ))}
          </div>
        </div>
        <UserTabs />
      </div> */}
    </div>
  );
}

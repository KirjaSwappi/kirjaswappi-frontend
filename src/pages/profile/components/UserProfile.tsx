import { FaRegUser } from 'react-icons/fa6';
import locationIcon from '../../../assets/location-icon.png';
import profileCover from '../../../assets/profileCover.jpg';
import Image from '../../../components/shared/Image';
import {
  useGetUserCoverImageQuery,
  useGetUserProfileImageQuery,
} from '../../../redux/feature/auth/authApi';
import { useAppSelector } from '../../../redux/hooks';
import ProfileDashboard from './ProfileDashboard';
export default function UserProfile() {
  const {
    userInformation: { id, firstName, lastName, favGenres },
  } = useAppSelector((state) => state.auth);
  const { data: imageData, isLoading } = useGetUserProfileImageQuery({ userId: id }, { skip: !id });
  const { data: coverImage } = useGetUserCoverImageQuery({ userId: id }, { skip: !id });

  return (
    <div className="pt-4">
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
              <div className="flex items-center py-2 px-4 justify-evenly">
                <div className="flex flex-col gap-1 items-center">
                  <h4 className="font-poppins text-xs font-light text-[#262626]">Total Swaps</h4>
                  <p className="font-poppins text-xs font-medium text-smokyBlack">3</p>
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
            <ProfileDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

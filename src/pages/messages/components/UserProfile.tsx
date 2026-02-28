import { FaRegUser } from 'react-icons/fa6';
import campaign from '../../../assets/Campaign.jpg';
import locationIcon from '../../../assets/location-icon.png';
import Image from '../../../components/shared/Image';
import {
  useGetUserByIdQuery,
  useGetUserProfileImageQuery,
} from '../../../redux/feature/auth/authApi';
import { useAppSelector } from '../../../redux/hooks';

export default function UserProfile() {
  const { selectedChatId, chats } = useAppSelector((state) => state.chat);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const partnerId =
    selectedChat?.conversationType === 'sent'
      ? selectedChat.receiver?.id
      : selectedChat?.sender?.id;

  const { data: imageData, isLoading } = useGetUserProfileImageQuery(
    { userId: partnerId as string },
    { skip: !partnerId },
  );

  const { data, isLoading: isUserLoading } = useGetUserByIdQuery(
    { userId: partnerId as string },
    { skip: !partnerId },
  );

  if (!selectedChat || !partnerId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Select a chat to view profile</p>
      </div>
    );
  }

  return (
    <div className="relative pt-6 2xl:pt-10 w-full h-full">
      <div className="mx-auto w-[80px] h-[80px] rounded-full bg-white border-2 border-white mb-3">
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
      {isUserLoading ? (
        <div className="px-3 flex flex-col gap-2">
          <div className="w-full h-4 bg-platinum animate-pulse shadow-sm rounded-md"></div>
          <div className="w-8/12 h-3 bg-platinum animate-pulse shadow-sm rounded-md"></div>
          <div className="w-5/12 h-3 bg-platinum animate-pulse shadow-sm rounded-md"></div>
        </div>
      ) : (
        <div className="text-center px-3">
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
      <div className="hidden lg:block border-y border-AntiFlashWhite 2xl:mt-5 text-center">
        <div className="flex items-center py-2 px-4 justify-evenly">
          <div className="flex flex-col gap-1 items-center">
            <h4 className="font-poppins text-xs font-light text-[#262626]">Total Swaps</h4>
            <p className="font-poppins text-xs font-medium text-smokyBlack">-</p>
          </div>
          <span className="h-12 w-[1px] block bg-platinumMix"></span>
          <div className="flex flex-col gap-1 items-center">
            <h4 className="font-poppins text-xs font-light text-[#262626]">Books Listed</h4>
            <p className="font-poppins text-xs font-medium text-smokyBlack">-</p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block border-b border-AntiFlashWhite px-4 py-5">
        <div className="flex flex-row gap-1 items-center">
          <Image src={locationIcon} alt="edit" className="w-4" />
          <p className="font-poppins text-xs font-light text-blackOlive">
            {data?.city || 'Location not specified'}
          </p>
        </div>
      </div>
      <div>
        <Image
          src={campaign}
          alt="campaign"
          className="max-h-[220px] 2xl:max-h-[300px] mx-auto mt-4"
        />
      </div>
    </div>
  );
}

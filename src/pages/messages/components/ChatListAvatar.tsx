import { FaRegUser } from 'react-icons/fa6';
import Image from '../../../components/shared/Image';
import { useGetUserProfileImageQuery } from '../../../redux/feature/auth/authApi';
import { Chat } from '../../../redux/feature/messages/messagesSlice';

export default function ChatListAvatar({ chat }: { chat: Chat }) {
  const partnerId = chat.conversationType === 'sent' ? chat.receiver?.id : chat.sender?.id;

  const { data } = useGetUserProfileImageQuery(
    { userId: partnerId as string },
    { skip: !partnerId },
  );

  if (data?.imageUrl) {
    return (
      <Image
        src={data.imageUrl as string}
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="w-14 h-14 rounded-full bg-AntiFlashWhite flex items-center justify-center">
      <FaRegUser size={24} className="text-grayDark" />
    </div>
  );
}

import { FaRegUser } from 'react-icons/fa6';
import { useGetUserProfileImageQuery } from '../../redux/feature/auth/authApi';
import Image from './Image';

export default function OwnerAvatar({
  ownerId,
  className = 'w-3.5 h-3.5',
  iconSize = 10,
}: {
  ownerId: string;
  className?: string;
  iconSize?: number;
}) {
  const { data } = useGetUserProfileImageQuery({ userId: ownerId }, { skip: !ownerId });

  if (data?.imageUrl) {
    return (
      <Image
        src={data.imageUrl as string}
        alt="Profile"
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return <FaRegUser className="text-grayDark" size={iconSize} />;
}

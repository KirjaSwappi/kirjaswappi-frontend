import { Link } from 'react-router-dom';
import Image from '../../shared/Image';

interface IBottomNavItem {
  readonly route?: string;
  readonly icon: string;
  readonly isActive: boolean;
  readonly value: string;
  readonly badgeCount?: number;
}

export default function BottomNavItem({
  route,
  icon,
  isActive,
  value,
  badgeCount,
}: IBottomNavItem) {
  const showBadge = !!badgeCount && badgeCount > 0;

  return (
    <Link
      to={route || '#'}
      className={`flex flex-col items-center gap-1 p-1 relative`}
      style={{
        transition: 'background-color 0.2s ease-in-out',
      }}
    >
      {showBadge && (
        <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {badgeCount > 9 ? '9+' : badgeCount}
        </span>
      )}
      <div className="h-7 flex items-center justify-center">
        <Image
          src={icon}
          alt="icon"
          style={{
            filter: isActive
              ? 'brightness(0) saturate(100%) invert(43%) sepia(98%) saturate(2375%) hue-rotate(185deg) brightness(93%) contrast(98%)'
              : 'none',
            transition: 'filter 0.2s ease-in-out',
          }}
        />
      </div>
      <p
        className={`leading-none text-xs text-grayDark font-poppins ${isActive ? 'font-medium text-primary' : 'font-light'}`}
      >
        {value}
      </p>
    </Link>
  );
}

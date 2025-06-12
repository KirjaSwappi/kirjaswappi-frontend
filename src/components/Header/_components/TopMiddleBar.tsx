import { Link, useLocation } from 'react-router-dom';
import { menu } from '../../../data/menu';
import Image from '../../shared/Image';
export default function TopMiddle() {
  const { pathname } = useLocation();
  // Filter menu items that should be shown
  const filteredMenu = menu.filter(({ isShow }) => isShow);

  return (
    <div className="flex gap-6">
      {filteredMenu.map(({ id, route, icon, value }) => {
        const isActive = pathname === route;
        return (
          <Link
            key={id}
            to={route || '#'}
            className={`flex items-center gap-2 ${
              isActive
                ? 'bg-white text-blue-500 border border-blue-500 rounded-full px-6 py-2'
                : 'text-[#808080] px-4 py-2'
            }`}
          >
            <Image
              src={icon}
              alt="icon"
              className="w-5 h-5"
              style={{
                filter: isActive
                  ? 'brightness(0) saturate(100%) invert(43%) sepia(98%) saturate(2375%) hue-rotate(185deg) brightness(93%) contrast(98%)'
                  : 'none',
                transition: 'filter 0.2s ease-in-out',
              }}
            />
            <span className={`text-sm font-poppins ${isActive ? 'font-medium' : ''}`}>{value}</span>
          </Link>
        );
      })}
    </div>
  );
}

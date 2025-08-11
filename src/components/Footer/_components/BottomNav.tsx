import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { menu } from '../../../data/menu';
import BottomNavItem from './BottomNavItem';

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const ignorePath: string[] = [];
  const pathname = location.pathname;
  const isFooterBarShow = ignorePath.includes(pathname);
  return (
    <div
      className={`${
        isFooterBarShow && 'hidden'
      } h-[70px] flex items-center lg:hidden justify-between text-xs font-normal`}
    >
      <div className="grid grid-cols-2 gap-9">
        {menu.slice(0, 2).map((menuItem, index) => {
          const isActive = location.pathname === menuItem?.route;
          return (
            <BottomNavItem
              key={index}
              isActive={isActive}
              route={menuItem.route}
              icon={menuItem.icon}
              value={t(menuItem.value)}
            />
          );
        })}
      </div>
      <div className={`grid grid-cols-2 ${pathname !== '/' && 'gap-9'}`}>
        {menu.slice(2, 4).map((menuItem, index) => {
          const isActive = location.pathname === menuItem?.route;
          return (
            <BottomNavItem
              key={index}
              isActive={isActive}
              route={menuItem.route}
              icon={menuItem.icon}
              value={t(menuItem.value)}
            />
          );
        })}
      </div>
    </div>
  );
}

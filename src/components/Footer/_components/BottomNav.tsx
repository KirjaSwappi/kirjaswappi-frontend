import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { menu } from '../../../data/menu';
import BottomNavItem from './BottomNavItem';

export default function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const ignorePath: string[] = [`/book-details/${pathname?.split('/').reverse()[0]}`];
  const isFooterBarShow = ignorePath.includes(pathname);
  return (
    <div
      className={`${
        isFooterBarShow && 'hidden'
      } h-[70px] flex items-center lg:hidden justify-between text-xs font-normal`}
    >
      <div className="w-full flex items-center justify-between">
        {menu.slice(0, 4).map((menuItem, index) => {
          const isActive = location.pathname === menuItem?.route;
          return (
            <div key={index} className={`${index == 2 && pathname == '/' ? 'pl-24' : ''}`}>
              <BottomNavItem
                isActive={isActive}
                route={menuItem.route}
                icon={menuItem.icon}
                value={t(menuItem.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

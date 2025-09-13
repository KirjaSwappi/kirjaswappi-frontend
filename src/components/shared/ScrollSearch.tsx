import React from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link, useLocation } from 'react-router-dom';
import { menu } from '../../data/menu';
import { useMouseClick } from '../../hooks/useMouse';
import Button from './Button';
import Image from './Image';
import Search from './Search';

export default function ScrollSearch() {
  const { pathname } = useLocation();
  const { clicked, setClicked, reference } = useMouseClick();
  const filteredMenu = menu.filter(({ isShow }) => isShow);
  return (
    <div className="relative w-full max-w-xl">
      <div
        ref={reference}
        className="flex items-center bg-white rounded-full p-1 gap-2 border border-platinumMix shadow-sm w-full h-[48px]"
      >
        <div
          className={`flex items-center gap-1 menu-text-fade ${
            clicked ? 'menu-text-hidden' : 'menu-text-visible'
          }`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {filteredMenu.map(({ id, route, icon, value }, index) => {
            const isActive = pathname === route;
            return (
              <React.Fragment key={id}>
                {index > 0 && <span className="h-5 w-px bg-platinumMix" />}
                <Link
                  to={route || '#'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out ${
                    isActive
                      ? 'text-blue-500 font-medium'
                      : 'text-[#A6A6A6] hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Image
                    src={icon}
                    alt="icon"
                    className="w-4 h-4"
                    style={{
                      filter: isActive
                        ? 'brightness(0) saturate(100%) invert(39%) sepia(99%) saturate(1747%) hue-rotate(194deg) brightness(96%) contrast(101%)'
                        : 'brightness(0) saturate(100%) invert(74%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(93%) contrast(88%)',
                      transition: 'filter 0.2s ease-in-out',
                    }}
                  />
                  <span className="text-sm">{value}</span>
                </Link>
              </React.Fragment>
            );
          })}
          <Button
            onClick={() => setClicked((prev) => !prev)}
            className={`${pathname === '/map' ? 'hidden' : 'flex'}  items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ml-2`}
            style={{ position: 'relative' }}
            aria-label="Search"
          >
            <IoSearch className="w-4 h-4" />
          </Button>
        </div>

        <div
          className={`flex-1 absolute left-0 top-0 w-full h-full flex items-center transition-opacity duration-300 ease-in-out ${
            clicked ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{ zIndex: 2 }}
        >
          <div className="flex-1">
            <Search onClose={() => setClicked(false)} />
          </div>
        </div>
      </div>

      <style>
        {`
          .menu-text-fade {
            transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity, transform;
          }
          .menu-text-visible {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
          }
          .menu-text-hidden {
            opacity: 0;
            transform: translateX(80px);
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
}

import { forwardRef } from 'react';
type SideDrawerProps = {
  open: boolean;
  left?: boolean;
  children: React.ReactNode;
};
const SideDrawer = forwardRef<HTMLDivElement, SideDrawerProps>(
  ({ open, left = false, children }, ref) => {
    return (
      <div
        className={`
          fixed inset-0 w-full h-screen bg-black bg-opacity-50
          transition-opacity duration-500 ease-in-out
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          z-[99999999]
        `}
      >
        <div
          ref={ref}
          className={`
            fixed top-0 ${left ? 'left-0' : 'right-0'} h-full bg-white px-0 py-8
            transition-transform duration-300 ease-in-out
            ${
              open
                ? 'translate-x-0 w-[70%] lg:max-w-[320px]'
                : left
                  ? '-translate-x-full'
                  : 'translate-x-full'
            }
          `}
        >
          {children}
        </div>
      </div>
    );
  },
);
SideDrawer.displayName = 'SideDrawer';
export default SideDrawer;

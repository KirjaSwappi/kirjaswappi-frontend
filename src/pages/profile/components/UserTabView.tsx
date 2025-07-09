import Button from '../../../components/shared/Button';
import UserActionNavigation from './UserActionNavigation';

export default function UserTabView() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button className="bg-primary text-white px-3 py-2 rounded-full flex items-center gap-2 font-poppins font-medium  text-sx">
          Books Listed{' '}
          <div className="w-4 h-4 bg-white text-primary text-[8px] flex items-center justify-center rounded-full font-semibold leading-none">
            10
          </div>
        </Button>
        <Button className="bg-AntiFlashWhite text-grayDark px-3 py-2 rounded-full flex items-center gap-2 font-poppins font-medium text-sx border border-[#D9D9D9]">
          Pending Swaps{' '}
          <div className="w-4 h-4 bg-[#999999] text-white text-[8px] flex items-center justify-center rounded-full font-semibold leading-none border border-grayDark">
            10
          </div>
        </Button>
        <Button className="bg-AntiFlashWhite text-grayDark px-3 py-2 rounded-full flex items-center gap-2 font-poppins font-medium text-sx border border-[#D9D9D9]">
          Bookmarked{' '}
          <div className="w-4 h-4 bg-[#999999] text-white text-[8px] flex items-center justify-center rounded-full font-semibold leading-none border border-grayDark">
            10
          </div>
        </Button>
      </div>
      <UserActionNavigation />
    </div>
  );
}

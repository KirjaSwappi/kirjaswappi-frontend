import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { IoShareSocialOutline } from 'react-icons/io5';
import Button from '../../../components/shared/Button';

export default function BookActionButton({
  onClick,
  btnValue,
  onShare,
  onBookmark,
  isBookmarked,
  isOwner,
}: {
  onClick: () => void;
  btnValue: string;
  onShare: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  isOwner: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onClick}
        className="bg-primary text-white w-[130px] sm:w-[150px] lg:w-[203px] h-[44px] py-2 text-sm font-poppins font-normal rounded-md"
      >
        {btnValue}
      </Button>
      <Button
        onClick={onShare}
        aria-label="Share"
        className="bg-[#F2F4F5] w-[44px] h-[44px] rounded-md flex items-center justify-center"
      >
        <IoShareSocialOutline className="w-5 h-5 text-grayDark" />
      </Button>
      {!isOwner && (
        <Button
          onClick={onBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          className="bg-[#F2F4F5] w-[44px] h-[44px] rounded-md flex items-center justify-center"
        >
          {isBookmarked ? (
            <BsBookmarkFill className="w-5 h-5 text-primary" />
          ) : (
            <BsBookmark className="w-5 h-5 text-grayDark" />
          )}
        </Button>
      )}
    </div>
  );
}

import favIcon from '../../../assets/fav.png';
import shareIcon from '../../../assets/share.png';
import Button from '../../../components/shared/Button';
import Image from '../../../components/shared/Image';
export default function BookActionButton({
  onClick,
  btnValue,
}: {
  onClick: () => void;
  btnValue: string;
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
        onClick={onClick}
        className="bg-[#F2F4F5] w-[44px] h-[44px] rounded-md flex items-center justify-center"
      >
        <Image src={shareIcon} alt="shareIcon" className="w-4" />
      </Button>
      <Button
        onClick={onClick}
        className="bg-[#F2F4F5] w-[44px] h-[44px]  rounded-md flex items-center justify-center"
      >
        <Image src={favIcon} alt="shareIcon" className="w-6" />
      </Button>
    </div>
  );
}

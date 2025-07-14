import exchangeIcon from '../../assets/swapIcon.png';
import Button from './Button';
import Image from './Image';

export default function BookCardSwapButton() {
  return (
    <Button
      type="button"
      className="relative group flex items-center bg-blue-500 rounded-full p-2 gap-2.5 
                transition-all duration-300 w-7 h-7 hover:w-[100px] hover:h-[28px] hover:rounded-[20px] 
                focus:w-[97px] focus:h-[28px] focus:rounded-[20px] overflow-hidden shadow-md"
      tabIndex={0}
      aria-label="Swap Book"
    >
      <Image src={exchangeIcon} alt="Exchange" className="w-[10px] h-[8.33px] flex-shrink-0" />
      <span
        className="absolute opacity-0 group-hover:opacity-100 group-focus:opacity-100 
                  transition-opacity duration-300 pointer-events-none select-none text-white font-poppins 
                  font-normal text-[12px] leading-[100%] whitespace-nowrap w-[66px] h-[18px] top-[9px] 
                  left-[23.33px] [letter-spacing:0]"
      >
        Swap Book
      </span>
    </Button>
  );
}

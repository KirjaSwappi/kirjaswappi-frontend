import bookIcon2 from '../../../assets/bookIcon2.png';
import lng from '../../../assets/EN.png';
import Image from '../../../components/shared/Image';

export default function BookType({ condition }: { condition: string }) {
  if (!condition) return null;

  return (
    <div className="bg-white py-6 grid grid-cols-3">
      <div className="flex flex-col items-center border-r border-platinumDark px-1">
        <p className="text-grayDark text-xs font-poppins font-light">Book Condition</p>
        <Image src={bookIcon2} alt="book" className="mt-2 mb-1" />
        <h3 className="text-black text-xs font-normal font-poppins">{condition || '-'}</h3>
      </div>
      <div className="flex flex-col items-center border-r border-platinumDark px-1">
        <p className="text-grayDark text-xs font-poppins font-normal">Language</p>
        <Image src={lng} alt="book" className="mt-2 mb-1" />
        <h3 className="text-black text-xs font-normal font-poppins">English</h3>
      </div>
      <div className="flex flex-col items-center border-r border-platinumDark px-1">
        <p className="text-grayDark text-xs font-poppins font-normal">Length</p>
        <p className="text-xl font-semibold text-smokyBlack">-</p>
        <h3 className="text-black text-xs font-normal font-poppins flex items-center gap-1">
          Pages
        </h3>
      </div>
    </div>
  );
}

import icon from '../../assets/offerBookIcon.png';

interface SpinnerProps {
  variant?: 'light' | 'overlay';
}

export default function Spinner({ variant = 'light' }: SpinnerProps) {
  return (
    <div
      className={`inset-0 w-full flex items-center justify-center h-screen z-50 fixed ${
        variant === 'overlay' ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-10'
      }`}
    >
      <div className="relative rounded-full w-8 h-8 flex items-center justify-center shadow-md bg-white">
        <img src={icon} alt="loader" className=" animate-pulse" />
        <div className="absolute top-[2px] left-[2px] w-7 h-7 border-4 border-transparent border-t-4 border-t-primary border-r-4 border-r-white rounded-full animate-spin" />
      </div>
    </div>
  );
}

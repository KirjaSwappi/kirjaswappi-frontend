import NotFound from '../../../assets/notFound.png';
import Image from '../../../components/shared/Image';

export default function NoBooksAvailable() {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="bg-white w-full rounded-lg p-6 flex min-h-[50vh] justify-center flex-col items-center">
        <h3 className="text-xl lg:text-2xl font-semibold mb-2 font-poppins text-[#262626]">
          No books available
        </h3>
        <p className="text-sm text-[#262626] mb-4 font-poppins text-center">
          We couldn&apos;t find any books matching your filters.
        </p>
        <Image src={NotFound} alt="not found" className="w-28 lg:w-40" />
      </div>
    </div>
  );
}

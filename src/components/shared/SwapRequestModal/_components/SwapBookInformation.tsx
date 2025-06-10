import { useAppSelector } from '../../../../redux/hooks';
import Image from '../../Image';

export default function SwapBookInformation() {
  const { swapBookInformation } = useAppSelector((state) => state.swapBook);
  const { coverPhotoUrls, title, genres, condition, author } = swapBookInformation;
  return (
    <div>
      <div className="flex gap-4">
        <div className="max-w-[108px] max-h-[142px] flex items-center justify-center ">
          <Image
            src={coverPhotoUrls?.[0] ?? ''}
            alt={title}
            className="max-w-[108px] h-[142px] object-cover  rounded-lg"
          />
        </div>
        <div>
          <h1 className="font-medium text-smokyBlack text-sm leading-none mb-1 font-poppins">
            {title}
          </h1>
          <p className="text-smokyBlack font-normal text-xs font-poppins">by {author}</p>
          <div className="flex items-center flex-wrap mt-4">
            {genres?.map((genre, index: number) => (
              <div key={index} className="flex items-center">
                <p className="text-black font-light text-xs font-poppins">{genre}</p>
                <span
                  className={`${
                    genres.length - 1 === index ? 'hidden' : 'block'
                  } inline-block mx-2 font-poppins font-light text-sm`}
                >
                  |
                </span>
              </div>
            ))}
          </div>
          <p className="text-smokyBlack font-normal text-xs font-poppins mt-4">
            <span className="font-light">Book Condition:</span>{' '}
            <span className="text-[#3FBA49] bg-[#3FBA4914] py-[2px] px-[6px] rounded-lg">
              {condition}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

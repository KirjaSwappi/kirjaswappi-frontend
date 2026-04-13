import { useAppSelector } from '../../../../redux/hooks';

export default function SwapBookInformation() {
  const { swapBookInformation } = useAppSelector((state) => state.swapBook);
  const { title, genres, condition, author } = swapBookInformation;
  return (
    <div>
      <div className=" flex gap-4">
        <div>
          <h1 className="font-medium text-smokyBlack text-sm lg:text-xl leading-none mb-1 font-poppins">
            {title}
          </h1>
          <p className="text-smokyBlack font-normal text-xs lg:text-sm font-poppins">by {author}</p>
          <div className="flex gap-1 items-center flex-wrap mt-4">
            {genres?.map((genre: string, index: number) => (
              <div
                key={index}
                className="flex items-center lg:border border-[#BADBFD] lg:bg-primary-light lg:px-2 lg:py-1 lg:rounded-md"
              >
                <p className="text-smokyBlack lg:text-primary font-light text-xs font-poppins">
                  {genre}
                </p>
                <span
                  className={`lg:hidden ${
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

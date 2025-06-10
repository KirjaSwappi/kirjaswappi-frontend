import { SwapType } from '../../../../types/enum';
import BookIcon from '../../../assets/bookIcon.svg';
import BookIconBlue from '../../../assets/bookIconBlue.png';
import { Carousel, CarouselContent, CarouselItem } from '../../../components/shared/Carousel';
import Image from '../../../components/shared/Image';
import { IExchange, ISwapConditionData } from '../types/interface';

export default function Exchanges({ swapCondition }: { swapCondition: ISwapConditionData }) {
  if (!swapCondition) return null;

  const swapConditionExchange = (swapConditionData: ISwapConditionData): Array<IExchange> => {
    switch (swapConditionData.swapType) {
      case SwapType.BYBOOKS:
        return (swapConditionData?.swappableBooks ?? []).map((swappableBook) => ({
          swapType: swapConditionData.swapType,
          title: swappableBook.title,
          value: swappableBook.author,
        }));

      case SwapType.BYGENRES:
        return swapConditionData.swappableGenres.map((swappableGenre) => ({
          swapType: swapConditionData.swapType,
          title: swappableGenre.name,
          value: 'Any of this genre',
        }));

      case SwapType.OPENTOOFFERS:
        return [
          {
            swapType: swapConditionData.swapType,
            title: SwapType.OPENTOOFFERS,
            value: 'Flexible exchange',
          },
        ];

      case SwapType.GIVEAWAY:
        return [
          {
            swapType: swapConditionData.swapType,
            title: SwapType.GIVEAWAY,
            value: 'You will receive offers for Give Away',
          },
        ];

      default:
        return [];
    }
  };

  const condition = swapConditionExchange(swapCondition);
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="relative"
    >
      <CarouselContent>
        {condition.map((item) => {
          return (
            <CarouselItem
              key={`${item.swapType}-${item.title}`}
              className={` ${condition.length <= 1 ? 'pr-4 basis-full' : 'basis-[70%]'}`}
            >
              <div className="relative w-full overflow-hidden h-[110px] rounded-lg bg-[#DEE7F5] flex items-center gap-3 px-[18px]">
                <Image
                  src={item.swapType === SwapType.BYBOOKS ? BookIconBlue : BookIcon}
                  className="w-5"
                />
                <div className="w-[120px] text-left">
                  <h3 className="text-sm font-poppins leading-[18px] font-normal text-smokyBlack capitalize line-clamp-2">
                    {item?.title}
                  </h3>
                  <p className="text-xs font-poppins font-light mt-1 text-smokyBlack">
                    {item?.swapType === SwapType.BYBOOKS && 'by'} {item?.value}
                  </p>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

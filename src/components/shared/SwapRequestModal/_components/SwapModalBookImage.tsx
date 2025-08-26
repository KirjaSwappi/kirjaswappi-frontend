import Image from '../../Image';
import SwapBookInformation from './SwapBookInformation';

const BookImage = ({ coverPhotoUrls, title }: { coverPhotoUrls: string[]; title: string }) => (
  <div className="flex gap-4">
    <div className="max-w-[108px] lg:max-w-[200px] h-[142px] lg:h-[263px] flex items-center justify-center">
      <Image
        src={coverPhotoUrls?.[0] ?? ''}
        alt={title}
        className="max-w-[108px] lg:max-w-[200px] h-[142px] lg:h-[263px] object-cover rounded-lg"
      />
    </div>
    <div className="lg:hidden">
      <SwapBookInformation />
    </div>
  </div>
);

export default BookImage;

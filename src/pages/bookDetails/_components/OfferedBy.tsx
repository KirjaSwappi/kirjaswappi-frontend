import locationIcon from '../../../assets/location-icon.png';
import profileIcon from '../../../assets/profileIcon.png';
import Image from '../../../components/shared/Image';
export default function OfferedBy({
  imageUrl,
  ownerName,
}: {
  imageUrl: string;
  ownerName: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row-reverse lg:justify-end lg:gap-8 mt-5 xl:mt-12">
      <div className="flex gap-1 my-5">
        <span className=" w-[1px] h-4 bg-[#B2B2B2] lg:mr-8 hidden lg:block"></span>
        <Image src={locationIcon} alt="location" />
        <p className="text-xs font-poppins font-normal">Senate Square, Helsinki</p>
      </div>
      <div>
        <div className="flex gap-8 items-end">
          <div>
            <h3 className="text-xs font-normal font-poppins text-grayDark mb-2">Offered by</h3>
            <div className="flex items-center gap-1">
              <Image
                className="w-4 h-4 rounded-full"
                src={(imageUrl && imageUrl) || profileIcon}
                alt="profile"
              />
              <p className="text-xs font-normal font-poppins text-black">{ownerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

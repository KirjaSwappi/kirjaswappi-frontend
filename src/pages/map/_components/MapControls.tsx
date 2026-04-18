import { useTranslation } from 'react-i18next';
import { BiCurrentLocation } from 'react-icons/bi';
import { HiOutlineMinusSm, HiOutlinePlusSm } from 'react-icons/hi';
import { useMap } from 'react-leaflet';
import Button from '../../../components/shared/Button';

type MapControlsProps = {
  latitude: number;
  longitude: number;
};

export default function MapControls({ latitude, longitude }: MapControlsProps) {
  const { t } = useTranslation();
  const map = useMap();

  return (
    <div className="absolute bottom-28 right-6 z-[999999] flex flex-col gap-3">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <HiOutlinePlusSm size={20} className="text-[#2B2B2B]" />
      </button>

      {/* ➖ Zoom Out */}
      <Button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <HiOutlineMinusSm size={20} className="text-[#2B2B2B]" />
      </Button>

      <Button
        onClick={() => map.flyTo([latitude, longitude], 16, { animate: true })}
        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        title={t('map.myLocation')}
      >
        <BiCurrentLocation size={20} className="text-[#2B2B2B]" />
      </Button>
    </div>
  );
}

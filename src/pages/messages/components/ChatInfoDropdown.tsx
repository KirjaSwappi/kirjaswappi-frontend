import { IoIosInformationCircleOutline } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/shared/Button';
import { useMouseClick } from '../../../hooks/useMouse';

interface ChatInfoDropdownProps {
  onViewProfile: () => void;
  onMute: () => void;
  onBlock: () => void;
  onReport: () => void;
}

export default function ChatInfoDropdown({
  onViewProfile,
  onMute,
  onBlock,
  onReport,
}: ChatInfoDropdownProps) {
  const { t } = useTranslation();
  const { reference, clicked, setClicked } = useMouseClick<HTMLDivElement>();

  return (
    <div className="relative" ref={reference}>
      <Button type="button" onClick={() => setClicked((v) => !v)} aria-label="Chat options">
        <IoIosInformationCircleOutline size={20} className="text-black" />
      </Button>
      {clicked && (
        <div className="font-poppins text-blackOlive text-sm absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-custom-box-shadow z-50 overflow-hidden px-2">
          <Button
            className="block w-full text-left px-4 py-3 border-b border-gray"
            onClick={onViewProfile}
          >
            {t('chat.viewProfile')}
          </Button>
          <Button
            className="block w-full text-left px-4 py-3  border-b border-gray"
            onClick={onMute}
          >
            {t('chat.mute')}
          </Button>
          <Button
            className="block w-full text-left px-4 py-3  border-b border-gray"
            onClick={onBlock}
          >
            {t('chat.block')}
          </Button>
          <Button className="block w-full text-left px-4 py-3" onClick={onReport}>
            {t('chat.report')}
          </Button>
        </div>
      )}
    </div>
  );
}

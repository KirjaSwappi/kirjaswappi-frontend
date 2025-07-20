import { useTranslation } from 'react-i18next';
import enFlag from '../../../assets/englishLanguage.png';
import fiFlag from '../../../assets/flag.png';
import svFlag from '../../../assets/swedishLanguage.png';
import Button from '../../shared/Button';
import Image from '../../shared/Image';

const FLAG_MAP: Record<string, string> = {
  fi: fiFlag,
  en: enFlag,
  sv: svFlag,
};

export default function LanguageFlagButton({
  clicked,
  setClicked,
}: {
  clicked: boolean;
  setClicked: (v: boolean) => void;
}) {
  const { i18n } = useTranslation();
  const flagSrc = FLAG_MAP[i18n.language] || fiFlag;
  return (
    <Button
      id="language"
      className={`flex items-center justify-center w-10 h-10 border border-primary rounded-full overflow-hidden `}
      onClick={() => setClicked(!clicked)}
      aria-label="Change language"
    >
      <Image src={flagSrc} alt="Current Language Flag" className="w-10 h-10 object-cover" />
    </Button>
  );
}

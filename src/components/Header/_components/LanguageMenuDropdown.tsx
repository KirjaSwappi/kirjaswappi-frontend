import { useTranslation } from 'react-i18next';
import en from '../../../assets/englishLanguage.png';
import fiFlag from '../../../assets/finlandIcon.png';
import svFlag from '../../../assets/swedishLanguage.png';
import { setLanguage } from '../../../utility/i18n';

const LANGUAGES = [
  { code: 'fi', label: 'Finnish', icon: fiFlag },
  { code: 'en', label: 'English', icon: en },
  { code: 'sv', label: 'Swedish', icon: svFlag },
];

export default function LanguageMenuDropdown() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="absolute top-12 py-2 -left-20 w-40 bg-white rounded-lg shadow-custom-box-shadow z-[9999999] text-blackOlive">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`w-full flex items-center px-4 py-2 gap-2 hover:bg-primary hover:text-white ${currentLang === lang.code ? 'bg-primary text-white' : ''}`}
          onClick={() => setLanguage(lang.code)}
        >
          <img src={lang.icon} alt={lang.label + ' flag'} className="w-6 h-6 rounded-full border" />
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

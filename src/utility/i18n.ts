import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { parsePropertiesString } from './parseProperties';

// Import as raw text (Vite supports ?raw)
import enRaw from '../locales/en.properties?raw';
import fiRaw from '../locales/fi.properties?raw';
import svRaw from '../locales/sv.properties?raw';

const en = parsePropertiesString(enRaw);
const fi = parsePropertiesString(fiRaw);
const sv = parsePropertiesString(svRaw);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
    sv: { translation: sv },
  },
  lng: 'fi', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

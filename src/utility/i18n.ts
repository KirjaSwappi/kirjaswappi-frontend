import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { parsePropertiesString } from './parseProperties';

import enRaw from '../locales/en.properties?raw';
import fiRaw from '../locales/fi.properties?raw';
import svRaw from '../locales/sv.properties?raw';

const en = parsePropertiesString(enRaw);
const fi = parsePropertiesString(fiRaw);
const sv = parsePropertiesString(svRaw);

const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('language');
  if (savedLang && ['fi', 'en', 'sv'].includes(savedLang)) {
    return savedLang;
  }
  return 'fi';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
    sv: { translation: sv },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = (lang: string) => {
  if (['fi', 'en', 'sv'].includes(lang)) {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  }
};

export default i18n;

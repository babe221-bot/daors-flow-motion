import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import HttpApi from "i18next-http-backend";

// Import translation files directly
import bsTranslation from '../public/locales/bs/translation.json';
import enTranslation from '../public/locales/en/translation.json';
import hrTranslation from '../public/locales/hr/translation.json';
import srTranslation from '../public/locales/sr/translation.json';
import deCHTranslation from '../public/locales/de-CH/translation.json';
import frCHTranslation from '../public/locales/fr-CH/translation.json';
import trTranslation from '../public/locales/tr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // .use(HttpApi)
  .init({
    debug: true,
    fallbackLng: "bs",
    supportedLngs: ["bs", "en", "hr", "sr", "de-CH", "fr-CH", "tr"],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      bs: {
        translation: bsTranslation
      },
      en: {
        translation: enTranslation
      },
      hr: {
        translation: hrTranslation
      },
      sr: {
        translation: srTranslation
      },
      "de-CH": {
        translation: deCHTranslation
      },
      "fr-CH": {
        translation: frCHTranslation
      },
      tr: {
        translation: trTranslation
      }
    },
    detection: {
      // Prevents i18next from automatically detecting the language
      // This allows us to manually control the language
      order: ['localStorage', 'cookie'],
      caches: ['localStorage', 'cookie']
    },
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
  });

export default i18n;

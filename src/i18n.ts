import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: false,
    fallbackLng: "en",
    supportedLngs: ["bs", "en", "hr", "sr", "de-CH", "fr-CH", "tr"],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie']
    },
    react: {
      useSuspense: false
    }
  }).catch((err) => {
    console.error('i18n initialization failed:', err);
  });

export default i18n;

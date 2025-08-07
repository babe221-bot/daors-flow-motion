import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: true,
    fallbackLng: "bs",
    supportedLngs: ["bs", "en", "hr", "sr", "de-CH", "fr-CH", "tr"],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
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

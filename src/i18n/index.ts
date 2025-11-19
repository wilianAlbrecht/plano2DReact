import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import pt from "./locales/pt.json";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import el from "./locales/el.json";
import es from "./locales/es.json";

// Configura detecção automática do idioma do navegador
i18n
  .use(LanguageDetector)

  // Conecta i18n ao React
  .use(initReactI18next)

  // Inicializa sistema de tradução
  .init({
    // Registra arquivos de tradução por idioma
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      zh: { translation: zh },
      el: { translation: el },
      es: { translation: es }
    },

    // Define idioma padrão caso detecção falhe
    fallbackLng: "pt",

    interpolation: {
      // Permite usar HTML no texto sem escapar
      escapeValue: false,
    },
  });

export default i18n;

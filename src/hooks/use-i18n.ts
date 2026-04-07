import { createContext, useContext } from "react";
import englishTranslations from "@/locales/english.json";
import teluguTranslations from "@/locales/telugu.json";
import hindiTranslations from "@/locales/hindi.json";
import tamilTranslations from "@/locales/tamil.json";

type Translations = typeof englishTranslations;
type Language = "english" | "telugu" | "hindi" | "tamil" | "kannada" | "marathi" | "gujarati" | "malayalam" | "bengali";

interface I18nContextType {
  t: Translations;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function getTranslations(language: Language): Translations {
  if (language === "telugu") return teluguTranslations;
  if (language === "hindi") return hindiTranslations;
  if (language === "tamil") return tamilTranslations;
  // For now, other languages fall back to English until their files are created
  if (language === "kannada") return englishTranslations;
  if (language === "marathi") return englishTranslations;
  if (language === "gujarati") return englishTranslations;
  if (language === "malayalam") return englishTranslations;
  if (language === "bengali") return englishTranslations;
  return englishTranslations;
}
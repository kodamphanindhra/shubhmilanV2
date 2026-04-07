import { I18nContext, getTranslations } from "@/hooks/use-i18n";
import { ReactNode, useState } from "react";

type Language = "english" | "telugu" | "hindi" | "tamil" | "kannada" | "marathi" | "gujarati" | "malayalam" | "bengali";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("english");
  const t = getTranslations(language);

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Locale, type TranslationKey } from "../data/translations";
import { readStoredValue, writeStoredValue } from "../lib/storage";

const STORAGE_KEY = "lang";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLocale(): Locale {
  const stored = readStoredValue(STORAGE_KEY);
  if (stored === "id" || stored === "en") return stored;
  return "id";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    writeStoredValue(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "id" ? "en" : "id"));
  }, []);

  const t = useCallback((key: TranslationKey) => translations[locale][key], [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

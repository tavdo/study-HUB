import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ka from "./ka";
import en from "./en";

const dicts = { ka, en };
const LOCALE_KEY = "studyhub_locale";

const I18nContext = createContext(null);

function deepGet(obj, path) {
  return path.split(".").reduce((o, k) => o?.[k], obj);
}

export function I18nProvider({ children, initialLocale = "ka" }) {
  const [locale, setLocaleState] = useState(
    () => localStorage.getItem(LOCALE_KEY) || initialLocale
  );

  const setLocale = useCallback((l) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
    document.documentElement.lang = l === "en" ? "en" : "ka";
  }, []);

  const t = useCallback(
    (key, ...args) => {
      const dict = dicts[locale] || ka;
      let val = deepGet(dict, key) ?? deepGet(ka, key) ?? key;
      if (typeof val === "function") return val(...args);
      return val;
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, dict: dicts[locale] || ka }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallback = (key, ...args) => {
      let val = deepGet(ka, key) ?? key;
      if (typeof val === "function") return val(...args);
      return val;
    };
    return { locale: "ka", setLocale: () => {}, t: fallback, dict: ka };
  }
  return ctx;
}

export default I18nProvider;

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "uk";
type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  en: {
    home: "Tarot Daily",
    title: "Tarot Daily - Reveal Your Fortune",
    subtitle: "The cards hold your destiny. In their symbols lie your path, your choices, and what is yet to come.",
    clickToReveal: "Click to reveal",
    reversed: "(reversed)",
    drawAgain: "Draw again",
    helper: "Reveal all three to draw again."
  },
  uk: {
    home: "Tаро щоднний",
    title: "Три карти Таро",
    subtitle: "Клікай на кожну карту, щоб відкрити. Без логіну, без API, без БД.",
    clickToReveal: "Клікніть, щоб відкрити",
    reversed: "(перевернута)",
    drawAgain: "Тягнути знову",
    helper: "Відкрий усі три, щоб тягнути знову."
  }
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof DICTS["en"]) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && window.localStorage.getItem("lang")) as Lang | null;
    if (saved === "en" || saved === "uk") setLang(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    const dict = DICTS[lang] ?? DICTS.en;
    return (key: keyof typeof DICTS["en"]) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

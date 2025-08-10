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
    helper: "Reveal all three to draw again.",
    languageLabel: "Language:",
    languageAria: "Language selector",
    revealCard: "Reveal card",
    details: "details",
    card: "Card",
    cardDetails: "Card details"
  },
  uk: {
    home: "Щоденне Таро",
    title: "Щоденне Таро — Відкрий свою долю",
    subtitle: "Карти тримають твою долю. У їхніх символах — твій шлях, твої вибори і те, що ще попереду.",
    clickToReveal: "Натисніть, щоб відкрити",
    reversed: "(перевернута)",
    drawAgain: "Тягнути знову",
    helper: "Відкрийте всі три, щоб тягнути знову.",
    languageLabel: "Мова:",
    languageAria: "Вибір мови",
    revealCard: "Відкрити карту",
    details: "деталі",
    card: "Карта",
    cardDetails: "Деталі карти"
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

  // Keep the document <html lang> in sync for accessibility and SEO hints
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
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

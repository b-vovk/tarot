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
    cards: "Cards",
    cardDetails: "Card details",
    love: "Love",
    life: "Life",
    destiny: "Destiny",
    career: "Career",
    loveTitle: "Love Tarot – Reveal Your Heart's Path",
    loveSubtitle: "Draw a single card to illuminate love, connection, and relationships.",
    careerTitle: "Career Tarot – Reveal Your Next Step",
    careerSubtitle: "Draw a single card to explore work, purpose, and success.",
    destinyTitle: "Destiny Tarot – Reveal Your Life Path",
    destinySubtitle: "Draw a single card to see turning points, guidance, and direction.",
    revealYourLoveCard: "Reveal your love card",
    revealYourDestinyCard: "Reveal your destiny card",
    revealYourCareerCard: "Reveal your career card",
    loveExtra1: "Love readings highlight the emotional tone around you — receptivity, trust, and the energy you bring to connection. The card can reflect patterns in how you give and receive, and what opens the heart.",
    loveExtra2: "Let its symbols suggest a gentle shift: a conversation to have, a boundary to affirm, or vulnerability to allow. Small acts of care can transform the whole relationship field.",
    loveExtra3: "Remember: self-love sets the frequency. What you cultivate within becomes the way you meet and are met by others.",
    careerExtra1: "Career readings illuminate momentum, alignment, and where focus creates the greatest return. The card often reveals the skill or mindset that unlocks the next step.",
    careerExtra2: "Notice whether it calls for structure or inspiration, collaboration or independence. Adjust one lever at a time and give it space to compound.",
    careerExtra3: "Clarity grows through action. Take a measured step; let feedback refine your direction.",
    destinyExtra1: "Each draw is a mirror to the moment. The card you reveal reflects the patterns turning beneath the surface — habits, choices, and forces calling you toward your next chapter.",
    destinyExtra2: "Use this as a compass, not a command. Sit with the symbolism, notice what resonates, and let your intuition highlight the message meant for you.",
    destinyExtra3: "If something stirs, act gently but deliberately. Small steps aligned with your truth change the larger arc of your path."
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
    cards: "Карти",
    cardDetails: "Деталі карти",
    love: "Кохання",
    life: "Життя",
    destiny: "Доля",
    career: "Кар'єра",
    loveTitle: "Таро Кохання — Відкрий шлях серця",
    loveSubtitle: "Витягніть одну карту, щоб освіти шлях кохання, зв’язку та стосунків.",
    careerTitle: "Таро Кар’єри — Знайди наступний крок",
    careerSubtitle: "Витягніть одну карту, щоб дослідити роботу, покликання та успіх.",
    destinyTitle: "Таро Долі — Відкрий свій шлях життя",
    destinySubtitle: "Витягніть одну карту, щоб побачити повороти, підказки та напрям.",
    revealYourLoveCard: "Відкрийте свою карту кохання",
    revealYourDestinyCard: "Відкрийте свою карту долі",
    revealYourCareerCard: "Відкрийте свою карту кар’єри",
    loveExtra1: "Читання про кохання підсвічують емоційний тон — сприйнятливість, довіру та енергію, з якою ви входите в зв’язок. Карта може віддзеркалити ваші шаблони в тому, як ви віддаєте й отримуєте, і що відкриває серце.",
    loveExtra2: "Нехай символи підкажуть м’який крок: розмова, яку варто провести, межа, яку варто утвердити, або вразливість, якій можна дати місце. Маленькі жести турботи здатні змінити весь простір стосунків.",
    loveExtra3: "Пам’ятайте: само-любов задає частоту. Те, що ви вирощуєте в собі, стає тим, як ви зустрічаєте інших і як зустрічають вас.",
    careerExtra1: "Читання про кар’єру висвітлюють імпульс, узгодженість і де саме фокус дає найбільшу віддачу. Карта часто показує навичку чи стан свідомості, що відкриває наступний крок.",
    careerExtra2: "Зверніть увагу, чи закликає вона до структури чи натхнення, співпраці чи самостійності. Регулюйте по одному важелю та дайте часу накопичити ефект.",
    careerExtra3: "Ясність зростає через дію. Зробіть виважений крок і дозвольте зворотному зв’язку уточнити напрям.",
    destinyExtra1: "Кожен витяг — це дзеркало моменту. Карта відображає приховані під поверхнею візерунки — звички, вибори та сили, що кличуть до нового розділу.",
    destinyExtra2: "Користуйтеся цим як компасом, а не наказом. Сидіть із символами, звертайте увагу на відгук і дозвольте інтуїції підсвітити головне.",
    destinyExtra3: "Якщо щось зачіпає, дійте м’яко, але рішуче. Невеликі кроки, узгоджені з правдою, змінюють велику дугу шляху."
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

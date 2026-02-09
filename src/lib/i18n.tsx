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
    destinyExtra3: "If something stirs, act gently but deliberately. Small steps aligned with your truth change the larger arc of your path.",
    shareReading: "Share Reading",
    close: "Close",
    copied: "Copied!",
    copyLink: "Copy Link",
    copyLinkFailed: "Failed to copy link. Please try selecting and copying the text manually.",
    downloadImage: "Download Image",
    copyLinkManually: "Copy this link manually:",
    myTarotReading: "My Tarot Reading",
    viewReading: "View Reading",
    instagramShareInstructions: "Copy the link and paste it in your Instagram story or post caption.",
    sharedTarotReading: "Tarot Daily",
    sharedDeckSubtitle: "This reading was shared with you. The cards reveal insights about love, life, and destiny.",
    sharedDeckFooter: "Want to discover your own fortune?",
    drawYourOwn: "Draw Your Own Cards",
    seeTheFortune: "See fortune",
    checkTodaysFortune: "Check today's fortune",
    dateFormat: "en-US",
    loadingSharedReading: "Loading shared reading...",
    readingNotFound: "Reading Not Found",
    readingNotFoundMessage: "The shared reading could not be loaded.",
    backToHome: "Back to Home",
    knowledgeTitle: "Tarot Knowledge",
    knowledgeSubtitle: "The answers you are looking for are within you!",
    majorArcanaTitle: "Major Arcana",
    majorArcanaDescription: "The 22 cards of the Major Arcana represent life's most significant lessons and spiritual journey. These powerful archetypes guide us through major life transitions and spiritual growth.",
    minorArcanaTitle: "Minor Arcana",
    minorArcanaDescription: "The 56 cards of the Minor Arcana reflect daily life experiences and practical matters. Divided into four suits, they represent different aspects of human experience and growth.",
    quickAccessTitle: "Quick Access",
    major: "Major",
    minor: "Minor",
    cups: "Cups",
    wands: "Wands",
    swords: "Swords",
    pentacles: "Pentacles",
    backToKnowledge: "← Back to Knowledge",
    uprightLabel: "Upright:",
    reversedLabel: "Reversed:",
    understandingMinorArcana: "Understanding the Minor Arcana",
    numberCards: "Number Cards (Ace-10)",
    numberCardsDescription: "Each suit contains ten numbered cards representing different stages of development and experience within that suit's domain.",
    courtCards: "Court Cards",
    courtCardsDescription: "Each suit has four court cards (Page, Knight, Queen, King) representing different personality types and approaches to the suit's energy.",
    elementalAssociations: "Elemental Associations",
    elementalAssociationsDescription: "Cups (Water), Wands (Fire), Swords (Air), Pentacles (Earth) - each suit is connected to one of the four classical elements.",
    cardsCount: "14 Cards",
    cupsDescription: "Emotions, relationships, and matters of the heart",
    wandsDescription: "Passion, creativity, and spiritual energy",
    swordsDescription: "Thoughts, communication, and mental challenges",
    pentaclesDescription: "Material world, work, and physical manifestations",
    majorArcanaInfoTitle: "Understanding the 22 Major Arcana",
    majorArcanaInfoParagraph1: "The Major Arcana cards represent fundamental life forces through symbolic imagery of natural elements, mythological beings, and human experiences. Originating in 15th century Italy around 1440, these powerful archetypes remain deeply relevant to people across cultures today. The Major Arcana predates the Minor Arcana, initially serving as an exclusive pastime for the nobility, which explains the prevalence of royal symbols like crowns, ceremonial robes, and thrones throughout the deck. While originally designed as entertainment, these cards eventually transformed into tools for spiritual guidance and divination.",
    majorArcanaInfoParagraph2: "The dramatic and sometimes unsettling imagery of certain cards has historically sparked controversy and opposition. These cards address profound themes including mortality, struggle, and human suffering, which some found morally objectionable. Yet the deck also celebrates life's positive aspects such as renewal, growth, bravery, and personal empowerment. The Devil card's particularly disturbing imagery led to religious condemnation in the late 1400s, with some clergy warning that card players risked their souls.",
    majorArcanaInfoParagraph3: "During the 18th century, French occultists revived interest in the Major Arcana, studying them as instruments for exploring ethical and spiritual dimensions. Antoine Court de Gébelin popularized tarot as both a divination method and a gateway to ancient Egyptian wisdom. As tarot gained popularity, different cultures adapted the Major Arcana to reflect their own moral frameworks. Secret societies further developed these cards for cartomancy practices. Eliphas Lévi later connected the Hebrew mystical tradition of Kabbalah with tarot symbolism, while the early 20th century Rider-Waite deck incorporated Christian mystical elements.",
    majorArcanaInfoParagraph4: "While no single \"official\" tarot deck exists, most versions follow a similar sequence of twenty-two Major Arcana cards: The Fool (0), The Magician (1), The High Priestess (2), The Empress (3), The Emperor (4), The Hierophant (5), The Lovers (6), The Chariot (7), Strength (8), The Hermit (9), The Wheel of Fortune (10), Justice (11), The Hanged Man (12), Death (13), Temperance (14), The Devil (15), The Tower (16), The Star (17), The Moon (18), The Sun (19), Judgment (20), and The World (21). Although card names remain consistent, artistic interpretations vary significantly across different decks. Modern tarot continues evolving with contemporary themes, including pop culture-inspired decks featuring characters from Star Wars, The Simpsons, and other media, reflecting the ever-changing nature of human experience."
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
    destinyExtra3: "Якщо щось зачіпає, дійте м'яко, але рішуче. Невеликі кроки, узгоджені з правдою, змінюють велику дугу шляху.",
    shareReading: "Поділитися читанням",
    close: "Закрити",
    copied: "Скопійовано!",
    copyLink: "Скопіювати посилання",
    copyLinkFailed: "Не вдалося скопіювати посилання. Спробуйте вибрати та скопіювати текст вручну.",
    downloadImage: "Завантажити зображення",
    copyLinkManually: "Скопіюйте це посилання вручну:",
    myTarotReading: "Моє читання таро",
    viewReading: "Переглянути читання",
    instagramShareInstructions: "Скопіюйте посилання та вставте його в свою історію Instagram або підпис до поста.",
    sharedTarotReading: "Щоденне Таро",
    sharedDeckSubtitle: "Це читання таро було поділено з вами. Карти розкривають інсайти про кохання, життя та долю.",
    sharedDeckFooter: "Хочете дізнатися свою власну долю?",
    drawYourOwn: "Витягніть власні карти",
    seeTheFortune: "Побачити долю",
    checkTodaysFortune: "Перевірити сьогоднішню долю",
    dateFormat: "uk-UA",
    loadingSharedReading: "Завантаження спільного читання...",
    readingNotFound: "Читання не знайдено",
    readingNotFoundMessage: "Спільне читання не вдалося завантажити.",
    backToHome: "Повернутися на головну",
    knowledgeTitle: "Знання Таро",
    knowledgeSubtitle: "Відповіді, які ти шукаєш, знаходяться всередині тебе!",
    majorArcanaTitle: "Старші Аркани",
    majorArcanaDescription: "22 карти Старших Арканів представляють найважливіші уроки життя та духовну подорож. Ці потужні архетипи направляють нас через основні життєві переходи та духовне зростання.",
    minorArcanaTitle: "Малі Аркани",
    minorArcanaDescription: "56 карт Малих Арканів відображають щоденні життєві досвіди та практичні питання. Розділені на чотири масті, вони представляють різні аспекти людського досвіду та зростання.",
    quickAccessTitle: "Швидкий доступ",
    major: "Старші",
    minor: "Малі",
    cups: "Кубки",
    wands: "Жезли",
    swords: "Мечі",
    pentacles: "Пентаклі",
    backToKnowledge: "← Повернутися до знань",
    uprightLabel: "Пряма:",
    reversedLabel: "Перевернута:",
    understandingMinorArcana: "Розуміння Малих Арканів",
    numberCards: "Нумеровані карти (Туз-10)",
    numberCardsDescription: "Кожна масть містить десять нумерованих карт, що представляють різні етапи розвитку та досвіду в межах сфери цієї масті.",
    courtCards: "Придворні карти",
    courtCardsDescription: "Кожна масть має чотири придворні карти (Паж, Лицар, Королева, Король), що представляють різні типи особистостей та підходи до енергії масті.",
    elementalAssociations: "Стихійні асоціації",
    elementalAssociationsDescription: "Кубки (Вода), Жезли (Вогонь), Мечі (Повітря), Пентаклі (Земля) - кожна масть пов'язана з однією з чотирьох класичних стихій.",
    cardsCount: "14 карт",
    cupsDescription: "Емоції, стосунки та питання серця",
    wandsDescription: "Пристрасть, творчість та духовна енергія",
    swordsDescription: "Думки, спілкування та ментальні виклики",
    pentaclesDescription: "Матеріальний світ, робота та фізичні прояви",
    majorArcanaInfoTitle: "Розуміння 22 Старших Арканів",
    majorArcanaInfoParagraph1: "Старші Аркани представляють фундаментальні життєві сили через символічні образи природних елементів, міфологічних істот та людського досвіду. Походженням з Італії XV століття близько 1440 року, ці потужні архетипи залишаються глибоко актуальними для людей різних культур. Старші Аркани передували Малим Арканам, спочатку служачи виключною розвагою для знаті, що пояснює поширеність королівських символів, таких як корони, церемоніальні мантії та трони по всій колоді. Хоча спочатку створені для розваги, ці карти згодом перетворилися на інструменти духовного керівництва та ворожіння.",
    majorArcanaInfoParagraph2: "Драматичні та іноді тривожні образи деяких карт історично викликали суперечки та опір. Ці карти розглядають глибокі теми, включаючи смертність, боротьбу та людські страждання, що деякі вважали морально неприйнятними. Проте колода також святкує позитивні аспекти життя, такі як оновлення, зростання, мужність та особисте розкріпачення. Особливо тривожні образи карти Диявола призвели до релігійного засудження в кінці 1400-х років, коли деякі священнослужителі попереджали, що гравці ризикують своїми душами.",
    majorArcanaInfoParagraph3: "У XVIII столітті французькі окультисти відновили інтерес до Старших Арканів, вивчаючи їх як інструменти для дослідження етичних та духовних вимірів. Антуан Кур де Жеблен популяризував таро як метод ворожіння та шлях до давньоєгипетської мудрості. Зі зростанням популярності таро різні культури адаптували Старші Аркани, щоб відображати власні моральні рамки. Таємні товариства розвивали ці карти для практик картоманії. Еліфас Леві пізніше пов'язав єврейську містичну традицію Кабали з символікою таро, тоді як колода Райдера-Вейта початку XX століття інтегрувала християнські містичні елементи.",
    majorArcanaInfoParagraph4: "Хоча не існує єдиної 'офіційної' колоди таро, більшість версій дотримуються схожої послідовності двадцяти двох Старших Арканів: Блазень (0), Маг (1), Верховна Жриця (2), Імператриця (3), Імператор (4), Ієрофант (5), Закохані (6), Колісниця (7), Сила (8), Відлюдник (9), Колесо Фортуни (10), Справедливість (11), Повішений (12), Смерть (13), Помірність (14), Диявол (15), Вежа (16), Зірка (17), Місяць (18), Сонце (19), Суд (20) та Світ (21). Хоча назви карт залишаються послідовними, художні інтерпретації значно відрізняються в різних колодах. Сучасне таро продовжує розвиватися з актуальними темами, включаючи колоди, натхненні поп-культурою, з персонажами з Зоряних воєн, Сімпсонів та інших медіа, відображаючи постійно змінювану природу людського досвіду."
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

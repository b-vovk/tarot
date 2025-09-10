"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { loadClassicDeck } from "@/data/decks";
import type { Card } from "@/data/decks";
import { trackTarotReading, trackCardSelection, trackReadingCompletion, trackUserEngagement } from "@/lib/analytics";
import ShareModal from "./ShareModal";
type DrawnCard = Card & { position: "upright" | "reversed" };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawThree(source: Card[]): DrawnCard[] {
  const deck = source.slice();
  const initial = shuffle(deck).slice(0, Math.min(3, deck.length));

  // Ensure at least one Major Arcana is present
  const containsMajor = initial.some((card) => card.id.startsWith("major_"));
  let picked = initial;
  if (!containsMajor) {
    const majorsAvailable = deck.filter(
      (c) => c.id.startsWith("major_") && !initial.some((p) => p.id === c.id)
    );
    if (majorsAvailable.length > 0) {
      const replacementIndex = Math.floor(Math.random() * initial.length);
      const major = majorsAvailable[Math.floor(Math.random() * majorsAvailable.length)];
      picked = initial.slice();
      picked[replacementIndex] = major;
    }
  }

  return picked.map((card) => ({
    ...card,
    position: Math.random() < 0.5 ? "reversed" : "upright",
  }));
}

export default function Deck() {
  const { t, lang } = useI18n();

  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [revealed, setRevealed] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [entered, setEntered] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isFresh, setIsFresh] = useState<boolean>(false);
  const [fullDeck, setFullDeck] = useState<Card[] | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // const didMount = useRef(false); // Removed unused variable
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const skipNextEntranceRef = useRef<boolean>(false);
  const pendingFlipBackCountRef = useRef<number>(0);

  // Helper function to determine reading type based on current path
  const getReadingType = useCallback((): string => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('/love')) return t('love');
      if (window.location.pathname.includes('/career')) return t('career');
      if (window.location.pathname.includes('/destiny')) return t('destiny');
      // For the main page, use a more generic reading type
      if (window.location.pathname === '/' || window.location.pathname === '') {
        return t('home'); // "Tarot Daily" in English, "Щоденне Таро" in Ukrainian
      }
    }
    return t('life');
  }, [t]);

  // Fit the fixed card title on one line without ellipsis by shrinking font-size on mobile
  useEffect(() => {
    function fitTitles() {
      const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      const isSinglePage = typeof window !== "undefined" && (window.location.pathname.includes('/love') || window.location.pathname.includes('/career') || window.location.pathname.includes('/destiny'));
      
      // Use appropriate font sizes for single pages
      const maxFontSize = isSinglePage ? (isMobile ? 18 : 30) : (isMobile ? 18 : 52);
      const minFontSize = isSinglePage ? (isMobile ? 14 : 30) : (isMobile ? 12 : 18);

      cardRefs.current.forEach((cardEl) => {
        if (!cardEl) return;
        const titles = cardEl.querySelectorAll<HTMLElement>(".cardTitleFixed");
        if (!titles.length) return;
        const availableWidth = Math.max(0, cardEl.clientWidth - 20);

        titles.forEach((titleEl) => {
          titleEl.style.fontSize = `${maxFontSize}px`;
          const currentScrollWidth = titleEl.scrollWidth;
          if (currentScrollWidth > availableWidth && availableWidth > 0) {
            let nextSize = Math.floor((availableWidth / currentScrollWidth) * maxFontSize);
            nextSize = Math.max(nextSize, minFontSize);
            titleEl.style.fontSize = `${nextSize}px`;
            let guard = 20;
            while (titleEl.scrollWidth > availableWidth && nextSize > minFontSize && guard-- > 0) {
              nextSize -= 1;
              titleEl.style.fontSize = `${nextSize}px`;
            }
          }
          
          // Ensure proper centering after font size changes
          titleEl.style.textAlign = 'center';
          titleEl.style.left = '0';
          titleEl.style.right = '0';
          titleEl.style.transform = 'translateX(0)';
          
          // Ensure titles are properly flipped for reversed cards
          if (titleEl.closest('.reversed')) {
            titleEl.style.transform = 'translateX(0) scaleY(-1)';
          }
          
          // Also ensure other text elements in reversed cards are properly flipped
          const cardEl = titleEl.closest('.card');
          if (cardEl && cardEl.classList.contains('reversed')) {
            const titleElements = cardEl.querySelectorAll('.cardTitle, .cardBody');
            titleElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.transform = 'scaleY(-1)';
              }
            });
          }
        });
      });
    }

    fitTitles();
    const onResize = () => fitTitles();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cards, revealed, entered]);

  // Load deck per language and keep current drawn cards' ids while updating their text
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const loaded = await loadClassicDeck(lang);
      if (cancelled) return;
      setFullDeck(loaded);
      setCards((prev) => {
        if (!prev || prev.length === 0) {
          const newCards = drawThree(loaded.filter(Boolean));
          // Track new reading start
          const readingType = getReadingType();
          trackTarotReading(readingType as 'love' | 'career' | 'destiny');
          return newCards;
        }
        const idToCard: Record<string, Card> = Object.fromEntries(
          loaded.map((c) => [c.id, c])
        );
        return prev.map((dc) => {
          const updated = idToCard[dc.id];
          if (!updated) return dc;
          return {
            ...dc,
            name: updated.name,
            upright: updated.upright,
            reversed: updated.reversed,
            description: updated.description,
          };
        });
      });
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lang, getReadingType]);

  // Track mobile environment (touch/no-hover or small screen)
  useEffect(() => {
    const updateIsMobile = () => {
      const noHover = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches;
      const small = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(Boolean(noHover || small));
    };
    updateIsMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateIsMobile);
      return () => window.removeEventListener("resize", updateIsMobile);
    }
  }, []);

  useEffect(() => {
    if (!cards) return;
    if (skipNextEntranceRef.current) {
      // Show instantly without entrance animation
      skipNextEntranceRef.current = false;
      setEntered([true, true, true]);
      setIsFresh(true);
      // clear fresh flag after paint so normal flips show fronts as needed
      const id = setTimeout(() => setIsFresh(false), 0);
      return () => clearTimeout(id);
      return;
    }
    setEntered([false, false, false]);
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    [0, 1, 2].forEach((i) => {
      timers.push(
        setTimeout(() => {
          setEntered((e) => {
            const next = [...e] as [boolean, boolean, boolean];
            next[i] = true;
            return next;
          });
        }, i * 450)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [cards]);

  const allRevealed = revealed.every(Boolean);

  // Function to generate share data
  function generateShareData() {
    if (!cards) return null;
    
    const shareData = {
      cards: cards.map(card => ({
        id: card.id,
        name: card.name,
        position: card.position,
      })),
      readingType: getReadingType(),
      date: (() => {
        try {
          return new Date().toLocaleDateString(t('dateFormat') as string, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch {
          // Fallback to English if locale is invalid
          return new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      })(),
    };

    // Encode the data for the URL using URL-safe base64
    const encodedData = encodeForUrl(shareData);
    if (!encodedData) {
      console.error('Failed to encode share data');
      return null;
    }
    const shareUrl = `${window.location.origin}/share/${encodedData}`;
    
    return {
      ...shareData,
      shareUrl,
    };
  }

  // Function to safely encode data for URLs with ultra-compact encoding
  function encodeForUrl(data: unknown): string {
    try {
      const readingData = data as { cards: Array<{ id: string; position: 'upright' | 'reversed' }>; readingType: string; date: string };
      
      // Create short card ID mapping
      const cardIdMap: Record<string, string> = {
        'major_00_the_fool': 'F',
        'major_01_the_magician': 'M',
        'major_02_the_high_priestess': 'H',
        'major_03_the_empress': 'E',
        'major_04_the_emperor': 'P',
        'major_05_the_hierophant': 'Y',
        'major_06_the_lovers': 'L',
        'major_07_the_chariot': 'C',
        'major_08_strength': 'S',
        'major_09_the_hermit': 'R',
        'major_10_wheel_of_fortune': 'W',
        'major_11_justice': 'J',
        'major_12_the_hanged_man': 'N',
        'major_13_death': 'D',
        'major_14_temperance': 'T',
        'major_15_the_devil': 'V',
        'major_16_the_tower': 'O',
        'major_17_the_star': 'A',
        'major_18_the_moon': 'B',
        'major_19_the_sun': 'U',
        'major_20_judgement': 'G',
        'major_21_the_world': 'X',
        'wands_01_ace_of_wands': 'AW',
        'wands_02_two_of_wands': '2W',
        'wands_03_three_of_wands': '3W',
        'wands_04_four_of_wands': '4W',
        'wands_05_five_of_wands': '5W',
        'wands_06_six_of_wands': '6W',
        'wands_07_seven_of_wands': '7W',
        'wands_08_eight_of_wands': '8W',
        'wands_09_nine_of_wands': '9W',
        'wands_10_ten_of_wands': 'TW',
        'cups_01_ace_of_cups': 'AC',
        'cups_02_two_of_cups': '2C',
        'cups_03_three_of_cups': '3C',
        'cups_04_four_of_cups': '4C',
        'cups_05_five_of_cups': '5C',
        'cups_06_six_of_cups': '6C',
        'cups_07_seven_of_cups': '7C',
        'cups_08_eight_of_cups': '8C',
        'cups_09_nine_of_cups': '9C',
        'cups_10_ten_of_cups': 'TC',
        'swords_01_ace_of_swords': 'AS',
        'swords_02_two_of_swords': '2S',
        'swords_03_three_of_swords': '3S',
        'swords_04_four_of_swords': '4S',
        'swords_05_five_of_swords': '5S',
        'swords_06_six_of_swords': '6S',
        'swords_07_seven_of_swords': '7S',
        'swords_08_eight_of_swords': '8S',
        'swords_09_nine_of_swords': '9S',
        'swords_10_ten_of_swords': 'TS',
        'pentacles_01_ace_of_pentacles': 'AP',
        'pentacles_02_two_of_pentacles': '2P',
        'pentacles_03_three_of_pentacles': '3P',
        'pentacles_04_four_of_pentacles': '4P',
        'pentacles_05_five_of_pentacles': '5P',
        'pentacles_06_six_of_pentacles': '6P',
        'pentacles_07_seven_of_pentacles': '7P',
        'pentacles_08_eight_of_pentacles': '8P',
        'pentacles_09_nine_of_pentacles': '9P',
        'pentacles_10_ten_of_pentacles': 'TP'
      };

      // Encode cards as short strings
      const cardData = readingData.cards.map(card => {
        const shortId = cardIdMap[card.id] || card.id;
        const position = card.position === 'upright' ? 'U' : 'R';
        return `${shortId}${position}`;
      }).join('');

      // Create compact format: readingType|date|cards
      const compact = `${readingData.readingType}|${readingData.date}|${cardData}`;
      
      // Encode the compact data directly to base64
      const encoded = btoa(compact)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      return encoded;
    } catch (error) {
      console.error('Error encoding share data:', error);
      return '';
    }
  }

  function reveal(index: number) {
    if (!cards) return;
    
    // Track card reveal
    if (cards[index]) {
      trackCardSelection(cards[index].name, index + 1);
    }
    
    setRevealed((r) => {
      const newRevealed = r[index] ? r : (r.map((v, i) => (i === index ? true : v)) as typeof r);
      
      // Track reading completion when all cards are revealed
      if (newRevealed.every(Boolean)) {
        const readingType = getReadingType();
        trackReadingCompletion(readingType, 0); // Duration will be calculated separately
      }
      
      return newRevealed;
    });
  }

  function reset() {
    // Track reset action
    trackUserEngagement('click', 'draw_again_button');
    
    setModalIndex(null);
    setIsResetting(true);
    // Wait for all currently revealed cards to flip back before drawing anew
    const flipsToWaitFor = revealed.filter(Boolean).length;
    pendingFlipBackCountRef.current = flipsToWaitFor;
    setRevealed([false, false, false]);
    if (flipsToWaitFor === 0) {
      finalizeReset();
    }
  }

  function finalizeReset() {
    const safeDeck = (fullDeck ?? []).filter(Boolean);
    // Prevent entrance animation on the new set
    skipNextEntranceRef.current = true;
    const newCards = drawThree(safeDeck);
    setCards(newCards);
    setIsResetting(false);
    
    // Track new reading after reset
    const readingType = getReadingType();
    trackTarotReading(readingType as 'love' | 'career' | 'destiny');
  }

  function handleFlipTransitionEnd(index: number, e: React.TransitionEvent<HTMLDivElement>) {
    // Only care about the transform transition of the flip, and only while resetting
    if (e.propertyName !== "transform" || !isResetting) return;
    // Ensure this card is now in the back state
    if (revealed[index]) return;
    if (pendingFlipBackCountRef.current > 0) {
      pendingFlipBackCountRef.current -= 1;
      if (pendingFlipBackCountRef.current === 0) {
        finalizeReset();
      }
    }
  }

  const placeholders = [0, 1, 2];

  function handleTitleClick(e: React.MouseEvent<HTMLDivElement>, index: number) {
    if (!cards) return;
    if (isMobile) {
      e.stopPropagation();
      if (isResetting) return;
      if (revealed[index]) {
        setModalIndex(index);
      }
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLDivElement>, index: number) {
    if ((e.key === "Enter" || e.key === " ") && isMobile && revealed[index]) {
      e.preventDefault();
      e.stopPropagation();
      if (!isResetting) setModalIndex(index);
    }
  }

  function closeModal() {
    setModalIndex(null);
  }

  // Close modal on Escape
  useEffect(() => {
    if (modalIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setModalIndex(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalIndex]);

  // Lock body scroll when modal open on mobile
  useEffect(() => {
    if (!(isMobile && modalIndex !== null)) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [isMobile, modalIndex]);

  return (
    <>
      <div className={`deck ${isResetting ? "resetting" : ""} ${isFresh ? "fresh" : ""}`}>
        {placeholders.map((idx) => {
          const isRevealed = revealed[idx];
          const card = cards?.[idx] ?? null;
          const aspectLabels = [t("love"), t("life"), t("career")];
          const backLabel = aspectLabels[idx] ?? "";
          const meaning = card
            ? card.position === "upright"
              ? card.description?.upright ?? card.upright
              : card.description?.reversed ?? card.reversed
            : "…";

          const enterClass = entered[idx] ? "entered" : "enter";
          const frontImageClass = card?.id 
            ? `cardFront-${card.id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
            : "";
          const suitClass = card?.id
            ? (() => {
                const suit = card.id.split("_")[0];
                return `suit-${suit}`;
              })()
            : "";

          return (
            <div
              key={idx}
              className={`card ${enterClass} ${isRevealed ? "revealed" : ""}`}
              ref={(el) => { cardRefs.current[idx] = el; }}
              onClick={() => {
                if (isResetting) return;
                if (isMobile && isRevealed) {
                  setModalIndex(idx);
                } else {
                  reveal(idx);
                }
              }}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && reveal(idx)
              }
              role="button"
              tabIndex={0}
              aria-label={`${t("revealCard")} ${idx + 1}`}
            >
              <div
                className="cardInner"
                onTransitionEnd={(e) => handleFlipTransitionEnd(idx, e)}
              >
                {/* Listen for the end of the flip-back transition */}
                {/* BACK — unique image per card */}
                <div className={`cardFace cardBack cardBack-${idx}`}>
                  <div className="cardBackLabel" aria-hidden="true">{backLabel}</div>
                </div>

                {/* FRONT */}
                <div className={`cardFace cardFront ${frontImageClass} ${suitClass} ${card?.position === "reversed" ? "reversed" : ""}`}>
                  <div
                    className="cardTitleFixed"
                    onClick={(e) => handleTitleClick(e, idx)}
                    onKeyDown={(e) => handleTitleKeyDown(e, idx)}
                    role={isMobile ? "button" : undefined}
                    tabIndex={isMobile ? 0 : -1}
                    aria-label={card ? `${card.name} ${t("details")}` : t("cardDetails")}
                  >
                    {card?.name || t("card")}
                  </div>
                  <div className="cardContent">
                    <div className="cardBody">{meaning}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button
          className="primary"
          onClick={reset}
          disabled={!allRevealed || !cards}
        >
          {t("drawAgain")}
        </button>
        {allRevealed && cards && (
          <button
            className="secondary shareButton"
            onClick={() => setShowShareModal(true)}
          >
            {t("shareReading")}
          </button>
        )}
        {!allRevealed && <span className="helper">{t("helper")}</span>}
      </div>

      {/* Mobile-only modal */}
      {isMobile && modalIndex !== null && cards && (
        <div className="mobileModalOverlay isOpen" role="dialog" aria-modal="true" onClick={closeModal}>
          {(() => {
            const modalCard = cards[modalIndex];
            const frontImageClass = modalCard?.id
              ? `cardFront-${modalCard.id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
              : "";
            const suitClass = modalCard?.id
              ? (() => {
                  const suit = modalCard.id.split("_")[0];
                  return `suit-${suit}`;
                })()
              : "";
            const meaning = modalCard
              ? modalCard.position === "upright"
                ? modalCard.description?.upright ?? modalCard.upright
                : modalCard.description?.reversed ?? modalCard.reversed
              : "";
            return (
              <div
                className={`mobileModalCard cardFront ${frontImageClass} ${suitClass} ${modalCard?.position === "reversed" ? "reversed" : ""}`}
                onClick={closeModal}
              >
                <div className="cardContent">
                  <div className="cardTitle">{modalCard?.name || t("card")}</div>
                  <div className="cardBody">{meaning}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && cards && (() => {
        const shareData = generateShareData();
        if (!shareData) {
          // If share data generation fails, close modal and show error
          setShowShareModal(false);
          alert('Failed to generate share data. Please try again.');
          return null;
        }
        return (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            shareData={shareData}
          />
        );
      })()}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { loadClassicDeck } from "@/data/decks";
import type { Card } from "@/data/decks";
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

  const didMount = useRef(false);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const skipNextEntranceRef = useRef<boolean>(false);
  const pendingFlipBackCountRef = useRef<number>(0);

  // Fit the fixed card title on one line without ellipsis by shrinking font-size on mobile
  useEffect(() => {
    function fitTitles() {
      const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      const maxFontSize = isMobile ? 16 : 24; // cap for mobile to match CSS clamp upper-bound
      const minFontSize = isMobile ? 11 : 14; // lower-bound for mobile

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
          return drawThree(loaded.filter(Boolean));
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
  }, [lang]);

  // Track mobile environment (touch/no-hover or small screen)
  useEffect(() => {
    const updateIsMobile = () => {
      const noHover = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: none)").matches;
      const small = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(Boolean(noHover || small));
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
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

  function reveal(index: number) {
    if (!cards) return;
    setRevealed((r) =>
      r[index] ? r : (r.map((v, i) => (i === index ? true : v)) as typeof r)
    );
  }

  function reset() {
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
    setCards(drawThree(safeDeck));
    setIsResetting(false);
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
                <div className={`cardFace cardBack cardBack-${idx}`} />

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
                <div className="cardTitleFixed">{modalCard?.name || t("card")}</div>
                <div className="cardContent">
                  <div className="cardTitle">{modalCard?.name || t("card")}</div>
                  <div className="cardBody">{meaning}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}

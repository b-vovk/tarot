"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { loadClassicDeck } from "@/data/decks";
import type { Card } from "@/data/decks";

type AspectKey = "love" | "career" | "destiny";

export default function SingleCard({ aspect, extra }: { aspect: AspectKey; extra?: React.ReactNode }) {
  const { t, lang } = useI18n();
  const [card, setCard] = useState<Card | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [entered, setEntered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Flag body for single-card page to enable mobile-specific layout without affecting desktop
    if (typeof document !== "undefined") {
      document.body.classList.add("is-single-page");
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("is-single-page");
      }
    };
  }, []);

  // Mobile detection for modal functionality
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  async function drawOne(currentLang: typeof lang) {
    const deck = (await loadClassicDeck(currentLang)).filter(Boolean);
    if (deck.length === 0) return;
    const picked = deck[Math.floor(Math.random() * deck.length)];
    setCard(picked);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const deck = (await loadClassicDeck(lang)).filter(Boolean);
      if (cancelled) return;
      if (deck.length > 0) {
        const picked = deck[Math.floor(Math.random() * deck.length)];
        setCard(picked);
        setEntered(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  function reset() {
    setRevealed(false);
    setModalOpen(false);
    // Draw anew after flip-back completes visually
    setTimeout(() => drawOne(lang), 300);
  }

  function handleCardClick() {
    if (isMobile && revealed) {
      setModalOpen(true);
    } else {
      setRevealed(true);
    }
  }

  function handleTitleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile && revealed) {
      e.stopPropagation();
      setModalOpen(true);
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if ((e.key === "Enter" || e.key === " ") && isMobile && revealed) {
      e.preventDefault();
      e.stopPropagation();
      setModalOpen(true);
    }
  }

  function closeModal() {
    setModalOpen(false);
  }

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // Lock body scroll when modal open on mobile
  useEffect(() => {
    if (!(isMobile && modalOpen)) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [isMobile, modalOpen]);

  const frontImageClass = card?.id ? `cardFront-${card.id.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}` : "";
  const suitClass = card?.id
    ? (() => {
        const suit = card.id.split("_")[0];
        return `suit-${suit}`;
      })()
    : "";

  const meaning = card
    ? card.description?.upright ?? card.upright ?? ""
    : "";

  const titleKeyMap = {
    love: { title: "loveTitle", subtitle: "loveSubtitle" },
    career: { title: "careerTitle", subtitle: "careerSubtitle" },
    destiny: { title: "destinyTitle", subtitle: "destinySubtitle" },
  } as const;
  const labelKeyMap = { love: "love", career: "career", destiny: "destiny" } as const;
  const heading = t(titleKeyMap[aspect].title);
  const subheading = t(titleKeyMap[aspect].subtitle);
  const backLabel = t(labelKeyMap[aspect]);

  return (
    <>
      <div className="homeBg" aria-hidden="true" />
      <div className="singlePage">
        <div className="singleRow">
        <div className="singleColLeft">
          <div className={`deck`} style={{ height: "100%" }}>
            <div
              className={`card ${entered ? "entered" : "enter"} ${revealed ? "revealed" : ""}`}
              ref={cardRef}
              onClick={handleCardClick}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()}
              role="button"
              tabIndex={0}
              aria-label={`${t("revealCard")} 1`}
            >
              <div className="cardInner">
                {(() => {
                  const backIdx = aspect === "love" ? 0 : aspect === "destiny" ? 1 : 2;
                  return (
                    <div className={`cardFace cardBack cardBack-${backIdx}`}>
                      <div className="cardBackLabel" aria-hidden="true">{backLabel}</div>
                    </div>
                  );
                })()}
                <div className={`cardFace cardFront ${frontImageClass} ${suitClass}`}>
                  <div 
                    className="cardTitleFixed"
                    onClick={handleTitleClick}
                    onKeyDown={handleTitleKeyDown}
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
          </div>
          <div className="actions">
            <button className="primary" onClick={reset} disabled={!revealed || !card}>
              {t("drawAgain")}
            </button>
            {!revealed && (
              <span className="helper">
                {(() => {
                  const map = {
                    love: "revealYourLoveCard",
                    destiny: "revealYourDestinyCard",
                    career: "revealYourCareerCard",
                  } as const;
                  return t(map[aspect]);
                })()}
              </span>
            )}
          </div>
        </div>
        <div className="singleColRight">
          <h1>{heading}</h1>
          <p>{subheading}</p>
          <div className="singleExtra">
            {extra ?? (
              (() => {
                const extraKeysMap = {
                  love: ["loveExtra1", "loveExtra2", "loveExtra3"],
                  career: ["careerExtra1", "careerExtra2", "careerExtra3"],
                  destiny: ["destinyExtra1", "destinyExtra2", "destinyExtra3"],
                } as const;
                return extraKeysMap[aspect].map((k) => <p key={k}>{t(k)}</p>);
              })()
            )}
          </div>
        </div>
      </div>

      {/* Mobile-only modal */}
      {isMobile && modalOpen && card && (
        <div className="mobileModalOverlay isOpen" role="dialog" aria-modal="true" onClick={closeModal}>
          <div
            className={`mobileModalCard cardFront ${frontImageClass} ${suitClass}`}
            onClick={closeModal}
          >
            <div className="cardContent">
              <div className="cardTitle">{card?.name || t("card")}</div>
              <div className="cardBody">{meaning}</div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}



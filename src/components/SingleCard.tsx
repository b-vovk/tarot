"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { loadClassicDeck } from "@/data/decks";
import type { Card } from "@/data/decks";
import ShareModal from "./ShareModal";

type AspectKey = "love" | "career" | "destiny";

export default function SingleCard({ aspect, extra }: { aspect: AspectKey; extra?: React.ReactNode }) {
  const { t, lang } = useI18n();
  const [card, setCard] = useState<Card | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [entered, setEntered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
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

  // Function to generate share data
  function generateShareData() {
    if (!card) return null;
    
    const shareData = {
      cards: [{
        id: card.id,
        name: card.name,
        position: 'upright' as const, // Single cards are always upright
      }],
      readingType: (() => {
        switch (aspect) {
          case 'love': return 'Love Reading';
          case 'career': return 'Career Reading';
          case 'destiny': return 'Destiny Reading';
          default: return 'Tarot Reading';
        }
      })(),
      date: new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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
      
      // Properly encode Unicode strings before base64 encoding
      const encoded = btoa(encodeURIComponent(compact))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      return encoded;
    } catch (error) {
      console.error('Error encoding share data:', error);
      return '';
    }
  }

  // Auto-scale card titles to fit
  useEffect(() => {
    if (!card || !revealed) return;
    
    const titleElement = cardRef.current?.querySelector('.cardTitleFixed') as HTMLElement;
    if (!titleElement) return;
    
    const fitTitle = () => {
      const cardWidth = cardRef.current?.offsetWidth || 0;
      const titleWidth = titleElement.scrollWidth;
      const maxWidth = cardWidth - 20; // Account for padding
      
      if (titleWidth > maxWidth) {
        const scale = maxWidth / titleWidth;
        titleElement.style.transform = `scale(${Math.min(scale, 1)})`;
      } else {
        titleElement.style.transform = 'scale(1)';
      }
    };
    
    fitTitle();
    window.addEventListener('resize', fitTitle);
    return () => window.removeEventListener('resize', fitTitle);
  }, [card, revealed]);

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
          <div className={`deck`} style={{ height: "100%", paddingLeft: "0", marginLeft: "0", justifyContent: "flex-start" }}>
            <div
              className={`card ${entered ? "entered" : "enter"} ${revealed ? "revealed" : ""}`}
              ref={cardRef}
              onClick={handleCardClick}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleCardClick()}
              role="button"
              tabIndex={0}
              aria-label={`${t("revealCard")} 1`}
              style={{ left: "12px", marginLeft: "0", position: "relative" }}
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
          <div className="actions" style={{ left: "12px", paddingLeft: "0", position: "relative" }}>
            <button className="primary" onClick={reset} disabled={!revealed || !card}>
              {t("drawAgain")}
            </button>
            {revealed && card && (
              <button
                className="secondary shareButton"
                onClick={() => setShowShareModal(true)}
              >
                {t("shareReading")}
              </button>
            )}
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

      {/* Share Modal */}
      {showShareModal && card && (() => {
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
    </div>
    </>
  );
}



'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { loadClassicDeck } from '@/data/decks';
import type { Card } from '@/data/decks';
import ShareModal from './ShareModal';

interface SharedCard {
  id: string;
  name: string;
  position: 'upright' | 'reversed';
  upright: string;
  reversed: string;
  description?: {
    upright: string;
    reversed: string;
  };
}

interface SharedDeckProps {
  cards: SharedCard[];
  readingType: string;
  date: string;
}

export default function SharedDeck({ cards, readingType, date }: SharedDeckProps) {
  const { t, lang } = useI18n();
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [translatedDeck, setTranslatedDeck] = useState<Card[] | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);

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

  // Fit the fixed card title on one line without ellipsis by shrinking font-size
  useEffect(() => {
    function fitTitles() {
      const isMobile = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 768px)").matches;
      const maxFontSize = isMobile ? 18 : 30;
      const minFontSize = isMobile ? 14 : 18;

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
        });
      });
    }

    fitTitles();
    const onResize = () => fitTitles();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cards]);

  // Card click handlers for modal
  function handleCardClick(e: React.MouseEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    setModalIndex(index);
  }

  function handleCardKeyDown(e: React.KeyboardEvent, index: number) {
    if ((e.key === "Enter" || e.key === " ") && isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setModalIndex(index);
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

  // Load translated deck for card name translations
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const loaded = await loadClassicDeck(lang);
      if (cancelled) return;
      setTranslatedDeck(loaded);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  // Function to get translated card name
  function getTranslatedCardName(cardId: string): string {
    if (!translatedDeck) return cards.find(c => c.id === cardId)?.name || '';
    const translatedCard = translatedDeck.find(c => c.id === cardId);
    return translatedCard?.name || cards.find(c => c.id === cardId)?.name || '';
  }

  // Function to get translated card description
  function getTranslatedCardDescription(cardId: string, position: 'upright' | 'reversed'): string {
    if (!translatedDeck) {
      // Fallback to original card data if translated deck not loaded yet
      const originalCard = cards.find(c => c.id === cardId);
      if (!originalCard) return '';
      return position === 'upright' 
        ? (originalCard.description?.upright ?? originalCard.upright)
        : (originalCard.description?.reversed ?? originalCard.reversed);
    }
    
    const translatedCard = translatedDeck.find(c => c.id === cardId);
    if (!translatedCard) {
      // Fallback to original card data if card not found in translated deck
      const originalCard = cards.find(c => c.id === cardId);
      if (!originalCard) return '';
      return position === 'upright' 
        ? (originalCard.description?.upright ?? originalCard.upright)
        : (originalCard.description?.reversed ?? originalCard.reversed);
    }
    
    // Use translated card description
    return position === 'upright' 
      ? (translatedCard.description?.upright ?? translatedCard.upright ?? '')
      : (translatedCard.description?.reversed ?? translatedCard.reversed ?? '');
  }

  // Function to generate share data for the shared deck
  function generateShareData() {
    if (!cards) return null;
    
    // Ensure we use the most up-to-date translated names
    const shareData = {
      cards: cards.map(card => {
        // Get the translated name, but if not available, use the original card name
        // and ensure it's properly translated by checking the current language
        let cardName = getTranslatedCardName(card.id);
        
        // If we still don't have a translated name, try to get it from the current deck
        if (!cardName || cardName === card.name) {
          // The card name might already be translated in the original cards prop
          cardName = card.name;
        }
        
        return {
          id: card.id,
          name: cardName,
          position: card.position,
        };
      }),
      readingType: readingType,
      date: date,
    };

    // Encode the data for the URL using URL-safe base64
    const encodedData = encodeForUrl(shareData);
    if (!encodedData) {
      console.error('Failed to encode share data');
      return null;
    }
    const shareUrl = `${window.location.origin}/share/${encodedData}`;
    console.log('Generated share URL:', shareUrl);
    console.log('Share URL length:', shareUrl.length);
    console.log('Share data cards:', shareData.cards);
    
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

  // Safety check for cards array (after hooks)
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return (
      <div className="errorContainer">
        <h1>Invalid Reading Data</h1>
        <p>No valid cards found in this reading.</p>
        <Link href="/" className="backToHomeButton">
          Back to Home
        </Link>
      </div>
    );
  }

  // Determine if this is a single card reading and get reading type info
  const isSingleCardReading = cards.length === 1;
  
  const getReadingTypeInfo = () => {
    if (!isSingleCardReading) return null;
    
    const readingTypeLower = readingType.toLowerCase();
    
    if (readingTypeLower.includes('love')) {
      return {
        title: t('loveTitle'),
        subtitle: t('loveSubtitle'),
        extraKeys: ['loveExtra1', 'loveExtra2', 'loveExtra3']
      };
    } else if (readingTypeLower.includes('career')) {
      return {
        title: t('careerTitle'),
        subtitle: t('careerSubtitle'),
        extraKeys: ['careerExtra1', 'careerExtra2', 'careerExtra3']
      };
    } else if (readingTypeLower.includes('destiny')) {
      return {
        title: t('destinyTitle'),
        subtitle: t('destinySubtitle'),
        extraKeys: ['destinyExtra1', 'destinyExtra2', 'destinyExtra3']
      };
    }
    return null;
  };

  // Function to get the correct page URL based on reading type
  const getReadingPageUrl = (readingType: string): string => {
    const readingTypeLower = readingType.toLowerCase();
    
    if (readingTypeLower.includes('love')) {
      return '/love';
    } else if (readingTypeLower.includes('career')) {
      return '/career';
    } else if (readingTypeLower.includes('destiny')) {
      return '/destiny';
    }
    return '/';
  };

  const readingInfo = getReadingTypeInfo();

  return (
    <>
      <div className="homeBg" aria-hidden="true" />
      {isSingleCardReading && readingInfo ? (
        // Single card layout with descriptive text
        <div className="singlePage">
          <div className="singleRow">
            <div className="singleColLeft">
              <div className="deck" style={{ height: "100%", paddingLeft: "0", marginLeft: "0", justifyContent: "flex-start" }}>
                {cards.map((card, idx) => {
                  // Safety check for individual card
                  if (!card || !card.id || !card.name) {
                    return (
                      <div key={idx} className="card error">
                        <div className="cardInner">
                          <div className="cardFace cardFront">
                            <div className="cardTitleFixed">Invalid Card</div>
                            <div className="cardContent">
                              <div className="cardBody">Card data is missing or corrupted.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const meaning = getTranslatedCardDescription(card.id, card.position);

                  const frontImageClass = card.id 
                    ? `cardFront-${card.id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
                    : "";
                  const suitClass = card.id
                    ? (() => {
                        const suit = card.id.split("_")[0];
                        return `suit-${suit}`;
                      })()
                    : "";

                  return (
                    <div
                      key={idx}
                      className={`card revealed ${card.position === "reversed" ? "reversed" : ""}`}
                      ref={(el) => { cardRefs.current[idx] = el; }}
                      onClick={(e) => handleCardClick(e, idx)}
                      onKeyDown={(e) => handleCardKeyDown(e, idx)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${card.name}`}
                      style={{ left: "0", marginLeft: "0", position: "relative" }}
                    >
                      <div className="cardInner">
                        {/* FRONT - always revealed for shared deck */}
                        <div className={`cardFace cardFront ${frontImageClass} ${suitClass} ${card.position === "reversed" ? "reversed" : ""}`}>
                          <div className="cardTitleFixed">
                            {getTranslatedCardName(card.id)}
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
                <Link href={getReadingPageUrl(readingType)} className="primary">
                  {t('seeTheFortune')}
                </Link>
                <button
                  className="secondary shareButton"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Share button clicked, setting showShareModal to true');
                    console.log('Cards:', cards);
                    console.log('Reading type:', readingType);
                    console.log('Date:', date);
                    setShowShareModal(true);
                  }}
                >
                  {t("shareReading")}
                </button>
              </div>
            </div>
            <div className="singleColRight">
              <h1>{readingInfo.title}</h1>
              <p>{readingInfo.subtitle}</p>
              <div className="singleExtra">
                {readingInfo.extraKeys.map((key) => (
                  <p key={key}>{t(key)}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Multi-card layout without descriptive text
        <>
          <h1>{t('sharedTarotReading')}</h1>
          <p>{(() => {
            // Try to parse the date string and reformat it in the current language
            try {
              // First try to parse as a regular date string
              let dateObj = new Date(date);
              
              // If that fails, try to parse common date formats
              if (isNaN(dateObj.getTime())) {
                // Try parsing Ukrainian date format (e.g., "10 вересня 2025 р.")
                const ukrainianMonths: Record<string, number> = {
                  'січня': 0, 'лютого': 1, 'березня': 2, 'квітня': 3, 'травня': 4, 'червня': 5,
                  'липня': 6, 'серпня': 7, 'вересня': 8, 'жовтня': 9, 'листопада': 10, 'грудня': 11
                };
                
                const englishMonths: Record<string, number> = {
                  'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
                  'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
                };
                
                // Try to extract date parts from the string
                const match = date.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
                if (match) {
                  const day = parseInt(match[1]);
                  const monthName = match[2].toLowerCase();
                  const year = parseInt(match[3]);
                  
                  const month = ukrainianMonths[monthName] ?? englishMonths[monthName];
                  if (month !== undefined) {
                    dateObj = new Date(year, month, day);
                  }
                }
              }
              
              // If we still can't parse it, return the original string
              if (isNaN(dateObj.getTime())) {
                return date;
              }
              
              // Format according to current language
              const locale = lang === 'uk' ? 'uk-UA' : 'en-US';
              return dateObj.toLocaleDateString(locale, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
            } catch (error) {
              console.error('Date formatting error:', error);
              // Fallback to original date string
              return date;
            }
          })()}</p>
          
          <div className="deck">
            {cards.map((card, idx) => {
              // Safety check for individual card
              if (!card || !card.id || !card.name) {
                return (
                  <div key={idx} className="card error">
                    <div className="cardInner">
                      <div className="cardFace cardFront">
                        <div className="cardTitleFixed">Invalid Card</div>
                        <div className="cardContent">
                          <div className="cardBody">Card data is missing or corrupted.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const meaning = getTranslatedCardDescription(card.id, card.position);

              const frontImageClass = card.id 
                ? `cardFront-${card.id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`
                : "";
              const suitClass = card.id
                ? (() => {
                    const suit = card.id.split("_")[0];
                    return `suit-${suit}`;
                  })()
                : "";

              return (
                <div
                  key={idx}
                  className={`card revealed ${card.position === "reversed" ? "reversed" : ""}`}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  onClick={(e) => handleCardClick(e, idx)}
                  onKeyDown={(e) => handleCardKeyDown(e, idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${card.name}`}
                >
                  <div className="cardInner">
                    {/* FRONT - always revealed for shared deck */}
                    <div className={`cardFace cardFront ${frontImageClass} ${suitClass} ${card.position === "reversed" ? "reversed" : ""}`}>
                      <div className="cardTitleFixed">
                        {getTranslatedCardName(card.id)}
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
            <Link href={getReadingPageUrl(readingType)} className="primary">
              {t('seeTheFortune')}
            </Link>
            <button
              className="secondary shareButton"
              onClick={() => {
                console.log('Share button clicked, setting showShareModal to true');
                setShowShareModal(true);
              }}
            >
              {t("shareReading")}
            </button>
          </div>
        </>
      )}

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
              ? getTranslatedCardDescription(modalCard.id, modalCard.position)
              : "";
            return (
              <div
                className={`mobileModalCard cardFront ${frontImageClass} ${suitClass} ${modalCard?.position === "reversed" ? "reversed" : ""}`}
                onClick={closeModal}
              >
                <div className="cardContent">
                  <div className="cardTitle">{modalCard ? getTranslatedCardName(modalCard.id) : t("card")}</div>
                  <div className="cardBody">{meaning}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && cards && (() => {
        console.log('Rendering ShareModal, showShareModal:', showShareModal);
        const shareData = generateShareData();
        console.log('Generated share data:', shareData);
        if (!shareData) {
          // If share data generation fails, close modal and show error
          console.error('Failed to generate share data');
          setShowShareModal(false);
          alert('Failed to generate share data. Please try again.');
          return null;
        }
        return (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => {
              console.log('Closing ShareModal');
              setShowShareModal(false);
            }}
            shareData={shareData}
          />
        );
      })()}
    </>
  );
} 

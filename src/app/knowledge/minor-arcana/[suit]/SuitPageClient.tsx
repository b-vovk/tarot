"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { trackUserJourney } from "@/lib/analytics";
import SEO from "@/components/SEO";
import classicData from "@/data/decks/classic.json";
import classicUkData from "@/data/decks/classic.uk.json";

interface SuitPageClientProps {
  suit: string;
}

export default function SuitPageClient({ suit }: SuitPageClientProps) {
  const { lang, t } = useI18n();
  const data = lang === 'uk' ? classicUkData : classicData;
  
  const suitInfo = {
    cups: {
      name: t('cups'),
      icon: (
        <svg width="36" height="36" viewBox="0 0 20 20" fill="none" stroke="#dabb67" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(10,10) scale(0.2)">
            <path d="M-40,-44 h80 c0,24 -22,44 -40,44 c-18,0 -40,-20 -40,-44z"/>
            <path d="M0,0 v30"/>
            <path d="M-18,44 h36"/>
            <path d="M-24,-44 c-6,20 -6,32 0,48"/>
            <path d="M24,-44 c6,20 6,32 0,48"/>
            <path d="M0,-44 c0,18 -2,34 -8,48"/>
          </g>
        </svg>
      ),
      element: 'Water',
      description: t('cupsDescription'),
      color: 'cups'
    },
    wands: {
      name: t('wands'),
      icon: (
        <svg width="36" height="36" viewBox="0 0 20 20" fill="none" stroke="#dabb67" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(10,10) scale(0.2)">
            <circle cx="0" cy="-120" r="8"/>
            <path d="M0,-140 v12 M0,-108 v12 M-12,-120 h-12 M12,-120 h12 M-9,-132 l-8,-8 M9,-132 l8,-8 M-9,-108 l-8,8 M9,-108 l8,8"/>
            <path d="M0,-90 v180"/>
            <path d="M0,-40 c-14,-8 -20,-18 -20,-30"/>
            <path d="M0,-10 c14,-8 20,-18 20,-30"/>
          </g>
        </svg>
      ),
      element: 'Fire',
      description: t('wandsDescription'),
      color: 'wands'
    },
    swords: {
      name: t('swords'),
      icon: (
        <svg width="36" height="36" viewBox="0 0 20 20" fill="none" stroke="#dabb67" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(10,10) scale(0.2)">
            <path d="M-22,-120 h44 l-6,12 -8,-8 -8,8 -8,-8 -8,8 z"/>
            <path d="M-44,-96 c12,-16 24,-24 44,-26"/>
            <path d="M44,-96 c-12,-16 -24,-24 -44,-26"/>
            <path d="M0,-110 v160"/>
            <path d="M-14,24 h28"/>
            <path d="M0,-130 v20"/>
          </g>
        </svg>
      ),
      element: 'Air',
      description: t('swordsDescription'),
      color: 'swords'
    },
    pentacles: {
      name: t('pentacles'),
      icon: (
        <svg width="36" height="36" viewBox="0 0 20 20" fill="none" stroke="#dabb67" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(10,10) scale(0.2)">
            <path d="M-80,20 C-80,-60, 80,-60, 80,20"/>
            <circle cx="0" cy="-20" r="28"/>
            <path d="M0,-42 L6,-16 L-16,-30 L16,-30 L-6,-16 Z"/>
            <path d="M-120,110 c40,-10 60,-10 100,0 c40,10 60,10 100,0"/>
          </g>
        </svg>
      ),
      element: 'Earth',
      description: t('pentaclesDescription'),
      color: 'pentacles'
    }
  };

  useEffect(() => {
    trackUserJourney(`${suit}_suit_page_visit`);
    
    // Add knowledge-page class to body for scrolling
    document.body.classList.add('knowledge-page');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('knowledge-page');
    };
  }, [suit]);

  const currentSuit = suitInfo[suit as keyof typeof suitInfo];
  if (!currentSuit) {
    return <div>Invalid suit</div>;
  }

  const suitCards = data.filter(card => 
    card.id.startsWith(`${suit}_`)
  );

  // Sort cards: Ace, 2-10, Page, Knight, Queen, King
  const sortedCards = suitCards.sort((a, b) => {
    const getCardOrder = (cardId: string) => {
      if (cardId.includes('ace')) return 0;
      if (cardId.includes('two')) return 1;
      if (cardId.includes('three')) return 2;
      if (cardId.includes('four')) return 3;
      if (cardId.includes('five')) return 4;
      if (cardId.includes('six')) return 5;
      if (cardId.includes('seven')) return 6;
      if (cardId.includes('eight')) return 7;
      if (cardId.includes('nine')) return 8;
      if (cardId.includes('ten')) return 9;
      if (cardId.includes('page')) return 10;
      if (cardId.includes('knight')) return 11;
      if (cardId.includes('queen')) return 12;
      if (cardId.includes('king')) return 13;
      return 14;
    };
    return getCardOrder(a.id) - getCardOrder(b.id);
  });

  return (
    <>
      <SEO 
        title={`${currentSuit.name} Suit – Tarot Cards of ${currentSuit.element}`}
        description={`Explore all ${currentSuit.name} tarot cards. Learn about emotions, relationships, and matters of the heart through the ${currentSuit.element} element.`}
        tags={[`${suit} tarot`, `${currentSuit.name} suit`, 'tarot cards', 'tarot meanings', currentSuit.element.toLowerCase()]}
      />
      
      <div className="homeBg" aria-hidden="true" />
      <div className="knowledgePage">
        <div className="knowledgeHeader">
          <Link href="/knowledge/minor-arcana" className="backLink">← {t('backToKnowledge')}</Link>
          <h1>{currentSuit.name} {t('minor')}</h1>
          <p>{currentSuit.description}</p>
        </div>

        <div className="cardsGrid">
          {sortedCards.map((card) => (
            <Link 
              key={card.id} 
              href={`/knowledge/card/${card.id}`}
              className="cardKnowledgeItem"
            >
              <div className="cardKnowledgeImage">
                <div className={`cardFront cardFront-${card.id.replace(/_/g, '-')}`}>
                  <div className="cardTitleFixed">
                    {card.name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

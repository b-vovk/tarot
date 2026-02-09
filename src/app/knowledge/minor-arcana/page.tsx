"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackUserJourney } from "@/lib/analytics";
import SEO from "@/components/SEO";
import { useI18n } from "@/lib/i18n";

export default function MinorArcanaPage() {
  const { t } = useI18n();
  
  useEffect(() => {
    trackUserJourney('minor_arcana_page_visit');
    
    // Add knowledge-page class to body for scrolling
    document.body.classList.add('knowledge-page');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('knowledge-page');
    };
  }, []);

  const suits = [
    {
      id: 'cups',
      name: t('cups'),
      icon: (
        <svg viewBox="0 0 20 20" width="60" height="60">
          <g transform="translate(10,10) scale(0.125)" fill="none" stroke="#dabb67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-40,-44 h80 c0,24 -22,44 -40,44 c-18,0 -40,-20 -40,-44z"/>
            <path d="M0,0 v30"/>
            <path d="M-18,44 h36"/>
            <path d="M-24,-44 c-6,20 -6,32 0,48"/>
            <path d="M24,-44 c6,20 6,32 0,48"/>
            <path d="M0,-44 c0,18 -2,34 -8,48"/>
          </g>
        </svg>
      ),
      description: t('cupsDescription'),
      color: 'cups',
      count: t('cardsCount')
    },
    {
      id: 'wands',
      name: t('wands'),
      icon: (
        <svg viewBox="0 0 20 20" width="60" height="60">
          <g transform="translate(10,10) scale(0.125)" fill="#dabb67" stroke="#dabb67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="0" cy="-120" r="8"/>
            <path d="M0,-140 v12 M0,-108 v12 M-12,-120 h-12 M12,-120 h12 M-9,-132 l-8,-8 M9,-132 l8,-8 M-9,-108 l-8,8 M9,-108 l8,8"/>
            <path d="M0,-90 v180"/>
            <path d="M0,-40 c-14,-8 -20,-18 -20,-30"/>
            <path d="M0,-10 c14,-8 20,-18 20,-30"/>
          </g>
        </svg>
      ),
      description: t('wandsDescription'),
      color: 'wands',
      count: t('cardsCount')
    },
    {
      id: 'swords',
      name: t('swords'),
      icon: (
        <svg viewBox="0 0 20 20" width="60" height="60">
          <g transform="translate(10,10) scale(0.125)" fill="#dabb67" stroke="#dabb67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-22,-120 h44 l-6,12 -8,-8 -8,8 -8,-8 -8,8 z"/>
            <path d="M-44,-96 c12,-16 24,-24 44,-26"/>
            <path d="M44,-96 c-12,-16 -24,-24 -44,-26"/>
            <path d="M0,-110 v160"/>
            <path d="M-14,24 h28"/>
            <path d="M0,-130 v20"/>
          </g>
        </svg>
      ),
      description: t('swordsDescription'),
      color: 'swords',
      count: t('cardsCount')
    },
    {
      id: 'pentacles',
      name: t('pentacles'),
      icon: (
        <svg viewBox="0 0 20 20" width="60" height="60">
          <g transform="translate(10,10) scale(0.125)" fill="none" stroke="#dabb67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-80,20 C-80,-60, 80,-60, 80,20"/>
            <circle cx="0" cy="-20" r="28"/>
            <path d="M0,-42 L6,-16 L-16,-30 L16,-30 L-6,-16 Z"/>
            <path d="M-120,110 c40,-10 60,-10 100,0 c40,10 60,10 100,0"/>
          </g>
        </svg>
      ),
      description: t('pentaclesDescription'),
      color: 'pentacles',
      count: t('cardsCount')
    }
  ];

  return (
    <>
      <SEO 
        title="Minor Arcana – The 56 Cards of Daily Life"
        description="Explore the four suits of Minor Arcana: Cups, Wands, Swords, and Pentacles. Learn about the 56 cards that represent daily life experiences and practical matters."
        tags={['minor arcana', 'tarot suits', 'cups tarot', 'wands tarot', 'swords tarot', 'pentacles tarot', 'tarot minor cards']}
      />
      
      <div className="homeBg" aria-hidden="true" />
      <div className="knowledgePage">
        <div className="knowledgeHeader">
          <Link href="/knowledge" className="backLink">{t('backToKnowledge')}</Link>
          <h1>{t('minorArcanaTitle')}</h1>
          <p>{t('minorArcanaDescription')}</p>
        </div>

        <div className="suitsGrid">
          {suits.map((suit) => (
            <Link 
              key={suit.id} 
              href={`/knowledge/minor-arcana/${suit.id}`}
              className={`suitCard ${suit.color}`}
            >
              <div className="suitIcon">
                <span className="suitSymbol">{suit.icon}</span>
              </div>
              <div className="suitContent">
                <h2>{suit.name}</h2>
                <p>{suit.description}</p>
                <div className="suitMeta">
                  <span className="suitCount">{suit.count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="minorArcanaInfo">
          <h3>{t('understandingMinorArcana')}</h3>
          <div className="infoGrid">
            <div className="infoCard">
              <h4>{t('numberCards')}</h4>
              <p>{t('numberCardsDescription')}</p>
            </div>
            <div className="infoCard">
              <h4>{t('courtCards')}</h4>
              <p>{t('courtCardsDescription')}</p>
            </div>
            <div className="infoCard">
              <h4>{t('elementalAssociations')}</h4>
              <p>{t('elementalAssociationsDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

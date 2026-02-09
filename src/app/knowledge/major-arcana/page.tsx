"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { trackUserJourney } from "@/lib/analytics";
import SEO from "@/components/SEO";
import classicData from "@/data/decks/classic.json";
import classicUkData from "@/data/decks/classic.uk.json";

export default function MajorArcanaPage() {
  const { lang, t } = useI18n();
  const data = lang === 'uk' ? classicUkData : classicData;
  const majorArcana = data.filter(card => card.id.startsWith('major_'));
  
  useEffect(() => {
    trackUserJourney('major_arcana_page_visit');
    
    // Add knowledge-page class to body for scrolling
    document.body.classList.add('knowledge-page');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('knowledge-page');
    };
  }, []);

  return (
    <>
      <SEO 
        title="Major Arcana – The 22 Cards of Life's Journey"
        description="Explore all 22 Major Arcana cards with detailed meanings, interpretations, and symbolism. Learn about The Fool, The Magician, The High Priestess, and more."
        tags={['major arcana', 'tarot major arcana', 'fool tarot', 'magician tarot', 'high priestess tarot', 'tarot journey']}
      />
      
      <div className="homeBg" aria-hidden="true" />
      <div className="knowledgePage">
        <div className="knowledgeHeader">
          <Link href="/knowledge" className="backLink">{t('backToKnowledge')}</Link>
          <h1>{t('majorArcanaTitle')}</h1>
          <p>{t('majorArcanaDescription')}</p>
        </div>

        <div className="cardsGrid">
          {majorArcana.map((card) => (
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

        <div className="majorArcanaInfo">
          <h2>{t('majorArcanaInfoTitle')}</h2>
          <p>{t('majorArcanaInfoParagraph1')}</p>
          <p>{t('majorArcanaInfoParagraph2')}</p>
          <p>{t('majorArcanaInfoParagraph3')}</p>
          <p>{t('majorArcanaInfoParagraph4')}</p>
        </div>
      </div>
    </>
  );
}

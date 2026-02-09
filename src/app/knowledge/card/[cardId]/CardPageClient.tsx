"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { trackUserJourney } from "@/lib/analytics";
import SEO from "@/components/SEO";
import classicData from "@/data/decks/classic.json";
import classicUkData from "@/data/decks/classic.uk.json";

interface CardPageClientProps {
  cardId: string;
}

export default function CardPageClient({ cardId }: CardPageClientProps) {
  const { lang } = useI18n();
  const data = lang === 'uk' ? classicUkData : classicData;
  const [isReversed, setIsReversed] = useState(false);
  
  useEffect(() => {
    trackUserJourney(`card_page_visit_${cardId}`);
    
    // Add knowledge-page class to body for scrolling
    document.body.classList.add('knowledge-page');
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('knowledge-page');
    };
  }, [cardId]);
  
  const card = data.find(c => c.id === cardId);
  
  if (!card) {
    return <div>Card not found</div>;
  }

  const isMajorArcana = card.id.startsWith('major_');
  const suit = card.id.includes('_of_') ? card.id.split('_of_')[1] : null;

  const getBackLink = () => {
    if (isMajorArcana) {
      return '/knowledge/major-arcana';
    } else if (suit) {
      return `/knowledge/minor-arcana/${suit}`;
    }
    return '/knowledge';
  };

  const getCardType = () => {
    if (isMajorArcana) return 'Major Arcana';
    if (suit) return `${suit.charAt(0).toUpperCase() + suit.slice(1)} Suit`;
    return 'Tarot Card';
  };

  return (
    <>
      <SEO 
        title={`${card.name} – Tarot Card Meaning & Interpretation`}
        description={`Learn about the ${card.name} tarot card meaning, upright and reversed interpretations, and symbolism. ${getCardType()} card guide.`}
        tags={[card.name.toLowerCase(), 'tarot card', 'tarot meaning', getCardType().toLowerCase(), 'tarot interpretation']}
      />
      
      <div className="homeBg" aria-hidden="true" />
      <div className="knowledgePage">
        <div className="knowledgeHeader">
          <Link href={getBackLink()} className="backLink">← Back to {isMajorArcana ? 'Major Arcana' : suit ? `${suit.charAt(0).toUpperCase() + suit.slice(1)} Suit` : 'Knowledge'}</Link>
          <div className="cardHeader">
            <div className="cardHeaderImage">
              <div 
                className={`cardFront cardFront-${card.id.replace(/_/g, '-')} ${isReversed ? 'reversed' : ''}`}
                onClick={() => setIsReversed(!isReversed)}
              >
                <div className="cardTitleFixed">
                  {card.name}
                </div>
              </div>
            </div>
            <div className="cardHeaderContent">
              <h1>{card.name}</h1>
              <div className="cardType">{getCardType()}</div>
              <button 
                className="flipButton"
                onClick={() => setIsReversed(!isReversed)}
              >
                {isReversed ? 'Show Upright' : 'Show Reversed'}
              </button>
            </div>
          </div>
        </div>

        <div className="cardContent">
          <div className="cardKeywords">
            <div className="keywordSection">
              <h3>Upright Keywords</h3>
              <p className="keywordText">{card.upright}</p>
            </div>
            <div className="keywordSection">
              <h3>Reversed Keywords</h3>
              <p className="keywordText">{card.reversed}</p>
            </div>
          </div>

          <div className="cardDescription">
            <h3>Meaning</h3>
            <div className="descriptionContent">
              <div className={`descriptionText ${isReversed ? 'reversed' : 'upright'}`}>
                <h4>{isReversed ? 'Reversed' : 'Upright'}</h4>
                <p>{isReversed ? card.description.reversed : card.description.upright}</p>
              </div>
            </div>
          </div>

          <div className="cardSymbolism">
            <h3>Symbolism & Interpretation</h3>
            <div className="symbolismContent">
              <p>
                The {card.name} represents a significant aspect of the human experience. 
                {isMajorArcana ? ' As part of the Major Arcana, this card speaks to life\'s most profound lessons and spiritual journey.' : ` As part of the ${suit} suit, this card relates to ${suit === 'cups' ? 'emotions and relationships' : suit === 'wands' ? 'passion and creativity' : suit === 'swords' ? 'thoughts and communication' : 'material world and work'}.`}
              </p>
              <p>
                When {isReversed ? 'reversed' : 'upright'}, this card {isReversed ? 'suggests challenges or alternative perspectives' : 'indicates positive energy and growth'} in your current situation.
              </p>
            </div>
          </div>

          <div className="cardActions">
            <Link href="/" className="actionButton primary">
              Get Your Reading
            </Link>
            <Link href="/knowledge" className="actionButton secondary">
              Explore More Cards
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

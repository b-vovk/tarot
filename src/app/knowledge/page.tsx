"use client";

import { useEffect } from "react";
import Link from "next/link";
import { trackUserJourney } from "@/lib/analytics";
import SEO from "@/components/SEO";
import { useI18n } from "@/lib/i18n";

export default function KnowledgePage() {
  const { t } = useI18n();
  
  useEffect(() => {
    trackUserJourney('knowledge_page_visit');
    
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
        title="Tarot Knowledge – Learn About Tarot Cards & Meanings"
        description="Explore comprehensive tarot card meanings, interpretations, and symbolism. Learn about Major Arcana, Minor Arcana, and all 78 tarot cards with detailed explanations."
        tags={['tarot knowledge', 'tarot meanings', 'tarot cards', 'major arcana', 'minor arcana', 'tarot learning', 'tarot guide']}
      />
      
      <div className="homeBg" aria-hidden="true" />
      <div className="knowledgePage">
        <div className="knowledgeHeader">
          <h1>{t('knowledgeTitle')}</h1>
          <p>{t('knowledgeSubtitle')}</p>
        </div>

        <div className="knowledgeGrid">
          <Link href="/knowledge/major-arcana" className="knowledgeCard majorArcana">
            <div className="knowledgeCardIcon">
              <svg viewBox="0 0 128 128" width="60" height="60">
                <g fill="#dabb67" stroke="#dabb67" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="64" cy="64" r="62" fill="none" opacity="0.55"/>
                  <path d="M64,0 L70,54 L64,64 L58,54 Z"/>
                  <path d="M128,64 L74,70 L64,64 L74,58 Z"/>
                  <path d="M64,128 L58,74 L64,64 L70,74 Z"/>
                  <path d="M0,64 L54,58 L64,64 L54,70 Z"/>
                  <g opacity="0.8">
                    <line x1="64" y1="28" x2="64" y2="46"/>
                    <line x1="64" y1="100" x2="64" y2="118"/>
                    <line x1="28" y1="64" x2="46" y2="64"/>
                    <line x1="100" y1="64" x2="118" y2="64"/>
                    <line x1="93" y1="31" x2="76" y2="48"/>
                    <line x1="93" y1="97" x2="76" y2="80"/>
                    <line x1="35" y1="97" x2="52" y2="80"/>
                    <line x1="35" y1="31" x2="52" y2="48"/>
                  </g>
                  <circle cx="64" cy="64" r="5"/>
                </g>
              </svg>
            </div>
            <h2>{t('majorArcanaTitle')}</h2>
            <p>{t('majorArcanaDescription')}</p>
          </Link>

          <Link href="/knowledge/minor-arcana" className="knowledgeCard minorArcana">
            <div className="knowledgeCardIcon">
              <svg viewBox="0 0 128 128" width="60" height="60">
                <g fill="#dabb67" stroke="#dabb67" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="20" y="20" width="88" height="88" rx="12" fill="none"/>
                  <circle cx="40" cy="40" r="8"/>
                  <circle cx="88" cy="40" r="8"/>
                  <circle cx="40" cy="88" r="8"/>
                  <circle cx="88" cy="88" r="8"/>
                  <path d="M64,20 L68,32 L64,40 L60,32 Z"/>
                  <path d="M108,64 L96,68 L88,64 L96,60 Z"/>
                  <path d="M64,108 L60,96 L64,88 L68,96 Z"/>
                  <path d="M20,64 L32,60 L40,64 L32,68 Z"/>
                </g>
              </svg>
            </div>
            <h2>{t('minorArcanaTitle')}</h2>
            <p>{t('minorArcanaDescription')}</p>
          </Link>
        </div>

        <div className="knowledgeQuickAccess">
          <h3>{t('quickAccessTitle')}</h3>
          <div className="quickAccessGrid">
            <Link href="/knowledge/major-arcana" className="quickAccessItem">
              <span className="quickAccessIcon">
                <svg viewBox="0 0 128 128" width="60" height="60">
                  <g fill="#dabb67" stroke="#dabb67" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="64" cy="64" r="62" fill="none" opacity="0.55"/>
                    <path d="M64,0 L70,54 L64,64 L58,54 Z"/>
                    <path d="M128,64 L74,70 L64,64 L74,58 Z"/>
                    <path d="M64,128 L58,74 L64,64 L70,74 Z"/>
                    <path d="M0,64 L54,58 L64,64 L54,70 Z"/>
                    <g opacity="0.8">
                      <line x1="64" y1="28" x2="64" y2="46"/>
                      <line x1="64" y1="100" x2="64" y2="118"/>
                      <line x1="28" y1="64" x2="46" y2="64"/>
                      <line x1="100" y1="64" x2="118" y2="64"/>
                      <line x1="93" y1="31" x2="76" y2="48"/>
                      <line x1="93" y1="97" x2="76" y2="80"/>
                      <line x1="35" y1="97" x2="52" y2="80"/>
                      <line x1="35" y1="31" x2="52" y2="48"/>
                    </g>
                    <circle cx="64" cy="64" r="5"/>
                  </g>
                </svg>
              </span>
              <span>{t('major')}</span>
            </Link>
            <Link href="/knowledge/minor-arcana" className="quickAccessItem">
              <span className="quickAccessIcon">
                <svg viewBox="0 0 128 128" width="60" height="60">
                  <g fill="#dabb67" stroke="#dabb67" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="20" y="20" width="88" height="88" rx="12" fill="none"/>
                    <circle cx="40" cy="40" r="8"/>
                    <circle cx="88" cy="40" r="8"/>
                    <circle cx="40" cy="88" r="8"/>
                    <circle cx="88" cy="88" r="8"/>
                    <path d="M64,20 L68,32 L64,40 L60,32 Z"/>
                    <path d="M108,64 L96,68 L88,64 L96,60 Z"/>
                    <path d="M64,108 L60,96 L64,88 L68,96 Z"/>
                    <path d="M20,64 L32,60 L40,64 L32,68 Z"/>
                  </g>
                </svg>
              </span>
              <span>{t('minor')}</span>
            </Link>
            <Link href="/knowledge/minor-arcana/cups" className="quickAccessItem">
              <span className="quickAccessIcon">
                <svg viewBox="0 0 20 20" width="60" height="60">
                  <g transform="translate(10,10) scale(0.125)" fill="#dabb67" stroke="#dabb67" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M-40,-44 h80 c0,24 -22,44 -40,44 c-18,0 -40,-20 -40,-44z"/>
                    <path d="M0,0 v30"/>
                    <path d="M-18,44 h36"/>
                    <path d="M-24,-44 c-6,20 -6,32 0,48"/>
                    <path d="M24,-44 c6,20 6,32 0,48"/>
                    <path d="M0,-44 c0,18 -2,34 -8,48"/>
                  </g>
                </svg>
              </span>
              <span>{t('cups')}</span>
            </Link>
            <Link href="/knowledge/minor-arcana/wands" className="quickAccessItem">
              <span className="quickAccessIcon">
                <svg viewBox="0 0 20 20" width="60" height="60">
                  <g transform="translate(10,10) scale(0.125)" fill="#dabb67" stroke="#dabb67" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="0" cy="-120" r="8"/>
                    <path d="M0,-140 v12 M0,-108 v12 M-12,-120 h-12 M12,-120 h12 M-9,-132 l-8,-8 M9,-132 l8,-8 M-9,-108 l-8,8 M9,-108 l8,8"/>
                    <path d="M0,-90 v180"/>
                    <path d="M0,-40 c-14,-8 -20,-18 -20,-30"/>
                    <path d="M0,-10 c14,-8 20,-18 20,-30"/>
                  </g>
                </svg>
              </span>
              <span>{t('wands')}</span>
            </Link>
            <Link href="/knowledge/minor-arcana/swords" className="quickAccessItem">
              <span className="quickAccessIcon">
                <svg viewBox="0 0 20 20" width="60" height="60">
                  <g transform="translate(10,10) scale(0.125)" fill="#dabb67" stroke="#dabb67" strokeWidth="5.0" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M-22,-120 h44 l-6,12 -8,-8 -8,8 -8,-8 -8,8 z"/>
                    <path d="M-44,-96 c12,-16 24,-24 44,-26"/>
                    <path d="M44,-96 c-12,-16 -24,-24 -44,-26"/>
                    <path d="M0,-110 v160"/>
                    <path d="M-14,24 h28"/>
                    <path d="M0,-130 v20"/>
                  </g>
                </svg>
              </span>
              <span>{t('swords')}</span>
            </Link>
            <Link href="/knowledge/minor-arcana/pentacles" className="quickAccessItem">
              <span className="quickAccessIcon">
                <svg viewBox="0 0 20 20" width="60" height="60">
                  <g transform="translate(10,10) scale(0.125)" fill="none" stroke="#dabb67" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M-80,20 C-80,-60, 80,-60, 80,20"/>
                    <circle cx="0" cy="-20" r="28"/>
                    <path d="M0,-42 L6,-16 L-16,-30 L16,-30 L-6,-16 Z"/>
                    <path d="M-120,110 c40,-10 60,-10 100,0 c40,10 60,10 100,0"/>
                    <path d="M-120,110 L120,110"/>
                  </g>
                </svg>
              </span>
              <span>{t('pentacles')}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export type TarotCardData = {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'wands'|'cups'|'swords'|'pentacles';
  meaningUpright: string;
  meaningReversed: string;
};

import deck from './tarot-deck.json';

export const TAROT_DECK = deck as TarotCardData[];

export function drawThree(): { card: TarotCardData; reversed: boolean; position: 1|2|3 }[] {
  const d = [...TAROT_DECK];
  d.sort(() => Math.random() - 0.5);
  return d.slice(0,3).map((c, i) => ({ card:c, reversed: Math.random()>0.5, position:(i+1) as 1|2|3 }));
}

export function summarizeSpread(spread: ReturnType<typeof drawThree>, period:'day'|'period'='day'): string {
  const names = spread.map(s => s.card.name).join(', ');
  return `Ваш ${period==='day'?'щоденний':'періодичний'} розклад: ${names}. Зверніть увагу на баланс дій і інтуїції.`;
}

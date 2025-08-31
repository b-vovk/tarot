import baseDeck from "./classic.json";
import type { Lang } from "@/lib/i18n";

export type Card = {
  id: string;
  name: string;
  upright?: string;
  reversed?: string;
  description?: { upright?: string; reversed?: string };
};

type PartialCard = Partial<Card> & { id: string };

function mergeDecks(base: Card[], overrides: PartialCard[] | null): Card[] {
  if (!overrides || overrides.length === 0) return base;
  const idToOverride: Record<string, PartialCard> = Object.fromEntries(overrides.map((c) => [c.id, c]));
  return base.map((card) => {
    const ov = idToOverride[card.id];
    if (!ov) return card;
    return {
      ...card,
      ...ov,
      description: {
        upright: ov.description?.upright ?? card.description?.upright,
        reversed: ov.description?.reversed ?? card.description?.reversed,
      },
    };
  });
}

export async function loadClassicDeck(lang: Lang): Promise<Card[]> {
  if (lang === "uk") {
    try {
      const ukModule = await import("./classic.uk.json");
      const ukOverrides = (ukModule.default ?? []) as PartialCard[];
      return mergeDecks(baseDeck as Card[], ukOverrides);
    } catch {
      // Fallback to English deck if overrides missing
      return baseDeck as Card[];
    }
  }
  return baseDeck as Card[];
}



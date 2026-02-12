import type { MetadataRoute } from 'next';
import baseDeck from '@/data/decks/classic.json';

const BASE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tarotdaily.club';

const staticPaths = [
  { path: '/', priority: 1, changeFrequency: 'daily' as const },
  { path: '/love', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/career', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/destiny', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/knowledge', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/knowledge/major-arcana', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/knowledge/minor-arcana', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/knowledge/minor-arcana/cups', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/knowledge/minor-arcana/wands', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/knowledge/minor-arcana/swords', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/knowledge/minor-arcana/pentacles', priority: 0.7, changeFrequency: 'weekly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const deck = Array.isArray(baseDeck) ? baseDeck : [];
  const cardIds = deck
    .map((card) => (card && typeof card.id === 'string' ? card.id : null))
    .filter((id): id is string => typeof id === 'string' && id.length > 0);

  const staticUrls: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL.replace(/\/$/, '')}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const cardUrls: MetadataRoute.Sitemap = cardIds.map((id) => ({
    url: `${BASE_URL.replace(/\/$/, '')}/knowledge/card/${encodeURIComponent(id)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...cardUrls];
}

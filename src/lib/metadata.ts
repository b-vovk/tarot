import { Metadata } from 'next';

interface SharedReadingData {
  cards: Array<{
    id: string;
    name: string;
    position: 'upright' | 'reversed';
  }>;
  readingType: string;
  date: string;
}

export function generateSharedReadingMetadata(
  sharedData: SharedReadingData,
  shareUrl: string
): Metadata {
  const cardNames = sharedData.cards.map(card => card.name).join(', ');
  const title = `Tarot Reading: ${sharedData.readingType} - ${sharedData.date}`;
  const description = `Discover your ${sharedData.readingType.toLowerCase()} with ${cardNames}. Get insights into your daily fortune with this personalized tarot spread.`;
  
  const baseUrl = 'https://www.tarotdaily.club';
  const fullShareUrl = `${baseUrl}${shareUrl}`;
  const imageUrl = `${baseUrl}/images/mystic-star.svg`;

  return {
    title,
    description,
    keywords: [
      'tarot reading',
      'tarot cards',
      'fortune telling',
      'daily reading',
      sharedData.readingType.toLowerCase(),
      ...sharedData.cards.map(card => card.name.toLowerCase())
    ],
    authors: [{ name: 'Tarot Daily' }],
    creator: 'Tarot Daily',
    publisher: 'Tarot Daily',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: fullShareUrl,
      title,
      description,
      siteName: 'Tarot Daily',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Tarot Daily - Mystic Star',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      site: '@tarotdaily',
      creator: '@tarotdaily',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/logo.svg', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/logo.svg', sizes: '180x180', type: 'image/svg+xml' },
      ],
      shortcut: '/favicon.ico',
    },
    alternates: {
      canonical: fullShareUrl,
    },
  };
}

export function generateStructuredData(
  sharedData: SharedReadingData,
  shareUrl: string
) {
  const baseUrl = 'https://www.tarotdaily.club';
  const fullShareUrl = `${baseUrl}${shareUrl}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Tarot Reading: ${sharedData.readingType} - ${sharedData.date}`,
    description: `Discover your ${sharedData.readingType.toLowerCase()} with ${sharedData.cards.map(card => card.name).join(', ')}. Get insights into your daily fortune with this personalized tarot spread.`,
    url: fullShareUrl,
    image: `${baseUrl}/images/mystic-star.svg`,
    datePublished: sharedData.date,
    dateModified: sharedData.date,
    author: {
      '@type': 'Organization',
      name: 'Tarot Daily',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tarot Daily',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullShareUrl
    },
    about: {
      '@type': 'Service',
      name: 'Daily Tarot Reading',
      description: 'Professional tarot card readings for daily guidance',
      provider: {
        '@type': 'Organization',
        name: 'Tarot Daily'
      }
    },
    mentions: sharedData.cards.map(card => ({
      '@type': 'Thing',
      name: card.name,
      description: `Tarot card: ${card.name}`
    }))
  };
}

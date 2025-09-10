import { Metadata } from 'next';
import Link from 'next/link';
import SharedDeck from '@/components/SharedDeck';
import { loadClassicDeck, type Card } from '@/data/decks';
import type { Lang } from '@/lib/i18n';
import { generateSharedReadingMetadata, generateStructuredData } from '@/lib/metadata';

interface SharedReading {
  cards: Array<{
    id: string;
    name: string;
    position: 'upright' | 'reversed';
    upright: string;
    reversed: string;
    description?: {
      upright: string;
      reversed: string;
    };
  }>;
  readingType: string;
  date: string;
}

interface PageProps {
  params: Promise<{
    data: string;
  }>;
}

async function decodeSharedData(dataParam: string): Promise<{
  cards: Array<{ id: string; position: 'upright' | 'reversed' }>;
  readingType: string;
  date: string;
}> {
  // Validate the data parameter format
  if (!/^[A-Za-z0-9_-]+$/.test(dataParam)) {
    throw new Error('Invalid share data format: contains invalid characters');
  }

  // Decode the URL-safe base64 data
  const urlSafeData = dataParam
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding if needed
  const paddedData = urlSafeData + '='.repeat((4 - urlSafeData.length % 4) % 4);
  
  let decodedData: string;
  try {
    // Use Buffer in Node.js environment instead of atob
    if (typeof window === 'undefined') {
      decodedData = Buffer.from(paddedData, 'base64').toString('utf-8');
    } else {
      decodedData = atob(paddedData);
    }
  } catch {
    throw new Error('Failed to decode share data: invalid encoding');
  }
  
  // Check if it's the old format with encodeURIComponent (contains % encoded chars)
  if (decodedData.includes('%')) {
    // Old format: decode URI component first
    try {
      decodedData = decodeURIComponent(decodedData);
    } catch {
      throw new Error('Failed to decode URI component');
    }
  }
  
  // Check if it's the new compact format (contains |) or old JSON format
  if (decodedData.includes('|')) {
    // New compact format: readingType|date|cards
    const parts = decodedData.split('|');
    if (parts.length !== 3) {
      throw new Error('Invalid compact share data format');
    }
    
    const [readingType, date, cardData] = parts;
    
    // Create reverse card ID mapping
    const reverseCardIdMap: Record<string, string> = {
      'F': 'major_00_the_fool',
      'M': 'major_01_the_magician',
      'H': 'major_02_the_high_priestess',
      'E': 'major_03_the_empress',
      'P': 'major_04_the_emperor',
      'Y': 'major_05_the_hierophant',
      'L': 'major_06_the_lovers',
      'C': 'major_07_the_chariot',
      'S': 'major_08_strength',
      'R': 'major_09_the_hermit',
      'W': 'major_10_wheel_of_fortune',
      'J': 'major_11_justice',
      'N': 'major_12_the_hanged_man',
      'D': 'major_13_death',
      'T': 'major_14_temperance',
      'V': 'major_15_the_devil',
      'O': 'major_16_the_tower',
      'A': 'major_17_the_star',
      'B': 'major_18_the_moon',
      'U': 'major_19_the_sun',
      'G': 'major_20_judgement',
      'X': 'major_21_the_world',
      'AW': 'wands_01_ace_of_wands',
      '2W': 'wands_02_two_of_wands',
      '3W': 'wands_03_three_of_wands',
      '4W': 'wands_04_four_of_wands',
      '5W': 'wands_05_five_of_wands',
      '6W': 'wands_06_six_of_wands',
      '7W': 'wands_07_seven_of_wands',
      '8W': 'wands_08_eight_of_wands',
      '9W': 'wands_09_nine_of_wands',
      'TW': 'wands_10_ten_of_wands',
      'AC': 'cups_01_ace_of_cups',
      '2C': 'cups_02_two_of_cups',
      '3C': 'cups_03_three_of_cups',
      '4C': 'cups_04_four_of_cups',
      '5C': 'cups_05_five_of_cups',
      '6C': 'cups_06_six_of_cups',
      '7C': 'cups_07_seven_of_cups',
      '8C': 'cups_08_eight_of_cups',
      '9C': 'cups_09_nine_of_cups',
      'TC': 'cups_10_ten_of_cups',
      'AS': 'swords_01_ace_of_swords',
      '2S': 'swords_02_two_of_swords',
      '3S': 'swords_03_three_of_swords',
      '4S': 'swords_04_four_of_swords',
      '5S': 'swords_05_five_of_swords',
      '6S': 'swords_06_six_of_swords',
      '7S': 'swords_07_seven_of_swords',
      '8S': 'swords_08_eight_of_swords',
      '9S': 'swords_09_nine_of_swords',
      'TS': 'swords_10_ten_of_swords',
      'AP': 'pentacles_01_ace_of_pentacles',
      '2P': 'pentacles_02_two_of_pentacles',
      '3P': 'pentacles_03_three_of_pentacles',
      '4P': 'pentacles_04_four_of_pentacles',
      '5P': 'pentacles_05_five_of_pentacles',
      '6P': 'pentacles_06_six_of_pentacles',
      '7P': 'pentacles_07_seven_of_pentacles',
      '8P': 'pentacles_08_eight_of_pentacles',
      '9P': 'pentacles_09_nine_of_pentacles',
      'TP': 'pentacles_10_ten_of_pentacles'
    };
    
    // Parse card data (format: FUASR9CR where F=card, U=upright, etc.)
    const cards: Array<{ id: string; position: 'upright' | 'reversed' }> = [];
    let i = 0;
    while (i < cardData.length) {
      // Find the card ID (1-2 characters)
      let cardId = '';
      if (i + 1 < cardData.length && /[A-Z0-9]/.test(cardData[i + 1]) && cardData[i + 1] !== 'U' && cardData[i + 1] !== 'R') {
        // Two character ID (like AS, 2W, etc.)
        cardId = cardData.substring(i, i + 2);
        i += 2;
      } else {
        // Single character ID (like F, M, etc.)
        cardId = cardData[i];
        i += 1;
      }
      
      // Get position (U or R)
      const position = cardData[i] === 'U' ? 'upright' : 'reversed';
      i += 1;
      
      // Map back to full card ID
      const fullCardId = reverseCardIdMap[cardId] || cardId;
      cards.push({ id: fullCardId, position });
    }
    
    return { cards, readingType, date };
  } else {
    // Old JSON format (backward compatibility)
    let readingData: { cards: Array<{ id: string; position: 'upright' | 'reversed' }>; readingType: string; date: string };
    try {
      readingData = JSON.parse(decodedData);
    } catch {
      throw new Error('Failed to parse share data: invalid format');
    }

    // Validate the data structure
    if (!readingData.cards || !readingData.readingType || !readingData.date) {
      throw new Error('Invalid share data format');
    }

    return readingData;
  }
}

async function enrichSharedReading(
  readingData: { cards: Array<{ id: string; position: 'upright' | 'reversed' }>; readingType: string; date: string },
  lang: Lang = 'en'
): Promise<SharedReading> {
  // Load the full deck to get complete card information
  let fullDeck: Card[];
  try {
    fullDeck = await loadClassicDeck(lang);
    if (!fullDeck || !Array.isArray(fullDeck)) {
      throw new Error('Failed to load deck data');
    }
  } catch {
    throw new Error('Failed to load tarot deck');
  }
  
  // Map the shared cards to full card data
  const enrichedCards = readingData.cards.map((sharedCard: { id: string; position: 'upright' | 'reversed' }) => {
    if (!sharedCard || !sharedCard.id) {
      throw new Error('Invalid card data in shared reading');
    }
    
    const fullCard = fullDeck.find(card => card && card.id === sharedCard.id);
    if (!fullCard) {
      throw new Error(`Card not found: ${sharedCard.id}`);
    }
    
    // Ensure required properties exist with fallbacks
    const upright = fullCard.upright || 'Card meaning not available';
    const reversed = fullCard.reversed || 'Card meaning not available';
    
    // Handle description with proper typing and fallbacks
    const description = fullCard.description ? {
      upright: fullCard.description.upright || upright,
      reversed: fullCard.description.reversed || reversed,
    } : undefined;
    
    return {
      id: fullCard.id,
      name: fullCard.name || 'Unknown Card',
      position: sharedCard.position,
      upright,
      reversed,
      description,
    };
  });

  return {
    cards: enrichedCards,
    readingType: readingData.readingType,
    date: readingData.date,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const readingData = await decodeSharedData(resolvedParams.data);
    const shareUrl = `/share/${resolvedParams.data}`;
    
    // Detect language from the reading data
    const hasCyrillic = /[\u0400-\u04FF]/.test(readingData.readingType + readingData.date);
    const detectedLang = hasCyrillic ? 'uk' : 'en';
    
    // Enrich the data with card names for metadata
    const enrichedReading = await enrichSharedReading(readingData, detectedLang);
    
    return generateSharedReadingMetadata(enrichedReading, shareUrl);
  } catch {
    // Return default metadata if decoding fails
    return {
      title: 'Tarot Reading - Tarot Daily',
      description: 'Discover your personalized tarot reading',
    };
  }
}

export default async function SharePage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const readingData = await decodeSharedData(resolvedParams.data);
    
    // Detect language from the reading data
    // Check if the reading type or date contains Cyrillic characters
    const hasCyrillic = /[\u0400-\u04FF]/.test(readingData.readingType + readingData.date);
    const detectedLang = hasCyrillic ? 'uk' : 'en';
    
    const sharedReading = await enrichSharedReading(readingData, detectedLang);
    const shareUrl = `/share/${resolvedParams.data}`;
    
    // Generate structured data
    const structuredData = generateStructuredData(sharedReading, shareUrl);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <main className="container">
          <SharedDeck 
            cards={sharedReading.cards}
            readingType={sharedReading.readingType}
            date={sharedReading.date}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error('Error loading shared reading:', error);
    
    return (
      <div className="errorContainer">
        <h1>Reading Not Found</h1>
        <p>The tarot reading you&apos;re looking for could not be found or may have expired.</p>
        <Link href="/" className="backToHomeButton">
          Back to Home
        </Link>
      </div>
    );
  }
}

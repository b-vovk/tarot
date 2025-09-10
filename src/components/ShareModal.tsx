'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n';
import { trackUserEngagement } from '@/lib/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    cards: Array<{
      id: string;
      name: string;
      position: 'upright' | 'reversed';
    }>;
    readingType: string;
    date: string;
    shareUrl: string;
  };
}

export default function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const { t, lang } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to translate the date to current language
  const translateDate = (dateString: string): string => {
    try {
      // First try to parse as a regular date string
      let dateObj = new Date(dateString);
      
      // If that fails, try to parse common date formats
      if (isNaN(dateObj.getTime())) {
        // Try parsing Ukrainian date format (e.g., "10 вересня 2025 р.")
        const ukrainianMonths: Record<string, number> = {
          'січня': 0, 'лютого': 1, 'березня': 2, 'квітня': 3, 'травня': 4, 'червня': 5,
          'липня': 6, 'серпня': 7, 'вересня': 8, 'жовтня': 9, 'листопада': 10, 'грудня': 11
        };
        
        const englishMonths: Record<string, number> = {
          'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
          'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
        };
        
        // Try to extract date parts from the string
        const match = dateString.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
        if (match) {
          const day = parseInt(match[1]);
          const monthName = match[2].toLowerCase();
          const year = parseInt(match[3]);
          
          let month = ukrainianMonths[monthName] ?? englishMonths[monthName];
          if (month !== undefined) {
            dateObj = new Date(year, month, day);
          }
        }
      }
      
      // If we still can't parse it, return the original string
      if (isNaN(dateObj.getTime())) {
        return dateString;
      }
      
      // Format according to current language
      const locale = lang === 'uk' ? 'uk-UA' : 'en-US';
      return dateObj.toLocaleDateString(locale, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Date translation error:', error);
      return dateString;
    }
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            (typeof window !== 'undefined' && window.innerWidth <= 768);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to convert card ID to image filename
  function getCardImagePath(cardId: string): string {
    // Map card IDs to their corresponding image filenames
    const cardImageMap: Record<string, string> = {
      'major_00_the_fool': 'front-fool.svg',
      'major_01_the_magician': 'front-magician.svg',
      'major_02_the_high_priestess': 'front-high-priestess.svg',
      'major_03_the_empress': 'front-the-empress.svg',
      'major_04_the_emperor': 'front-the-emperor.svg',
      'major_05_the_hierophant': 'front-the-hierophant.svg',
      'major_06_the_lovers': 'front-the-lovers.svg',
      'major_07_the_chariot': 'front-the-chariot.svg',
      'major_08_strength': 'front-strength.svg',
      'major_09_the_hermit': 'front-the-hermit.svg',
      'major_10_wheel_of_fortune': 'front-wheel-of-fortune.svg',
      'major_11_justice': 'front-justice.svg',
      'major_12_the_hanged_man': 'front-the-hanged-man.svg',
      'major_13_death': 'front-death.svg',
      'major_14_temperance': 'front-temperance.svg',
      'major_15_the_devil': 'front-the-devil.svg',
      'major_16_the_tower': 'front-the-tower.svg',
      'major_17_the_star': 'front-the-star.svg',
      'major_18_the_moon': 'front-the-moon.svg',
      'major_19_the_sun': 'front-the-sun.svg',
      'major_20_judgement': 'front-judgement.svg',
      'major_21_the_world': 'front-the-world.svg',
      'wands_01_ace_of_wands': 'front-ace-of-wands.svg',
      'wands_02_two_of_wands': 'front-two-of-wands.svg',
      'wands_03_three_of_wands': 'front-three-of-wands.svg',
      'wands_04_four_of_wands': 'front-four-of-wands.svg',
      'wands_05_five_of_wands': 'front-five-of-wands.svg',
      'wands_06_six_of_wands': 'front-six-of-wands.svg',
      'wands_07_seven_of_wands': 'front-seven-of-wands.svg',
      'wands_08_eight_of_wands': 'front-eight-of-wands.svg',
      'wands_09_nine_of_wands': 'front-nine-of-wands.svg',
      'wands_10_ten_of_wands': 'front-ten-of-wands.svg',
      'cups_01_ace_of_cups': 'front-ace-of-cups.svg',
      'cups_02_two_of_cups': 'front-two-of-cups.svg',
      'cups_03_three_of_cups': 'front-three-of-cups.svg',
      'cups_04_four_of_cups': 'front-four-of-cups.svg',
      'cups_05_five_of_cups': 'front-five-of-cups.svg',
      'cups_06_six_of_cups': 'front-six-of-cups.svg',
      'cups_07_seven_of_cups': 'front-seven-of-cups.svg',
      'cups_08_eight_of_cups': 'front-eight-of-cups.svg',
      'cups_09_nine_of_cups': 'front-nine-of-cups.svg',
      'cups_10_ten_of_cups': 'front-ten-of-cups.svg',
      'swords_01_ace_of_swords': 'front-ace-of-swords.svg',
      'swords_02_two_of_swords': 'front-two-of-swords.svg',
      'swords_03_three_of_swords': 'front-three-of-swords.svg',
      'swords_04_four_of_swords': 'front-four-of-swords.svg',
      'swords_05_five_of_swords': 'front-five-of-swords.svg',
      'swords_06_six_of_swords': 'front-six-of-swords.svg',
      'swords_07_seven_of_swords': 'front-seven-of-swords.svg',
      'swords_08_eight_of_swords': 'front-eight-of-swords.svg',
      'swords_09_nine_of_swords': 'front-nine-of-swords.svg',
      'swords_10_ten_of_swords': 'front-ten-of-swords.svg',
      'pentacles_01_ace_of_pentacles': 'front-ace-of-pentacles.svg',
      'pentacles_02_two_of_pentacles': 'front-two-of-pentacles.svg',
      'pentacles_03_three_of_pentacles': 'front-three-of-pentacles.svg',
      'pentacles_04_four_of_pentacles': 'front-four-of-pentacles.svg',
      'pentacles_05_five_of_pentacles': 'front-five-of-pentacles.svg',
      'pentacles_06_six_of_pentacles': 'front-six-of-pentacles.svg',
      'pentacles_07_seven_of_pentacles': 'front-seven-of-pentacles.svg',
      'pentacles_08_eight_of_pentacles': 'front-eight-of-pentacles.svg',
      'pentacles_09_nine_of_pentacles': 'front-nine-of-pentacles.svg',
      'pentacles_10_ten_of_pentacles': 'front-ten-of-pentacles.svg',
    };

    return `/images/${cardImageMap[cardId] || 'front-fool.svg'}`;
  }

  // Function to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Function to generate shareable image
  const generateShareImage = async (): Promise<string> => {
    if (!canvasRef.current) return '';
    
    setIsGeneratingImage(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      // Set canvas size for high resolution
      const scale = 2; // 2x resolution for crisp images
      canvas.width = 800 * scale;
      canvas.height = 600 * scale;
      
      // Scale the context to match the canvas size
      ctx.scale(scale, scale);
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 800, 600);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Times New Roman", "Times", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      try {
        const title = t('sharedTarotReading');
        console.log('Drawing title:', title);
        ctx.fillText(title, 400, 30);
      } catch (error) {
        console.error('Error drawing title:', error);
        ctx.fillText('Tarot Reading', 400, 30);
      }

      // Date
      ctx.fillStyle = '#888888';
      ctx.font = '18px "Arial", "Helvetica", sans-serif';
      ctx.fillText(translateDate(shareData.date), 400, 70);

      // Cards
      const cardWidth = 180;
      const cardHeight = 270;
      const cardSpacing = 20;
      
      // Calculate positioning based on number of cards
      let startX: number;
      let cardX: number;
      if (shareData.cards.length === 1) {
        // Center single card
        startX = (800 - cardWidth) / 2;
        cardX = startX;
      } else {
        // Center multiple cards
        startX = (800 - (shareData.cards.length * cardWidth + (shareData.cards.length - 1) * cardSpacing)) / 2;
        cardX = startX;
      }
      
      const cardY = 120;

      // Load and draw card images
      for (let i = 0; i < shareData.cards.length; i++) {
        const card = shareData.cards[i];
        if (shareData.cards.length > 1) {
          cardX = startX + i * (cardWidth + cardSpacing);
        }

        try {
          // Load the card image
          const imagePath = getCardImagePath(card.id);
          const img = await loadImage(imagePath);
          
          // Draw card image (scaled to fit)
          const imageAspect = img.width / img.height;
          const cardAspect = cardWidth / cardHeight;
          
          let drawWidth = cardWidth;
          let drawHeight = cardHeight;
          let drawX = cardX;
          let drawY = cardY;
          
          if (imageAspect > cardAspect) {
            // Image is wider, fit by height
            drawWidth = cardHeight * imageAspect;
            drawX = cardX + (cardWidth - drawWidth) / 2;
          } else {
            // Image is taller, fit by width
            drawHeight = cardWidth / imageAspect;
            drawY = cardY + (cardHeight - drawHeight) / 2;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          // Draw card name overlay
          ctx.fillStyle = '#dabb67';
          ctx.font = 'bold 18px "Times New Roman", "Times", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          
          // Split long names into multiple lines
          try {
            const words = card.name.split(' ');
            const maxWordsPerLine = 3;
            const lines = [];
            for (let j = 0; j < words.length; j += maxWordsPerLine) {
              lines.push(words.slice(j, j + maxWordsPerLine).join(' '));
            }
            
            const lineHeight = 22;
            const startTextY = cardY + 20;
            
            lines.forEach((line, lineIndex) => {
              console.log('Drawing card name line:', line);
              ctx.fillText(line, cardX + cardWidth / 2, startTextY + lineIndex * lineHeight);
            });
          } catch (error) {
            console.error('Error drawing card name:', error, 'Card:', card);
            ctx.fillText(card.name || 'Card', cardX + cardWidth / 2, cardY + cardHeight / 2);
          }
        } catch (error) {
          console.error(`Error loading card image for ${card.id}:`, error);
          // Fallback: draw a placeholder
          ctx.fillStyle = '#2a2a3e';
          ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
          
          ctx.fillStyle = '#dabb67';
          ctx.font = 'bold 16px "Times New Roman", "Times", serif';
          ctx.textAlign = 'center';
          ctx.fillText(card.name, cardX + cardWidth / 2, cardY + cardHeight / 2);
        }
      }

      // Website URL
      ctx.fillStyle = '#dabb67';
      ctx.font = '18px "Times New Roman", "Times", serif';
      ctx.textBaseline = 'top';
      ctx.fillText('tarotdaily.club', 400, cardY + cardHeight + 30);

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve('');
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error generating share image:', error);
      return '';
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!isOpen) return null;

  
  // Validate shareData
  if (!shareData || !shareData.cards || !Array.isArray(shareData.cards)) {
    console.error('Invalid shareData received:', shareData);
    return null;
  }

  const handleCopyLink = async (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior that might cause URL bar to hide
    e.preventDefault();
    e.stopPropagation();
    
    // Store current scroll position to prevent any scrolling issues
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    try {
      // For mobile devices, use fallback method to avoid URL bar issues
      if (isMobile) {
        console.log('Mobile copy - shareData.shareUrl:', shareData.shareUrl);
        console.log('Mobile copy - URL length:', shareData.shareUrl.length);
        
        // Check if URL is too long for mobile browsers
        if (shareData.shareUrl.length > 2000) {
          console.log('URL too long for mobile, showing fallback input');
          setShowUrlFallback(true);
          setTimeout(() => setShowUrlFallback(false), 10000);
          return;
        }
        
        await fallbackCopyTextToClipboard(shareData.shareUrl);
        setCopied(true);
        trackUserEngagement('click', 'copy_share_link');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Check if clipboard API is available for desktop
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareData.shareUrl);
          setCopied(true);
          trackUserEngagement('click', 'copy_share_link');
          setTimeout(() => setCopied(false), 2000);
        } else {
          // Fallback for non-secure contexts
          await fallbackCopyTextToClipboard(shareData.shareUrl);
          setCopied(true);
          trackUserEngagement('click', 'copy_share_link');
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Restore scroll position on error
      window.scrollTo(scrollLeft, scrollTop);
      
      // For mobile, show a fallback input instead of alert
      if (isMobile) {
        setShowUrlFallback(true);
        setTimeout(() => setShowUrlFallback(false), 10000); // Hide after 10 seconds
      } else {
        alert(t('copyLinkFailed') || 'Failed to copy link. Please try selecting and copying the text manually.');
      }
    }
  };

  // Fallback copy function for mobile browsers
  const fallbackCopyTextToClipboard = async (text: string) => {
    return new Promise<void>((resolve, reject) => {
      console.log('fallbackCopyTextToClipboard - text:', text);
      console.log('fallbackCopyTextToClipboard - text length:', text.length);
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Position the textarea off-screen to prevent any visual interference
      textArea.style.position = 'absolute';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.style.zIndex = '-9999';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.padding = '0';
      textArea.style.margin = '0';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('tabindex', '-1');
      
      // Store current scroll position to restore later
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      document.body.appendChild(textArea);
      
      // Use requestAnimationFrame with a small delay to ensure the element is fully rendered
      requestAnimationFrame(() => {
        // Add a small delay to ensure the textarea is fully rendered and positioned
        setTimeout(() => {
          try {
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, textArea.value.length);
            
            const successful = document.execCommand('copy');
            
            // Clean up immediately
            document.body.removeChild(textArea);
            
            // Restore scroll position
            window.scrollTo(scrollLeft, scrollTop);
            
            if (successful) {
              resolve();
            } else {
              reject(new Error('Copy command failed'));
            }
          } catch (err) {
            // Clean up on error
            if (document.body.contains(textArea)) {
              document.body.removeChild(textArea);
            }
            // Restore scroll position
            window.scrollTo(scrollLeft, scrollTop);
            reject(err);
          }
        }, 10); // Small 10ms delay
      });
    });
  };

  const handleTelegramShare = async () => {
    try {
      const text = `Tarot Daily - ${translateDate(shareData.date)}`;
      
      // Generate the Telegram share URL with simple text
      const url = `https://t.me/share/url?url=${encodeURIComponent(shareData.shareUrl)}&text=${encodeURIComponent(text)}`;
      
      // For mobile devices, use a more reliable approach
      if (isMobile) {
        // Create a temporary link element and trigger it
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        
        // Add to DOM, click, then remove
        document.body.appendChild(link);
        link.click();
        
        // Clean up after a short delay
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
        }, 100);
        
        // Also try the native share API if available
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Tarot Daily Reading',
              text: text,
              url: shareData.shareUrl
            });
            trackUserEngagement('click', 'telegram_share');
            return;
          } catch (shareError) {
            console.log('Native share failed, using Telegram web:', shareError);
          }
        }
      } else {
        // On desktop, use window.open with fallback
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          // If popup was blocked, fallback to same tab
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error('Error sharing to Telegram:', error);
      // Fallback: just copy the link to clipboard
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareData.shareUrl);
          alert('Telegram sharing failed. Link copied to clipboard instead.');
        } else {
          // Fallback for non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = shareData.shareUrl;
          textArea.style.position = 'absolute';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Telegram sharing failed. Link copied to clipboard instead.');
        }
      } catch (clipboardError) {
        console.error('Clipboard fallback also failed:', clipboardError);
        alert('Telegram sharing failed. Please try copying the link manually.');
      }
    }
    
    trackUserEngagement('click', 'telegram_share');
  };


  const handleDownloadImage = async () => {
    const imageUrl = await generateShareImage();
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `tarot-reading-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackUserEngagement('click', 'download_image');
    }
  };

  return (
    <div className="shareModalOverlay" onClick={onClose}>
      <div className="shareModal" onClick={(e) => e.stopPropagation()}>
        <div className="shareModalHeader">
          <div>
            <h3>{t('sharedTarotReading')}</h3>
            <div className="sharePreviewDate">{translateDate(shareData.date)}</div>
          </div>
          <button className="closeButton" onClick={onClose} aria-label={t('close')}>
            ×
          </button>
        </div>
        
        <div className="sharePreview">
          <div className={`sharePreviewCards ${shareData.cards.length === 1 ? 'singleCard' : ''}`}>
            {shareData.cards.map((card, index) => (
              <div key={index} className="sharePreviewCard">
                <div className="shareCardImage">
                  <Image 
                    src={getCardImagePath(card.id)} 
                    alt={card.name}
                    width={120}
                    height={180}
                  />
                  <div className="shareCardName">{card.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="shareWebsite">tarotdaily.club</div>
        </div>

        <div className="shareOptions">
          <button 
            className="shareOption telegram" 
            onClick={handleTelegramShare}
            onTouchEnd={handleTelegramShare}
            title="Telegram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
            </svg>
          </button>
          
          <button 
            className={`shareOption copyLink ${copied ? 'copied' : ''}`} 
            onClick={handleCopyLink}
            onTouchEnd={handleCopyLink}
            title={copied ? t('copied') : t('copyLink')}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            )}
          </button>
          
          <button className="shareOption downloadImage" onClick={handleDownloadImage} title={t('downloadImage') || 'Download Image'} disabled={isGeneratingImage}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </button>
        </div>
        
        {/* Mobile fallback URL input */}
        {showUrlFallback && (
          <div className="mobileUrlFallback">
            <p>{t('copyLinkManually') || 'Copy this link manually:'}</p>
            <input 
              type="text" 
              value={shareData.shareUrl} 
              readOnly 
              className="urlInput"
              onClick={(e) => e.currentTarget.select()}
            />
            <button 
              className="closeFallback" 
              onClick={() => setShowUrlFallback(false)}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

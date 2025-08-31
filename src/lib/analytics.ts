// Google Analytics 4 Event Tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-RRFYRMZH30', {
      page_path: url,
    });
  }
};

// Track tarot reading events
export const trackTarotReading = (readingType: 'love' | 'career' | 'destiny') => {
  trackEvent('tarot_reading', 'engagement', readingType);
};

// Track card selection
export const trackCardSelection = (cardName: string, position: number) => {
  trackEvent('card_selected', 'interaction', `${cardName}_position_${position}`);
};

// Track reading completion
export const trackReadingCompletion = (readingType: string, duration: number) => {
  trackEvent('reading_completed', 'conversion', readingType, duration);
};

// Track user engagement
export const trackUserEngagement = (action: string, element: string) => {
  trackEvent(action, 'user_engagement', element);
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'metrics', metric, value);
};

// Track errors
export const trackError = (error: string, context?: string) => {
  trackEvent('error', 'system', context || 'unknown', 1);
};

// Enhanced ecommerce tracking for tarot services
export const trackTarotService = (serviceType: string, action: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_content', {
      content_type: 'tarot_service',
      item_id: serviceType,
      content_category: action,
    });
  }
};

// Track user journey
export const trackUserJourney = (step: string, details?: any) => {
  trackEvent('user_journey', 'navigation', step);
  
  // Additional data layer push for GTM
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: 'user_journey',
      step: step,
      details: details,
      timestamp: new Date().toISOString(),
    });
  }
};

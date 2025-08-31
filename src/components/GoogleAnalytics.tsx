'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag('config', 'G-RRFYRMZH30', {
        page_path: pathname + searchParams.toString(),
      });
    }
  }, [pathname, searchParams]);

  // Don't render anything in the DOM
  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}

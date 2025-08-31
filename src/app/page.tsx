"use client";

import { useEffect } from "react";
import Deck from "@/components/Deck";
import { useI18n } from "@/lib/i18n";
import { trackUserJourney } from "@/lib/analytics";

export default function HomePage() {
  const { t } = useI18n();
  
  useEffect(() => {
    // Track homepage visit
    trackUserJourney('homepage_visit');
  }, []);
  
  // Keep document title in sync with current language
  if (typeof document !== "undefined") {
    const desiredTitle = t("title");
    if (document.title !== desiredTitle) {
      document.title = desiredTitle;
    }
  }

  return (
    <>
      <div className="homeBg" aria-hidden="true" />
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
      <Deck />
    </>
  );
}

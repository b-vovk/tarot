import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";
import { trackUserJourney } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Love Tarot – Reveal Your Heart's Path",
  description: "Draw a single card to illuminate love, connection, and relationships.",
};

export default function LovePage() {
  // Track love page visit
  if (typeof window !== 'undefined') {
    trackUserJourney('love_page_visit');
  }
  
  return (
    <SingleCard aspect="love" />
  );
}



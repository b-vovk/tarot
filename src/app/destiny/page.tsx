import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";
import { trackUserJourney } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Destiny Tarot – Reveal Your Life Path",
  description: "Draw a single card to see turning points, guidance, and direction.",
};

export default function DestinyPage() {
  // Track destiny page visit
  if (typeof window !== 'undefined') {
    trackUserJourney('destiny_page_visit');
  }
  
  return (
    <SingleCard aspect="destiny" extra={undefined} />
  );
}



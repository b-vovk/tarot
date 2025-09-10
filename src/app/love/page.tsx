import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";
import { trackUserJourney } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Love Tarot Daily – Free Daily Love Reading & Relationship Guidance",
  description: "Get your free daily love tarot reading. Discover relationship insights, love guidance, and connection wisdom with our daily love tarot card. Professional love tarot readings updated daily.",
  keywords: ["love tarot daily", "daily love tarot", "love tarot reading", "relationship guidance", "love tarot card", "free love tarot", "daily love reading", "tarot love guidance"],
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



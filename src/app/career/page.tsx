import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";
import { trackUserJourney } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Career Tarot – Reveal Your Next Step",
  description: "Draw a single card to explore work, purpose, and success.",
};

export default function CareerPage() {
  // Track career page visit
  if (typeof window !== 'undefined') {
    trackUserJourney('career_page_visit');
  }
  
  return (
    <SingleCard
      aspect="career"
      extra={undefined}
    />
  );
}



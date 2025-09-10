import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";
import { trackUserJourney } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Career Tarot Daily – Free Daily Career Reading & Work Guidance",
  description: "Get your free daily career tarot reading. Discover work insights, career guidance, and professional wisdom with our daily career tarot card. Professional career tarot readings updated daily.",
  keywords: ["career tarot daily", "daily career tarot", "career tarot reading", "work guidance", "career tarot card", "free career tarot", "daily career reading", "tarot career guidance"],
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



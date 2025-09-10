import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";
import { trackUserJourney } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Destiny Tarot Daily – Free Daily Destiny Reading & Life Path Guidance",
  description: "Get your free daily destiny tarot reading. Discover life path insights, destiny guidance, and spiritual wisdom with our daily destiny tarot card. Professional destiny tarot readings updated daily.",
  keywords: ["destiny tarot daily", "daily destiny tarot", "destiny tarot reading", "life path guidance", "destiny tarot card", "free destiny tarot", "daily destiny reading", "tarot destiny guidance"],
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



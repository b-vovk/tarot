import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Tarot – Reveal Your Next Step",
  description: "Draw a single card to explore work, purpose, and success.",
};

export default function CareerPage() {
  return (
    <SingleCard
      aspect="career"
      extra={undefined}
    />
  );
}



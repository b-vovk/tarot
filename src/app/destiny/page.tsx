import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destiny Tarot – Reveal Your Life Path",
  description: "Draw a single card to see turning points, guidance, and direction.",
};

export default function DestinyPage() {
  return (
    <SingleCard aspect="destiny" extra={undefined} />
  );
}



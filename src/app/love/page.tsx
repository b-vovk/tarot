import SingleCard from "@/components/SingleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Love Tarot – Reveal Your Heart's Path",
  description: "Draw a single card to illuminate love, connection, and relationships.",
};

export default function LovePage() {
  return (
    <SingleCard aspect="love" />
  );
}



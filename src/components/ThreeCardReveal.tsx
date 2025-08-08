"use client";

import { useEffect, useRef, useState } from "react";
import deck from "@/data/decks/classic.json";
import { useI18n } from "@/lib/i18n";

type Card = { id: string; name: string; upright?: string; reversed?: string };
type DrawnCard = Card & { position: "upright" | "reversed" };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawThree(source: Card[]): DrawnCard[] {
  const picked = shuffle(source).slice(0, 3);
  return picked.map((c) => ({
    ...c,
    position: Math.random() < 0.5 ? "reversed" : "upright",
  }));
}

export default function ThreeCardReveal() {
  const { t } = useI18n();

  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [revealed, setRevealed] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [entered, setEntered] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;
    const safeDeck = (deck as Card[]).filter(Boolean);
    setCards(drawThree(safeDeck));
  }, []);

  useEffect(() => {
    if (!cards) return;
    setEntered([false, false, false]);
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    [0, 1, 2].forEach((i) => {
      timers.push(
        setTimeout(() => {
          setEntered((e) => {
            const next = [...e] as [boolean, boolean, boolean];
            next[i] = true;
            return next;
          });
        }, i * 450)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [cards]);

  const allRevealed = revealed.every(Boolean);

  function reveal(index: number) {
    if (!cards) return;
    setRevealed((r) =>
      r[index] ? r : (r.map((v, i) => (i === index ? true : v)) as typeof r)
    );
  }

  function reset() {
    const safeDeck = (deck as Card[]).filter(Boolean);
    setCards(drawThree(safeDeck));
    setRevealed([false, false, false]);
  }

  const placeholders = [0, 1, 2];

  return (
    <>
      <div className="deck">
        {placeholders.map((idx) => {
          const isRevealed = revealed[idx];
          const card = cards?.[idx] ?? null;
          const meaning = card
            ? card.position === "upright"
              ? card.upright
              : card.reversed
            : "…";

          const enterClass = entered[idx] ? "entered" : "enter";

          return (
            <div
              key={idx}
              className={`card ${enterClass} ${isRevealed ? "revealed" : ""}`}
              onClick={() => reveal(idx)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && reveal(idx)
              }
              role="button"
              tabIndex={0}
              aria-label={`Reveal card ${idx + 1}`}
            >
              <div className="cardInner">
                {/* BACK — unique image per card */}
                <div className={`cardFace cardBack cardBack-${idx}`} />

                {/* FRONT */}
                <div className="cardFace cardFront">
                  <div className="cardTitle">
                    {card ? (
                      <>
                        {card.name}{" "}
                        {card.position === "reversed" ? t("reversed") : ""}
                      </>
                    ) : (
                      <>Card</>
                    )}
                  </div>
                  <div className="cardBody">{meaning}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="actions">
        <button
          className="primary"
          onClick={reset}
          disabled={!allRevealed || !cards}
        >
          {t("drawAgain")}
        </button>
        {!allRevealed && <span className="helper">{t("helper")}</span>}
      </div>
    </>
  );
}

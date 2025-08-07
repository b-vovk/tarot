'use client';
import TarotCard from './TarotCard';
import { drawThree, summarizeSpread } from '@/lib/tarot';
import { useEffect, useMemo, useState } from 'react';
import { useLocalHistory } from '@/hooks/useLocalHistory';

export default function TarotSpread() {
  const [spread, setSpread] = useState<ReturnType<typeof drawThree> | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const { pushLocal } = useLocalHistory();

  useEffect(() => {
    setSpread(drawThree());
  }, []);

  const summary = useMemo(() => {
    return spread ? summarizeSpread(spread, 'day') : '';
  }, [spread]);

  useEffect(() => {
    if (spread && revealedCount === 3) {
      const payload = {
        type:'daily',
        date: new Date().toISOString(),
        cards: spread.map(s => ({ id:s.card.id, name:s.card.name, reversed:s.reversed, position:s.position })),
        resultText: summary,
        isPaid:false,
      };
      pushLocal(payload);
      persistIfLoggedIn(payload);
    }
  }, [revealedCount, spread, pushLocal, summary]);

  async function persistIfLoggedIn(payload:any) {
    try {
      await fetch('/api/spreads', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
    } catch {}
  }

  if (!spread) return <div>Завантаження розкладу…</div>;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Щоденний розклад</h2>
        <p className="text-sm opacity-70">Натисни на карти, щоб відкрити</p>
      </div>

      <div className="flex gap-4">
        {spread.map((s, idx) => (
          <TarotCard
            key={idx}
            data={s.card}
            reversed={s.reversed}
            onReveal={() => setRevealedCount(c => Math.min(3, c+1))}
          />
        ))}
      </div>

      <div className="max-w-md text-center text-sm opacity-80">
        {revealedCount === 3 ? summary : 'Відкрий усі три карти, щоб побачити підсумок.'}
      </div>

      <button
        className="px-3 py-2 text-sm rounded border border-zinc-300 hover:bg-zinc-50"
        onClick={() => {
          setSpread(drawThree());
          setRevealedCount(0);
        }}
      >
        Новий розклад
      </button>
    </div>
  );
}

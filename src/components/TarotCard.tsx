'use client';
import { useState } from 'react';
import type { TarotCardData } from '@/lib/tarot';

type Props = {
  data: TarotCardData;
  reversed?: boolean;
  onReveal?: () => void;
};

export default function TarotCard({ data, reversed, onReveal }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      onClick={() => { if (!revealed) { setRevealed(true); onReveal?.(); } }}
      className="w-28 h-44 md:w-40 md:h-64 [perspective:1000px]"
      aria-label={revealed ? data.name : 'Reveal card'}
    >
      <div className={`relative w-full h-full rounded-xl shadow transition-transform duration-500 [transform-style:preserve-3d] ${revealed ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-600 rounded-xl border border-zinc-500 [backface-visibility:hidden]" />
        <div className="absolute inset-0 p-3 bg-zinc-50 rounded-xl border border-zinc-300 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-between">
          <div className="text-xs uppercase tracking-widest opacity-70">{reversed ? 'Reversed' : 'Upright'}</div>
          <div className="text-center">
            <div className="font-semibold">{data.name}</div>
            <div className="text-xs opacity-70 mt-1">{reversed ? data.meaningReversed : data.meaningUpright}</div>
          </div>
          <div className="text-[10px] opacity-50">{data.arcana}</div>
        </div>
      </div>
    </button>
  );
}

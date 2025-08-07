'use client';
import { useLocalHistory } from '@/hooks/useLocalHistory';

export default function SpreadHistory() {
  const { history } = useLocalHistory();
  if (!history.length) return <p className="text-sm opacity-70">Історія порожня (для гостей зберігається локально).</p>;
  return (
    <ul className="space-y-3">
      {history.map(h => (
        <li key={h.id} className="border rounded p-3 bg-white">
          <div className="text-sm font-medium">{new Date(h.date).toLocaleString()}</div>
          <div className="text-xs opacity-80">{h.cards.map(c => c.name + (c.reversed?' (R)':'')).join(', ')}</div>
          {h.resultText && <div className="text-sm mt-1">{h.resultText}</div>}
        </li>
      ))}
    </ul>
  );
}

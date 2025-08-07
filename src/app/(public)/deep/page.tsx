'use client';
import { useEffect, useState } from 'react';

export default function DeepPage() {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // naive check: require paid subscription (server-side should verify in real app)
    fetch('/api/subscription-status').then(r=>r.json()).then(d => {
      setAllowed(!!d.active);
    }).finally(()=>setChecking(false));
  }, []);

  if (checking) return <div>Перевірка підписки…</div>;

  if (!allowed) {
    return (
      <div className="max-w-md mx-auto bg-white border rounded p-5 space-y-3">
        <h1 className="text-xl font-semibold">Глибокий розклад 💎</h1>
        <p className="text-sm opacity-80">Доступно за підпискою. Отримай детальніший розбір та додаткові позиції.</p>
        <form action="/api/checkout" method="post" onSubmit={async (e)=>{
          e.preventDefault();
          const r = await fetch('/api/checkout', { method:'POST' });
          const d = await r.json();
          if (d.url) window.location.href = d.url;
          else alert('Stripe не налаштовано.');
        }}>
          <button className="px-3 py-2 border rounded hover:bg-zinc-50" type="submit">Оформити підписку</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded p-5">
      <h1 className="text-xl font-semibold">Глибокий розклад 💎</h1>
      <p className="text-sm opacity-80">Тут може бути розклад на 7 карт, додаткові трактування і GPT-резюме.</p>
    </div>
  );
}

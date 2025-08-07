import TarotSpread from '@/components/TarotSpread';
import SpreadHistory from '@/components/SpreadHistory';

export default function HomePage() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <section className="bg-white rounded-xl p-5 border">
        <TarotSpread />
      </section>
      <section className="bg-white rounded-xl p-5 border">
        <h3 className="font-semibold mb-3">Історія (гість)</h3>
        <SpreadHistory />
      </section>
    </div>
  );
}

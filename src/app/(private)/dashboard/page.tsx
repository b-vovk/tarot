import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return <div>Потрібно увійти.</div>;
  const spreads = await prisma.spread.findMany({ where: { userId: (session.user as any).id }, orderBy: { createdAt: 'desc' }, take: 20 });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Кабінет</h1>
      <div className="text-sm opacity-70">Вітаю, {(session.user as any).name ?? (session.user as any).email}</div>
      <div className="bg-white border rounded p-4">
        <h2 className="font-medium mb-2">Останні розклади</h2>
        <ul className="space-y-3">
          {spreads.map(s => (
            <li key={s.id} className="border rounded p-3 bg-white">
              <div className="text-sm">{new Date(s.createdAt).toLocaleString()} — {s.type} {s.isPaid ? '💎' : ''}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ active: false });
  const sub = await prisma.subscription.findUnique({ where: { userId: (session.user as any).id } });
  const active = !!sub && (sub.status === 'active' || sub.status === 'trialing');
  return NextResponse.json({ active });
}

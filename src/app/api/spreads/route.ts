import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { type, date, cards, question, resultText, isPaid } = body;
  const created = await prisma.spread.create({
    data: {
      userId: (session.user as any).id,
      type,
      date: new Date(date),
      cards,
      question,
      resultText,
      isPaid: !!isPaid,
    },
  });
  return NextResponse.json(created);
}

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'User exists' }, { status: 400 });
  const passwordHash = await hash(password, 10);
  await prisma.user.create({ data: { email, passwordHash } });
  return NextResponse.json({ ok: true });
}

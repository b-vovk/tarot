# Tarot App (Next.js + TS + Prisma + NextAuth + Stripe)

## Quick start
1. `cp .env.example .env` and fill values (Neon DATABASE_URL, NEXTAUTH_SECRET, etc)
2. `npm install`
3. `npx prisma migrate dev -n init`
4. `npm run dev`

## Deploy (Vercel + Neon)
- Create Neon Postgres, copy `DATABASE_URL` (use sslmode=require)
- Set Vercel env vars from `.env`
- Run `prisma generate` (build step runs it automatically)

## Stripe
- Set `STRIPE_SECRET_KEY`, create a Price and set `STRIPE_PRICE_ID`
- Checkout endpoint will redirect to Stripe Checkout

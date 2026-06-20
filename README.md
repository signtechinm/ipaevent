# IPA Event Portal

React/Vite event portal with Vercel Functions and a shared Neon PostgreSQL database.

**Event:** 14th IPA National Students Congress

**Date:** 19–20 September 2026

**Theme:** Pioneering India's Pharmaceutical Future: Bridging Innovation, Entrepreneurship, Industry, and Healthcare Practice in the Digital Era

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run db:init
npm run dev:vercel
```

Open `http://localhost:3000`. Use `npm run dev` only when working on frontend UI that does not need `/api`.

## Environment Variables

- `DATABASE_URL`: pooled Neon connection used by Vercel Functions.
- `DATABASE_URL_UNPOOLED`: direct Neon connection used by schema migrations.
- `ADMIN_SEED_EMAIL`: initial super-admin email.
- `ADMIN_SEED_USERNAME`: initial super-admin username.
- `ADMIN_SEED_PASSWORD`: initial super-admin password.

Never expose these values through `VITE_*` variables or commit `.env.local`.

## Database

The idempotent schema is in `database/schema.sql`. It stores registration drafts and submissions, admin roles, users, and hashed sessions.

```bash
set -a
source .env.local
npm run db:init
```

## Deployment

Set all four environment variables for Vercel Development, Preview, and Production, then deploy:

```bash
npx vercel deploy --prod
```

Production: https://ipaevent-brown.vercel.app

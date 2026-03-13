# LUMINI System Planner (MVP)

Professional low-voltage outdoor lighting planner for transformer sizing, current draw validation, and voltage-drop recommendations.

## Stack

- Next.js (TypeScript, App Router)
- Tailwind CSS
- Supabase / PostgreSQL
- Zod + React Hook Form
- Vitest unit tests
- Playwright end-to-end tests

## Features

- Landing page with trade-focused value proposition and start CTA.
- 5-step planner flow:
  1. Voltage, project type, topology
  2. Fixture library and quantities
  3. Cable and run length
  4. Headroom and reserve capacity
  5. Results with status and practical recommendations
- Result statuses: `Good`, `Caution`, `Not Recommended`.
- Recommendation engine suggests:
  - larger cable
  - split run
  - shorter run
  - moving to 24V where appropriate
- Protected admin page (`/admin?token=...`) for fixture/cable/transformer/rule management views.

## Engineering assumptions

- Voltage-drop formula uses loop length (outbound + return conductor), so run length is doubled in resistance calculations.
- Transformer recommendation chooses the smallest transformer whose wattage is >= design load.
- Design load = connected load + configured headroom + optional reserve wattage.

## Local setup

```bash
cd lumini-system-planner
npm install
cp .env.example .env.local
npm run dev
```

Visit:

- `http://localhost:3000`
- `http://localhost:3000/calculator`
- `http://localhost:3000/admin?token=your-admin-secret`

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_SECRET=replace-with-internal-token
```

## Database

Schema and seed files:

- `supabase/schema.sql`
- `supabase/seed.sql`

Apply with Supabase CLI or your PostgreSQL migration process.

## Tests

```bash
npm run test
npm run test:e2e
```

## TODO (post-MVP)

- Quote builder with bill-of-materials export
- Saved projects + user auth
- Live PDF generation from server route
- Transformer efficiency curves and temperature derating
- Multi-run balancing optimizer
- Admin CRUD backed by Supabase Row Level Security

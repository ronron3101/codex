# LUMINI System Planner (MVP)

LUMINI System Planner is a trade-focused web application for planning low-voltage outdoor lighting runs. It helps installers, designers, and specifiers choose transformer size, understand current draw, and control voltage drop with practical recommendations.

## Tech stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase client support + PostgreSQL SQL schema/seed
- React Hook Form + Zod validation
- Vitest unit tests
- Playwright end-to-end tests

## MVP scope delivered

- Clean landing page with trade-focused messaging and CTA.
- Guided 5-step planning workflow:
  1. System setup (voltage, project type, topology)
  2. Fixture loading (fixture + quantity rows)
  3. Cable + run length
  4. Transformer headroom + reserve capacity
  5. Results with status and recommendation set
- Opinionated recommendation engine (not just arithmetic output).
- Status scoring based on voltage drop thresholds:
  - Good: <= 3%
  - Caution: > 3% and <= 8%
  - Not Recommended: > 8%
- Protected admin area (`/admin?token=...`) and protected admin API endpoints for fixtures/cables/transformers/rules.

## Engineering assumptions

- Low-voltage voltage drop is computed on loop resistance (outbound + return conductor), not single-conductor distance.
- Topology adjusts effective resistance in this MVP:
  - single run: 1.0x
  - tee: 0.85x
  - hub: 0.70x
- Design load formula:

```text
design_load_w = connected_load_w * (1 + headroom_percent / 100) + reserve_capacity_w
```

## Project structure

- `app/` – Next.js routes (landing, calculator, admin, admin API routes)
- `components/` – reusable UI components for planner/admin
- `lib/calculations/` – isolated calculation + recommendation logic
- `lib/schemas/` – Zod schemas
- `supabase/` – SQL schema and seed scripts
- `tests/` – unit and e2e tests

## Local setup

```bash
cd lumini-system-planner
npm install
cp .env.example .env.local
npm run dev
```

### Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_SECRET=replace-with-internal-token
```

## Database setup

Apply SQL scripts to your Supabase/Postgres database:

- `supabase/schema.sql`
- `supabase/seed.sql`

## Run tests

```bash
npm run test
npm run test:e2e
```

## TODO (post-MVP)

- Real authenticated admin workflows (SSO + RLS)
- Persist planner runs to `projects`, `project_runs`, and `calculation_results`
- Quote builder with line items and markup controls
- Generate branded PDF reports server-side
- Saved projects and collaboration comments
- Smarter auto-optimization across multi-run topologies

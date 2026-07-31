# TramitoFácil

AI paperwork assistant for immigrants in Spain — starter scaffold.

## What's built

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**
- **4 languages**: Spanish, English, French, Arabic — via `next-intl`, with automatic RTL layout switching for Arabic (`/messages/*.json`)
- **Landing page** (`app/[locale]/page.tsx`) — hero, problem section, how-it-works, procedures grid, languages, pricing, CTA, footer, legal disclaimer
- **All 4 procedure wizards, live**: NIE, empadronamiento, autónomo, Seguridad Social (`app/[locale]/{nie,empadronamiento,autonomo,seguridad}/page.tsx`), each a guided multi-step flow driven generically by `components/ProcedureWizard.tsx` + `lib/procedures.ts`
- **Document upload + AI validation** (`app/[locale]/*/upload/page.tsx`, `app/api/validate-nie-docs/route.ts`) — upload photos of your documents, Claude vision checks each one against the official requirements list for that procedure and returns accepted / needs-review / rejected with plain-language notes. Runs in demo mode automatically if no API key is set, so it's fully clickable out of the box.
- **Sign-in + persistent history** (Supabase) — magic-link email auth, uploaded documents saved to private per-user Storage, validation results saved to a `document_validations` table (RLS-locked to the owner), visible at `/cuenta`. Fully optional: with no Supabase env vars set, everything still works in guest/ephemeral mode exactly as before.
- **Design system**: paper/ink/stamp color palette evoking Spanish official documents, a custom circular "seal" SVG as the signature visual element, real fonts via `next/font/google` — Zilla Slab (display), Inter (body), IBM Plex Mono (utility/stamp text), Noto Kufi Arabic + Cairo (Arabic display/body) — see `app/globals.css` for tokens

## Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/es` (default locale). Try `/en`, `/fr`, `/ar` too — `/ar` renders right-to-left automatically.

## Enable real AI document validation

```bash
cp .env.local.example .env.local
# add your Anthropic API key to .env.local
npm run dev
```

Without a key, `/nie/upload` (and the other 3 upload flows) still work — they return clearly-labeled demo results instead of calling the API.

## Enable sign-in + persistent history

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the Project URL and anon key into `.env.local` (see `.env.local.example`).
3. Run `supabase/migrations/0001_init.sql` against your project — SQL Editor in the dashboard, or `supabase db push` if you're using the CLI. This creates the private `documents` storage bucket and the `document_validations` table, both locked down with Row Level Security so users can only ever see their own data.
4. Restart `npm run dev` and visit `/cuenta` — enter an email to get a magic sign-in link.

Without these env vars, `/cuenta` shows a "not configured" message and document validation keeps working exactly as before, just without saving anything.

## What's NOT built yet

- Cita previa appointment-alert bot (n8n workflow)
- Multilingual RAG chat assistant
- Stripe billing (the pricing section on the landing page is still static marketing copy — both CTAs link to `/nie`)
- Automated tests, CI/CD, `robots.txt`/`sitemap.xml`

## Suggested next step

Wire up Stripe for the paid tier advertised in the pricing section, now that auth/storage exist to gate it against. After that, the cita previa bot and RAG chat assistant are the two remaining net-new features.

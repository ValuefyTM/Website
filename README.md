# VALUEFY — website

Next.js implementation of the `Valuefy Website v4` design (hero variant "Luminos", Verdana font, navy + gold theme).

## Development

```bash
npm install
cp .env.example .env.local   # fill in the keys
npm run dev                  # http://localhost:3000
```

## Configuration (`.env.local` or the hosting provider's environment variables)

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | AI assistant (free-text answers) and the internal request summary |
| `ASSISTANT_MODEL` | Model used, default `claude-haiku-4-5` |
| `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO` | Sending requests by email (Resend). The sender domain must be verified in Resend |
| `CLIENT_CONFIRMATION` | Set to `off` to stop the confirmation email sent to the visitor (on by default when the visitor gives an email) |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL` | Contact details shown on the site |
| `NEXT_PUBLIC_ANEVAR_NO` | ANEVAR authorization number; hidden while empty |
| `NEXT_PUBLIC_PORTAL_URL` | Client and partner portal (default `https://portal.valuefy.ro/login`; `/client` redirects there) |

Without `ANTHROPIC_API_KEY` the assistant still works through the guided steps; free text gets a fallback reply.
Without email configured, requests are only logged in development; in production the submission returns an error so no request is silently lost.

## How a request flows

1. The visitor picks a type, purpose or service → the assistant opens pre-filled (`src/components/Assistant.tsx`).
2. Free-text messages go to `POST /api/assistant`, where Claude extracts fields (`set_lead_fields`) and replies briefly.
3. After "Trimite solicitarea", `POST /api/leads` builds the CRM record (`lead_id`, `source: WEBSITE_AI`, `lead_status: NEW`, internal priority NORMAL/PRIORITY/URGENT, AI summary), **saves it to the D1 database** and emails it with the JSON and the attached documents (max 4 MB total). The request counts as received if it reached at least one of the two.

## Database (Cloudflare D1)

Binding `DB`, database `valuefy-db`, schema in `migrations/` — shared with the future CRM and client portal.

| Table | Holds |
|---|---|
| `clients` | One row per client, matched by email, then by phone digits |
| `properties` | The property of each request |
| `leads` | Each request (`id` = the VF-… number), status, internal priority, summary, full JSON payload |
| `lead_files` | Names/sizes of files attached to a request (the files themselves go by email for now) |

- New schema change: add `migrations/000N_name.sql`; it is applied on the next deploy.
- Local: `npm run db:migrate:local` once, then `npm run preview`.
- Browse the data: Cloudflare dashboard → Storage & Databases → D1 → `valuefy-db` → Explore / Console.

## Languages (RO/EN)

Romanian is the default, at unprefixed URLs; English lives under `/en` (`/en/properties`, `/en/movable-asset-valuation`, `/en/tax-valuation`, `/en/client`, …). The admin panel and `/api/*` are Romanian-only and never localized.

- **Routes:** each page's implementation is a *view module* next to the Romanian route (e.g. `src/app/(ro)/home-view.tsx`, `src/app/(ro)/evaluare-bunuri-mobile/view.tsx`) exporting `XView({ lang })` and `xMetadata(lang)`. The Romanian `page.tsx` and the English `src/app/en/.../page.tsx` are thin wrappers that pass `lang` and repeat the route config (`dynamic`, …). Each language has its own root layout (`src/app/(ro)/layout.tsx`, `src/app/en/layout.tsx`) that sets `<html lang>` and wraps the page in `LangProvider`.
- **Language in components:** a view calls `setLang(lang)` (`src/i18n/server.ts`); nested server components call `getLang()`, client components `useLang()` (`src/i18n/client.tsx`).
- **Dictionaries:** texts are colocated in each component as `const T = { ro: {...}, en: {...} }` with the same keys, read as `T[lang]`.
- **Links:** always write the Romanian path and wrap it in `localize(lang, path)` (`src/i18n/lang.ts`), e.g. `localize("en", "/imobiliare/x/raport")` → `/en/properties/x/report`. `switchPath()` gives the same page in the other language; new localized sections go in the `PATHS` table there.
- **Stored values:** property types, purposes, deadlines etc. are stored in Romanian (database, emails, CRM) and never change; show them to visitors with `label(value, lang)` (`src/i18n/labels.ts`).
- **Listings:** the English title, description and features of a property are entered in the admin; `inLang(listing, lang)` (`src/lib/listing-format.ts`) uses them and falls back to Romanian when missing.
- **SEO:** each page sets `alternates.languages` (ro/en); `src/app/sitemap.ts` lists both URLs of every page and listing with hreflang alternates.

## Deploy — Cloudflare Workers

The app runs on Cloudflare Workers through the [OpenNext adapter](https://opennext.js.org/cloudflare)
(`wrangler.jsonc`, `open-next.config.ts`). Pages are prerendered and served from Workers static assets,
so no R2/KV bucket is needed; images are served unoptimized (the Unsplash URLs are already sized).

**Git integration (recommended)** — Cloudflare dashboard → Workers & Pages → Create → Import a repository → `ValuefyTM/Website`:

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npm run cf:deploy` (deploys, then applies pending D1 migrations)
- **Build variables** (inlined at build time): `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_ANEVAR_NO`, `NEXT_PUBLIC_PORTAL_URL`
- **Runtime variables** (Worker → Settings → Variables and Secrets): `ANTHROPIC_API_KEY` and `RESEND_API_KEY` as *secrets*; `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO`, `ASSISTANT_MODEL` as plain text

Every push to `main` then redeploys automatically. Add the custom domain under the Worker's
Settings → Domains & Routes (the domain's DNS must be on Cloudflare).

**From your machine:** `npx wrangler login`, then `npm run deploy`. `npm run preview` runs the Worker build locally.

The original Claude Design files (prototype HTML + chat transcript) are in `design/` for reference.

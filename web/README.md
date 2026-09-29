# Querencia — web

The bilingual (ES/EN) scroll showcase. Next.js 15, no CSS framework, one client file
(`brand.config.ts`) plus content files. The legacy AdventureLog app in `../frontend` is untouched.

## Run

```bash
cd web
pnpm install
pnpm dev                 # http://localhost:3000 → redirects to /es or /en
pnpm lint && pnpm typecheck && pnpm build
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome pnpm test:e2e   # builds must exist: runs `pnpm start`
```

## Routes

| Route | What it is |
|---|---|
| `/` | Redirects to `/es` or `/en` (saved choice, then browser language, then Spanish) |
| `/[lang]` | Scroll journey (6 scenes) → real places → "Plan my journey" form → gift teaser |
| `/[lang]/regalo` | Public demo of the surprise reveal (codes shown) + gift enquiry form |
| `/[lang]/caso` | Case study for the creative strategist; `?embed=1` is a compact card for an iframe |
| `POST /api/lead` | Lead intake (contract below) |
| `GET /api/health` | `{ ok: true }` |

## Where things live

| Path | Role |
|---|---|
| `brand.config.ts` | Name, colours, locales, contact and credit (from env) |
| `content/i18n/{es,en}.ts` | All copy, written by hand in both languages |
| `content/places.ts` | Real places: source link + link kind, image label, date checked |
| `content/journey.ts` | Scene → poster/clip wiring for the scroll engine |
| `content/gift-demo.ts` | The public reveal demo (not the private birthday itinerary) |
| `public/scroll-world/scrub-engine.js` | Vendored scrub engine (from `executiveusa/pauli-scroll-world` via BREATHE) |
| `public/media/journey/posters/*.svg` | Illustrated placeholder scenes until clips are generated |

## Truth rules

- Every place links its source and says what kind it is: official, venue site, or reference.
- Every image says what it is (`Illustration` today). Journey scenes are atmosphere, never a venue.
- No prices, ratings, availability, partners or testimonials until they are real and approved.
- The form never shows a fake "saved": without a webhook the API returns 503 and the visitor is
  told to send the WhatsApp message (which opens with their answers either way).

## `POST /api/lead` contract

Request (JSON):

| Field | Type | Notes |
|---|---|---|
| `name` | string 1–120 | required |
| `contact` | string 3–160 | WhatsApp number or email, required |
| `regions` | `("cdmx"\|"morelos"\|"valle"\|"vallarta")[]` | optional |
| `dates` | string ≤120 | free text |
| `group` | `"1-2"\|"3-6"\|"7-12"\|"13+"` | optional |
| `budget` | `"lt5k"\|"5-10k"\|"10-25k"\|"25k+"\|"talk"` | visitor's own estimate, USD |
| `message` | string ≤1000 | optional |
| `source` | `"trip"\|"gift"\|"portfolio"` | default `trip` |
| `locale` | `"es"\|"en"` | default `es` |
| `company` | must be empty | honeypot |

Responses: `200 {ok:true}` forwarded · `400` invalid · `429` more than 5 per minute per IP ·
`503 lead_backend_not_configured` · `502` webhook failed or unreachable.

The webhook receives the same fields plus `channel` (`email`/`whatsapp`), `site: "querencia"` and
`receivedAt`, with header `Authorization: Bearer $LEAD_WEBHOOK_SECRET`.

## Configuration

See `.env.example`. Nothing secret is committed.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | public | Leads' WhatsApp (digits with country code). Placeholder until set; the form says so |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | Email handoff |
| `NEXT_PUBLIC_CREDIT_NAME` / `_URL` | public | The strategist credited on the site and case study |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical URLs / Open Graph |
| `LEAD_WEBHOOK_URL` / `LEAD_WEBHOOK_SECRET` | server | Where leads are saved |
| `LEGACY_BIRTHDAY_URL` | server | If set, `/birthday` and `/surprise/*` redirect to the legacy app |

## Deploying

Not deployed yet. To switch the Vercel project to this app: set **Root Directory** to `web`,
framework Next.js, and remove the root `vercel.json` build override (it builds `frontend/`). Keep
the legacy app reachable somewhere and set `LEGACY_BIRTHDAY_URL` so the private birthday link keeps
working.

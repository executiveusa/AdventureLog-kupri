# Querencia — transition plan

Status (29 Sep 2026): steps 1–6 built in `web/` with illustrated placeholder scenes; step 7 (media)
waits for cost approval; step 8 is partly done (the build-breaking itinerary route is removed).

> **30 Sep 2026 — pruned.** The journey, one primary action, the Apple-style gallery system,
> Mexican-Spanish-first copy and the mobile contract are now locked in
> [`JOURNEY.md`](JOURNEY.md), which supersedes the page structure described below.

## Why

The repo began as a private birthday surprise: a password-step reveal of a Cuernavaca day
(Las Huertas springs, Jardín Borda, the cathedral, a dinner stop and the butterfly garden). It sits
on a stock AdventureLog fork (SvelteKit + Django), and much of the public site around it is
broken or untrue:

- `frontend/static/directory/listings.json` is invalid (two arrays concatenated).
- `frontend/static/blog/posts.json` is truncated.
- The pricing buttons are TODOs.
- The surprise itinerary API imported a file that does not exist (removed 29 Sep 2026).
- The Django backend is not run by the Vercel deploy.
- The landing and pricing pages state unproven facts: tiers, "47 eco-tours", "carbon neutral" and
  certifications.

The upgrade with the most leverage is to keep the one thing that is original, the **surprise
reveal**. Around it we build a scroll-stopping, bilingual showcase that does two jobs:

1. **Real leads** for premium custom trips in the regions below.
2. **Portfolio proof**: the flagship case study on the creative strategist's profile, covering
   concept, strategy, art direction, copy, motion and conversion design.

## Decisions

| Topic | Decision |
|---|---|
| Destinations | Mexico City · Tepoztlán + Morelos (Cuernavaca hot springs = anchor) · Valle de Bravo · Puerto Vallarta / Punta Mita |
| Why these | CDMX is where most international visitors land, so it is the entry point of the funnel. Morelos reuses the existing itinerary and is a short drive from CDMX. Valle de Bravo is the premium weekend escape for CDMX. Vallarta/Punta Mita is the highest-spend beach market, with direct US/Canada flights. |
| Stack | Next.js 15 app in `web/`. The scroll-world engine, lead API and form patterns are reused from BREATHE International (already live and tested there). |
| Legacy | `frontend/` and `backend/` stay in place as legacy until the new site replaces them. They are not deleted in the same PR. |
| Language | Spanish default, English equal, both written by hand |

## Steps

1. **README + plan** (this PR). The README is now truthful and the original is kept in
   `LEGACY_README.md`.
2. **`web/` app skeleton**, built from the BREATHE pieces:
   - The scrub engine (`public/scroll-world/scrub-engine.js`) and the `ScrollWorld` component.
   - Journey config, lead form, `/api/lead`, the WhatsApp helper and e2e tests.
   - One `web/brand.config.ts` holds the name, WhatsApp, email, accent, languages and portfolio
     credit.
   - Deploy root = `web/`. The `/birthday` redirect is kept.
3. **The journey** under `/es` and `/en` (a cookie, then Accept-Language, then `es`):

   | # | Scene | Real places (official links) |
   |---|---|---|
   | 1 | Dawn over the volcanoes → CDMX rooftops | Museo Nacional de Antropología; Los Manantiales (Félix Candela), Xochimilco |
   | 2 | Road south into cloud forest → Tepoztlán cliffs | Tepozteco, Tepoztlán market |
   | 3 | **Morelos: steam over thermal pools** (signature) | Balneario Las Huertas (Tlaquiltenango, south of Cuernavaca), Jardín Borda, Catedral de Cuernavaca |
   | 4 | Valle de Bravo: lake and paragliders | Lake Valle de Bravo, Monte Alto |
   | 5 | Flight to the Pacific → Puerto Vallarta / Punta Mita | Malecón, Islas Marietas (permit-controlled access) |
   | 6 | Night calm | **"Plan my journey"** + **"Gift a surprise journey"** |

   Every place card has an official link, a photo label (`official photo` / `our photo` /
   `illustrative render`) and a retrieved-on date. Generated clips are atmosphere only and are
   never shown as a specific venue.
4. **Leads that reach a person**:
   - Four questions: regions, dates, group size, and the visitor's own budget band.
   - They are sent to `POST /api/lead`, which forwards server-side to `LEAD_WEBHOOK_URL`.
   - Then WhatsApp or email opens with the answers prefilled.
   - Each lead carries a `source` tag: `trip`, `gift` or `portfolio`.
   - If no backend is configured, the API returns an honest 503 and never a fake "thank you".
5. **Gift a surprise journey**:
   - The reveal flow moves to `/[lang]/regalo`, driven by
     `frontend/static/surprise/itinerary/cuernavaca-sacred.json`.
   - The original birthday version stays private.
   - The public version is a demo that ends in a gift enquiry.
6. **Portfolio case study** at `/[lang]/caso`:
   - Sections: brief → strategy → art direction → motion → conversion.
   - Credit line set from config.
   - An OG image, plus a `?embed=1` compact preview for the profile page.
7. **Media**:
   - Higgsfield `seedance1_5` at 8 s, 1080p, as one continuous forward take.
   - Each clip starts from the last frame of the previous one.
   - 6 desktop legs and 6 native 9:16 phone legs. Estimate **≈146 credits** (12 clips × 12 + stills).
   - **No generation until the cost is approved.**
   - Media is self-hosted in `web/public/media/journey/`.
8. **Truth pass on the legacy app**:
   - Remove the unproven claims from the Svelte landing and pricing pages, or move the legacy UI
     behind `/legacy`.
   - Fix or delete the broken directory and blog JSON. (The missing itinerary import is done.)

## Definition of done (per step)

- `pnpm lint`, `pnpm typecheck` and `pnpm build` pass in `web/`.
- Playwright e2e:
  - `/es` and `/en` render.
  - `/api/lead` returns 400 for invalid input and 503 when unconfigured.
  - The WhatsApp link is prefilled.
  - The `/regalo` steps unlock.
  - `/caso?embed=1` renders.
- Screenshots at 390 px and 1440 px with no horizontal overflow; reduced motion falls back to
  posters.
- A grep finds none of the removed claims.
- No secrets are in git.

## Corrections found while building

- Los Manantiales, Félix Candela's restaurant, is in **Xochimilco, Mexico City**, not Cuernavaca.
  The original birthday itinerary searched for it in Cuernavaca.
- Balneario Las Huertas is in **Tlaquiltenango**, south of Cuernavaca, not in the city.

## Inputs needed from the owner

- The real WhatsApp number and contact email that leads go to.
- The strategist's credit name and profile URL.
- Domain (`querencia.app`?) and hosting target (Vercel or Coolify).
- Approval of the media spend (≈146 credits).

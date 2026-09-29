# Querencia — Kupuri Media

*El lugar donde más te sientes tú mismo. · The place where you feel most yourself.*

Querencia is being rebuilt as a **bilingual (ES/EN) scroll-driven travel showcase** for high-end
journeys around **Mexico City, Morelos (Tepoztlán and the Cuernavaca hot springs), Valle de Bravo
and Puerto Vallarta / Punta Mita**. It has two jobs at once:

1. **Generate real leads** for custom, premium trips. Every scroll ends in a short "plan my
   journey" form that reaches a real person on WhatsApp or email.
2. **Show the craft** of Kupuri Media's creative strategist. It is the flagship case study on her
   portfolio profile: concept, art direction, copy, motion and conversion design in one piece.

It began as a private birthday surprise: a password-unlocked, step-by-step journey through
Cuernavaca (thermal springs, Jardín Borda, the cathedral, a Félix Candela dinner, the butterfly
garden). That idea — *a trip revealed one moment at a time* — stays as a signature feature.

> **Status (28 Sep 2026): in transition.** The repository still contains the original AdventureLog
> fork (a self-hosted travel diary: Django backend + SvelteKit frontend). The new showcase site is
> planned — see [`documentation/PLAN.md`](documentation/PLAN.md). Nothing under "Planned" is live yet.

---

## What exists today (verified by reading the code)

| Area | Where | State |
|---|---|---|
| Birthday surprise flow (ES/EN, password steps, confetti) | `frontend/src/routes/(full)/surprise/*`, `frontend/src/lib/surprise/*`, `frontend/static/surprise/itinerary/cuernavaca-sacred.json` | Works as a concept; photos are Unsplash stand-ins, some mismatched |
| Querencia landing page | `frontend/src/routes/+page.svelte` | Contains unverified claims (see below); email form only redirects to sign-up; WhatsApp link has no number |
| Eco directory | `frontend/src/routes/directory`, `frontend/static/directory/listings.json` | **Broken** — the JSON file is invalid (two arrays concatenated) |
| Blog "El Diario" | `frontend/src/routes/blog`, `frontend/static/blog/posts.json` | **Broken** — JSON is truncated |
| Pricing | `frontend/src/routes/pricing` | Buttons do nothing (TODO); text has encoding damage |
| Surprise itinerary API | `frontend/src/routes/surprise/itinerary/[...path]/+server.ts` | Imports a file that does not exist — likely build failure |
| AdventureLog core (map, collections, auth, admin) | `frontend/src/routes/*`, `backend/` | Stock upstream; needs the Django backend, which the Vercel deploy does not run |
| Hermes agent system | `AGENTS.md` | **Specification only** — the described `hermes/` and `api/` code is not in this repo |

### Claims removed from this README until they are proven

Earlier versions stated fixed MXN subscription tiers, "47 eco-tours completed", "carbon neutral",
"eco-certified", "100% vetted guides", "24/7 WhatsApp concierge", partner discounts and a legal
entity type. Nothing in the repository backs these, so they are not repeated here. The same
statements still appear on the landing and pricing pages and will be removed or proven during the
rebuild. The previous README is kept at
[`documentation/LEGACY_README.md`](documentation/LEGACY_README.md).

---

## Planned: the showcase site

- **One continuous scroll journey** through the region, each scene a short cinematic clip that
  scrubs with the scroll, with a native vertical version for phones.
- **Real places only.** Each destination names the real venue, links its official site, and marks
  every image as *official photo*, *our photo* or *illustrative render*. No invented reviews,
  ratings, prices or partnerships.
- **Bilingual by design**: Spanish first, English equal — no machine-translated filler.
- **Lead capture that works**: a few questions (dates, group, budget range, what matters most) →
  saved server-side → WhatsApp/email handoff with answers prefilled. Never a fake "thank you".
- **"Gift a surprise journey"**: the birthday reveal flow, offered as a product.
- **Portfolio credit**: a discreet "Concept, strategy & art direction by …" line and an embeddable
  preview for the creative strategist's profile.

Built from the scroll-world template proven on BREATHE International (Next.js, portable scroll-scrub
engine, Higgsfield-generated atmosphere clips, self-hosted media, Coolify deploy). Details and open
decisions: [`documentation/PLAN.md`](documentation/PLAN.md).

---

## Running the current (legacy) app locally

```bash
cp .env.example .env        # fill in real secrets; never commit them
docker compose up -d        # frontend :8015, backend :8016
```

Frontend only (SvelteKit 2, Node 20+):

```bash
cd frontend && npm install && npm run dev
```

## Rules for anyone (human or agent) working here

1. Real places, real links, real photos with credit — or clearly labelled illustrations.
2. No invented numbers, testimonials, certifications, prices or partners.
3. Every lead path reaches a real inbox or WhatsApp number before launch.
4. Spanish and English ship together.
5. Branch + PR for every change; nothing merges without approval.
6. Secrets live in deployment settings, never in git.

## License and credit

Built on [AdventureLog](https://github.com/seanmorley15/AdventureLog) by Sean Morley, licensed under
the **GNU GPL v3** (see `LICENSE`). Modifications to AdventureLog code in this repository remain
under the GPL.

Contact: hola@kupurimedia.com

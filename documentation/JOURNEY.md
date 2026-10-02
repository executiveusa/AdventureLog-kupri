# Querencia — Project Lock, journey and design lock

Status: locked 30 Sep 2026. Change this file before changing the site's job, journey or look.

## Project lock

| | |
|---|---|
| Mode | Brownfield (`web/`, Next.js 15) |
| Site type | Service + portfolio hybrid. Dominant intent: a traveller planning a trip |
| Outcome | Qualified trip enquiries that reach a person on WhatsApp |
| Audience | Mexican and international adults planning a premium, custom trip in central Mexico or Vallarta; Spanish first |
| Primary action | **Armar mi viaje** → 4 questions → WhatsApp opens with the answers (lead also saved server-side when configured) |
| Secondary | Gift a surprise journey (same form, `¿Es regalo?` switch) · portfolio case study (footer only) |
| Offer | A route built with you from real places, revealed stop by stop (or as a surprise gift) |
| Proof we can show | Real places with their official/venue/reference source. No clients, reviews, prices or partners yet — none are claimed |
| Must not change | Truth rules (below); the birthday surprise stays private |
| Success metric | Completed form submissions (WhatsApp handoffs) per visit |

Job statement: *When* someone wants a special trip near Mexico City or on the Pacific, *they need* someone
to shape it around them *because* planning it well takes local knowledge, *but* generic packages feel
impersonal, *so* they can simply show up and enjoy it.

## The journey (pruned)

```
Film (5 scenes, native scroll)  →  Así funciona (3 steps)  →  Lugares (index with sources)
      →  Armar mi viaje (the form, the only primary CTA)  →  footer (credit, caso, English)
```

| Beat | Visitor question | Answer on screen |
|---|---|---|
| Film 1 — CDMX dawn | What is this? | "Viajes a la medida por México" + "Tu viaje por México, revelado paso a paso." Header CTA visible from the first frame |
| Film 2–5 — Tepoz, Morelos waters, Valle, Pacífico | Is it for me? | One real place per scene, plain names (no clickable-looking pills) |
| Film end | What now? | "¿A dónde se te antoja ir?" → **Armar mi viaje** |
| Así funciona | How does it work? | Nos cuentas → te armamos la ruta → la vas descubriendo (gift demo link) |
| Lugares | Is it real? | Place index, each row links its source; one "sources checked on" note |
| Armar mi viaje | Act | Regions, when, how many, budget (MXN in ES, USD in EN), gift switch, name, WhatsApp/email |
| Confirmation | Did it work? | Honest saved / not-saved state; WhatsApp already open with the answers |

Removed: the 9-card placeholder wall, the separate gift section, the gift form duplicate, the
free-text note field, the scroll hint and route dots on phones, the scene number chrome.

## Evidence ledger

| Claim | Status | Public? |
|---|---|---|
| Places exist, with linked sources | VERIFIED (29 Sep 2026) | Yes |
| Marietas visited only with Conanp-permitted operators | VERIFIED (gob.mx) | Yes |
| Custom trips, reveal stop by stop, gift mode | USER PROVIDED (the offer) | Yes, as the offer |
| Prices, reviews, partners, response times, clients | MISSING PROOF | No |
| Journey images depict specific venues | FALSE (illustration / generated) | Labelled as such |

## Reference ledger

| Reference | Principle taken | Not copied |
|---|---|---|
| Apple iPhone product page (refero style `a73148b9`) | White gallery canvas, #f5f5f7-style bands, SF type with tight tracking, one accent reserved for action, 28px media radius, no shadows, no gradients outside imagery | Product-render layouts, blue, Apple copy |
| Apple (dark "theater" pages) | Cinema register for the film, then a clean return to white | Hardware staging |
| BREATHE International journey | Scroll-scrub engine, honest lead API | Its palette and copy |

## Design lock

- **Registers:** Cine (film: near-black, poster/clip imagery, light type) → Galería (white canvas, warm mist bands).
- **Type:** SF Pro on Apple devices via `-apple-system`; Inter (self-hosted) everywhere else. One family.
  Display 600, tracking −0.02em; body 17px/1.47; labels ≥14px; inputs ≥17px (no iOS zoom).
- **Colour:** ink `#1d1d1f`, slate `#6e6e73`, hairline `#d2d2d7`, canvas `#ffffff`, mist `#f5f3ef` (warm),
  accent *barro* `#b4471f` — only for the primary button and links.
- **Shape:** buttons fully rounded, inputs 12px, media 28px, no shadows.
- **Motion:** the film is the one signature motion. Elsewhere only press feedback (scale .97, 120ms) and
  the gift-demo reveal. No new animation library (motion-saturation rule). Reduced motion: posters only.
- **Header:** acknowledges scroll — dark translucent over the film, light translucent over the gallery.

## Mobile contract

- Supported from 320×568 (small Android) up; tested at 320, 360, 375, 390, 414, 430, 768, 1024, 1440.
- The header CTA fits at 320px; the language switch collapses to "EN"/"ES".
- Every control ≥44×44 after transforms; place rows ≥56px tall and fully tappable.
- Safe-area insets on the header and footer; `dvh` for the film copy.
- No horizontal overflow; no text over the scroll hint (the hint is hidden on phones).

## Language

Spanish (Mexico) is the default for every visitor without a saved choice; English is a separate,
complete version at `/en`. Spanish copy is written in natural Mexican usage (tú, "platícanos",
"se te antoja", "Tepoz", "Cuerna"), elegant rather than slangy. No machine translation.

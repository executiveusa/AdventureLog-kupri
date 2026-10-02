# JCodeMunch Index - AdventureLog/Querencia

## Project Overview

**Type:** SvelteKit frontend + Django backend (backend not in repo)
**Brand:** Querencia - Eco-luxury travel experiences in Latin America
**Framework:** SvelteKit 2.x, Svelte 4.x, Tailwind CSS, DaisyUI

## Architecture

```
/frontend                   # SvelteKit app
├── src/
│   ├── routes/            # SvelteKit file-based routing
│   ├── lib/               # Shared components & utilities
│   ├── locales/           # i18n JSON files (19 languages)
│   └── hooks.server.ts    # Auth/theme/i18n middleware
├── static/                # Static assets
└── package.json           # Node dependencies

/backend (not in repo)     # Django REST API (referenced externally)
```

## Key Files Quick Reference

### Entry Points
| File | Purpose |
|------|---------|
| `/frontend/src/routes/+page.svelte` | **MAIN HOMEPAGE** - 2049-line cinematic Querencia landing |
| `/frontend/src/routes/+layout.svelte` | Root layout with Navbar, Toast, ChatWindow |
| `/frontend/src/routes/+layout.server.ts` | User/locale server-side data |
| `/frontend/src/hooks.server.ts` | Auth hook, theme hook, i18n hook |

### Homepage Features (routes/+page.svelte)
- **Jungle Intro Sequence:** dark -> crack -> dawn -> done phases
- **GLSL WebGL Atmosphere:** Real-time animated background canvas
- **Lenis + GSAP ScrollTrigger:** Smooth scroll with animations
- **Horizontal Carousel:** 9 Latin American destinations
- **Eco Bento Cards:** Sustainability messaging
- **Sound FX + Haptics:** Immersive feedback
- **Auth Flow:** Login/Signup integrated
- **9 Destinations:** Cenote Ik Kil, Palenque, Hierve el Agua, Sierra Norte, Barichara, Parque Tayrona, Valle Sagrado, Monteverde, Teotihuacan

### Route Structure
| Route | Description |
|-------|-------------|
| `/` | Cinematic Querencia landing |
| `/login` | Login page |
| `/signup` | Registration |
| `/dashboard` | User dashboard (auth required) |
| `/collections` | Trip collections |
| `/collections/[id]` | Collection detail |
| `/locations` | Saved locations |
| `/locations/[id]` | Location detail |
| `/map` | Full map view |
| `/globe` | 3D globe visualization |
| `/calendar` | Calendar view |
| `/worldtravel` | World travel tracker |
| `/users` | User directory |
| `/profile/[uuid]` | User profile |
| `/settings` | User settings |
| `/search` | Search functionality |
| `/blog` | Blog posts |
| `/pricing` | Pricing page |
| `/surprise/birthday` | **Birthday surprise feature** (separate from main site) |
| `/surprise/experience/[slug]` | Surprise experience reveal |

### Component Library (/frontend/src/lib/components/)

**Core Components:**
- `Navbar.svelte` - Main navigation with search, theme, locale
- `Toast.svelte` - Toast notifications
- `ChatWindow.svelte` - Chat/support window
- `Avatar.svelte` - User avatar component
- `Footer.svelte` - Site footer
- `AboutModal.svelte` - About modal

**Cards (/lib/components/cards/):**
- `LocationCard.svelte` - Location preview card
- `CollectionCard.svelte` - Collection preview
- `TransportationCard.svelte` - Transport card
- `LodgingCard.svelte` - Lodging card
- `NoteCard.svelte` - Note card
- `ChecklistCard.svelte` - Checklist card
- `CountryCard.svelte` - Country card
- `CityCard.svelte` - City card
- `RegionCard.svelte` - Region card
- `UserCard.svelte` - User card
- `ActivityCard.svelte` - Activity card
- `TrailCard.svelte` - Trail card
- `WandererCard.svelte` - Wanderer integration card
- `AttachmentCard.svelte` - File attachment card

**Location Components (/lib/components/locations/):**
- `LocationModal.svelte` - Create/edit location
- `LocationDetails.svelte` - Location detail view
- `LocationMedia.svelte` - Location images/media
- `LocationVisits.svelte` - Location visits list
- `LocationQuickStart.svelte` - Quick add location

**Collection Components (/lib/components/collections/):**
- `CollectionAllItems.svelte` - All items view
- `CollectionItineraryPlanner.svelte` - Itinerary planning
- `CollectionMap.svelte` - Collection map view
- `CollectionStats.svelte` - Collection statistics
- `ItineraryDayPickModal.svelte` - Day picker
- `ItineraryLinkModal.svelte` - Link items modal

**Map Components (/lib/components/map/):**
- `FullMap.svelte` - Full-screen map
- `MapStyleSelector.svelte` - Map style picker
- `ClusterMap.svelte` - Clustered markers map

**Globe Component:**
- `/lib/components/globe/GlobeViewer.svelte` - 3D WebGL globe

**Surprise System (/lib/surprise/):**
- `SurpriseRevealFlow.svelte` - Multi-step reveal
- `LanguageBlock.svelte` - Bilingual content
- `PasswordUnlockModal.svelte` - Password protection
- `StepCard.svelte` - Step card component
- `useSurpriseProgress.ts` - Progress state
- `itinerary/cuernavaca-sacred.json` - Example itinerary

### Utilities (/frontend/src/lib/)

| File | Purpose |
|------|---------|
| `index.ts` | Utils: quotes, backgrounds, date grouping, themes, map styles |
| `index.server.ts` | Server utils: CSRF token fetch |
| `types.ts` | TypeScript types for all data models |
| `dateUtils.ts` | Date/timezone utilities |
| `toasts.ts` | Toast notification system |
| `config.ts` | App configuration |
| `money.ts` | Currency formatting |
| `utils/sound.ts` | Audio playback (click, hover, success, whoosh, ambient) |
| `utils/haptic.ts` | Haptic feedback (tap, click, heavy) |
| `utils/resolveThemeColor.ts` | Theme color resolution |

### TypeScript Types (/frontend/src/lib/types.ts)

Core data types:
- `User` - User profile data
- `Location` - Places/destinations
- `Collection` - Trip collections
- `Transportation` - Transport records
- `Lodging` - Accommodation
- `Note` - Trip notes
- `Checklist` / `ChecklistItem` - Packing lists
- `Visit` - Location visits
- `Activity` - Activities/trails
- `Country`, `Region`, `City` - Geographic data
- `Category` - Location categories
- `Attachment` - File attachments
- `Trail` - Hiking trails
- `CollectionItineraryItem` - Itinerary items
- `Recommendation` - Place recommendations

### API Proxy Routes

| Route | Purpose |
|-------|---------|
| `/api/[...path]/+server.ts` | Proxy to Django /api/* |
| `/auth/[...path]/+server.ts` | Proxy to Django /auth/* |
| `/activities/+server.ts` | Activities endpoint |
| `/immich/[key]/+server.ts` | Immich image proxy |
| `/surprise/itinerary/[...path]/+server.ts` | Surprise itinerary data |

### Internationalization

**19 Languages Supported:**
en, es, fr, de, it, zh, nl, sv, pl, ko, no, ru, ja, ar, pt-br, sk, tr, uk, hu

**Default:** Spanish (es) - Mexican market focus
**Locale Files:** `/frontend/src/locales/*.json`

### Theming

**Available Themes (DaisyUI):**
- light, dark, dim, night, forest, aqua
- aestheticLight, aestheticDark, northernLights

### External Integrations

| Service | Purpose |
|---------|---------|
| Immich | Self-hosted photo management |
| Strava | Activity tracking import |
| Wanderer | Trail data integration |
| MapLibre | Maps |
| GSAP | Animations |
| Lenis | Smooth scroll |
| Three.js | 3D globe |

### Build Configuration

| File | Purpose |
|------|---------|
| `vercel.json` | Build commands, redirects |
| `svelte.config.js` | Svelte/adapter config |
| `vite.config.ts` | Vite + unplugin-icons |
| `tailwind.config.js` | Tailwind + DaisyUI |
| `postcss.config.js` | PostCSS config |

### Redirects (vercel.json)
- `/birthday` -> `/surprise/birthday`
- `/birthday.html` -> `/surprise/birthday`
- `/surprise/yvette-cuernavaca` -> `/surprise/experience/cuernavaca-sacred`

---

## Status Notes

**Why Birthday Page Might Show:**
1. Navigated to `/birthday` or `/surprise/birthday` (redirects exist)
2. Browser cached that URL
3. Direct link shared

**Homepage IS the cinematic Querencia landing** - 2049 lines of WebGL, GSAP, Lenis, horizontal scroll, eco-messaging.

**Backend:** Django not in this repo. Set `PUBLIC_SERVER_URL` env var to connect. Works standalone without it (no auth).

**To Run Preview:**
```bash
cd frontend && npm install && npm run dev -- --host --port 3000
```

---

## Scaling & Monetization Strategy (for reference)

### Handle High Traffic (100k+ concurrent users)

**Frontend:**
1. Vercel Edge Network - automatic CDN
2. Static generation for marketing pages
3. ISR for dynamic content
4. Image optimization via Vercel Image Optimization

**Backend (Django):**
1. Gunicorn + multiple workers
2. Redis for session/cache
3. PostgreSQL read replicas
4. Celery for async tasks
5. Consider: AWS ECS/EKS, or Railway.app for Django

**Database:**
- Supabase PostgreSQL or Neon for serverless scale
- Connection pooling (PgBouncer)
- CDN for static assets (Cloudflare/Bunny)

### Monetization Options

1. **Subscription Tiers:**
   - Free: Basic trip planning
   - Pro ($9/mo): Unlimited collections, AI recommendations
   - Team ($19/mo): Collaboration, shared itineraries

2. **Commission Model:**
   - Partner bookings through affiliate links
   - Eco-lodge partnerships (10-15% commission)
   - Experience bookings

3. **Premium Features:**
   - PDF itinerary export
   - Offline access
   - Priority support
   - Custom domains

4. **B2B:**
   - Travel agency white-label
   - DMO partnerships
   - Corporate travel management

---

*Last updated: v0 analysis*

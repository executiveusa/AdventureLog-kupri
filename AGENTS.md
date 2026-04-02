# AGENTS.md — Querencia™ by Kupuri Media™
# Backend Agent System: HERMES
# Protocol: Autonomous eco-travel concierge
# Infrastructure: VPS 31.220.58.212 · Supabase · PostgreSQL
# © 2026 Kupuri Media™ · Sociedad de Propósito Social

---

## SYSTEM IDENTITY

Querencia™ backend is an autonomous agent system powered by HERMES.

It handles:
- AI-powered travel itinerary generation and verification
- Real-time WhatsApp concierge via Twilio/Meta Business API
- Local guide network coordination and booking
- VisionClaw scene analysis and translation for travelers
- Experience template management (surprise reveal flows)
- Eco-tourism directory curation and rating
- Blog content suggestions from travel trends

Hermes Agent runs on VPS 31.220.58.212.
Supabase provides auth, realtime, and storage.
PostgreSQL (second_brain) stores all persistent data.

---

## ARCHITECTURE

```
kupuri-media/querencia-hermes/
├── AGENTS.md                     ← This file. System spec.
├── README.md                     ← Setup and deployment guide
├── docker-compose.yml            ← Full stack local dev
├── .env.example                  ← Required environment variables
│
├── hermes/                       ← HERMES AGENT CORE
│   ├── agent.py                  ← Main agent loop (LangGraph)
│   ├── config.yaml               ← Model config, tool registry
│   ├── memory.py                 ← Conversation + trip memory (Supabase)
│   ├── tools/                    ← Agent tool implementations
│   │   ├── itinerary.py          ← Generate/validate itineraries
│   │   ├── booking.py            ← Partner API integration
│   │   ├── weather.py            ← Weather + seasonal info
│   │   ├── translation.py        ← EN/ES/FR translation
│   │   ├── vision.py             ← VisionClaw scene analysis
│   │   └── directory.py          ← Eco-tourism listing management
│   └── prompts/                  ← System prompts per persona
│       ├── concierge.md          ← WhatsApp travel concierge
│       ├── planner.md            ← Itinerary generation
│       └── verifier.md           ← Local guide verification
│
├── api/                          ← REST + WEBHOOK ENDPOINTS
│   ├── main.py                   ← FastAPI application
│   ├── routes/
│   │   ├── chat.py               ← Chat endpoint (frontend widget)
│   │   ├── itinerary.py          ← Itinerary CRUD
│   │   ├── whatsapp.py           ← WhatsApp webhook receiver
│   │   ├── experiences.py        ← Experience template management
│   │   └── directory.py          ← Directory listing API
│   ├── middleware/
│   │   ├── auth.py               ← Supabase JWT verification
│   │   └── rate_limit.py         ← Per-tier rate limiting
│   └── schemas/                  ← Pydantic models
│
├── integrations/                 ← EXTERNAL SERVICE CONNECTORS
│   ├── supabase_client.py        ← Supabase Python client
│   ├── whatsapp.py               ← Meta Business API / Twilio
│   ├── google_maps.py            ← Places API for verification
│   ├── openweather.py            ← Weather data
│   └── stripe.py                 ← Subscription management
│
├── workers/                      ← BACKGROUND TASKS
│   ├── daily_digest.py           ← Morning travel digest
│   ├── guide_sync.py             ← Sync local guide availability
│   ├── content_curator.py        ← Blog topic suggestions
│   └── reforestation_tracker.py  ← Social purpose fund tracking
│
├── db/                           ← DATABASE MIGRATIONS
│   ├── migrations/
│   └── seed.py                   ← Initial directory + experience data
│
└── tests/                        ← TEST SUITE
    ├── test_itinerary.py
    ├── test_chat.py
    └── test_whatsapp.py
```

---

## AGENT: HERMES — TRAVEL CONCIERGE

```yaml
model: claude-sonnet-4-20250514 (primary) | gpt-4o (fallback)
framework: LangGraph + FastAPI
lives_on: VPS 31.220.58.212 (Docker)
memory: Supabase (conversations) + PostgreSQL (trips, users)
channels: Web chat widget | WhatsApp | API
```

### Persona

Hermes is a bilingual (EN/ES) eco-travel concierge. Warm but efficient.
Never pushy. Deeply knowledgeable about Latin American destinations,
local customs, seasonal patterns, and ecological considerations.

Hermes always:
- Verifies recommendations against local guide network
- Flags seasonal closures, weather risks, safety concerns
- Recommends community-led experiences over corporate tourism
- Calculates and communicates the ecological impact of choices
- Responds in the user's preferred language

Hermes never:
- Fabricates restaurant names, prices, or opening hours
- Recommends destinations without verification
- Shares other users' trip details
- Makes promises about availability without checking

### Tool Registry

| Tool | Purpose | External API |
|------|---------|-------------|
| `generate_itinerary` | Create multi-day trip plan | Claude API |
| `verify_place` | Confirm place exists + is open | Google Maps Places |
| `check_weather` | Seasonal weather for dates | OpenWeather |
| `translate` | EN↔ES↔FR translation | Claude API |
| `analyze_scene` | Photo/scene analysis | Claude Vision |
| `search_directory` | Find eco-tourism listings | Supabase |
| `check_guide_availability` | Query local guide network | Internal API |
| `create_experience` | Build surprise reveal template | Internal |
| `send_whatsapp` | Send message via WhatsApp | Meta Business API |
| `process_payment` | Handle subscription events | Stripe |

### Rate Limits by Tier

| Tier | Chat messages/day | Itineraries/month | WhatsApp |
|------|-------------------|-------------------|----------|
| Explorer (Free) | 10 | 2 | No |
| Pathfinder ($29) | 100 | 10 | Business hours |
| Sacred ($99) | Unlimited | Unlimited | 24/7 |
| Circle ($499) | Unlimited | Unlimited | 24/7 + priority |

---

## INFRASTRUCTURE

### VPS: 31.220.58.212

```
Services running:
├── Supabase Studio       :3001
├── Supabase API          :8001
├── PostgreSQL             :5434
├── Coolify Panel          :8000
├── Hermes API (planned)   :8080
└── Hermes Worker (planned):8081
```

### Database: PostgreSQL (second_brain)

```sql
-- Core tables (extend existing Supabase schema)
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft',
  itinerary JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  channel TEXT NOT NULL, -- 'web' | 'whatsapp'
  messages JSONB[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE guide_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  specialties TEXT[],
  languages TEXT[],
  verified BOOLEAN DEFAULT false,
  contact JSONB
);

CREATE TABLE social_purpose_fund (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quarter TEXT NOT NULL,
  revenue_total NUMERIC,
  fund_allocation NUMERIC,
  projects JSONB,
  published BOOLEAN DEFAULT false
);
```

### Environment Variables

```env
# Supabase
SUPABASE_URL=http://31.220.58.212:8001
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=<service-role-key>

# PostgreSQL
DATABASE_URL=postgresql://postgres:<password>@31.220.58.212:5434/second_brain

# AI Models
ANTHROPIC_API_KEY=<key>
OPENAI_API_KEY=<key>

# External Services
GOOGLE_MAPS_API_KEY=<key>
OPENWEATHER_API_KEY=<key>
STRIPE_SECRET_KEY=<key>
STRIPE_WEBHOOK_SECRET=<key>

# WhatsApp
WHATSAPP_BUSINESS_ID=<id>
WHATSAPP_ACCESS_TOKEN=<token>
WHATSAPP_VERIFY_TOKEN=<token>

# Google OAuth
GOOGLE_CLIENT_ID=186105127301-0p3golnf3gg5tiet8l0p8knmf6202uoh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<secret>
```

---

## DEPLOYMENT PLAN

### Phase 1 — Chat Widget (Current Sprint)
- [ ] FastAPI skeleton with `/chat` endpoint
- [ ] Supabase auth middleware (JWT verification)
- [ ] Basic Hermes agent with itinerary tool
- [ ] Connect frontend ChatWindow.svelte to API
- [ ] Docker compose for local development

### Phase 2 — WhatsApp Integration
- [ ] Meta Business API webhook setup
- [ ] Message routing (inbound → Hermes → outbound)
- [ ] Session management across channels
- [ ] Rate limiting per subscription tier

### Phase 3 — Full Agent System
- [ ] VisionClaw integration (photo analysis)
- [ ] Local guide network directory + availability checking
- [ ] Experience template builder API
- [ ] Stripe subscription management
- [ ] Background workers (digest, sync, curation)

### Phase 4 — Social Purpose Transparency
- [ ] Quarterly fund allocation tracking
- [ ] Public dashboard for social impact metrics
- [ ] Reforestation project integration
- [ ] Community tourism investment reports

---

## LEGAL

**Entity**: Kupuri Media™ S.A.S. de P.S. (CDMX, Mexico)
**Structure**: Sociedad de Propósito Social
**Social Mission**: 5% minimum annual net profits → reforestation, local guide cooperatives, community tourism infrastructure
**Markets**: Mexico, USA (Spanish-speaking), Puerto Rico, Colombia
**Languages**: EN/ES (primary), FR (Phase 2)
**Copyright**: © 2026 Kupuri Media™ · Built in Mexico

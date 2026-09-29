import { NextResponse } from "next/server"
import { z } from "zod"

// Public lead intake. Validates, rate-limits and forwards the enquiry to a server-only
// webhook (n8n, Make, a Supabase edge function...). The browser never sees the secret.
// Without a configured webhook it says so (503) and the client falls back to WhatsApp —
// it never pretends a lead was saved.

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  contact: z.string().trim().min(3).max(160),
  regions: z.array(z.enum(["cdmx", "morelos", "valle", "vallarta"])).max(4).default([]),
  dates: z.string().trim().max(120).optional(),
  group: z.enum(["1-2", "3-6", "7-12", "13+"]).optional(),
  budget: z.enum(["lt5k", "5-10k", "10-25k", "25k+", "talk"]).optional(),
  message: z.string().trim().max(1000).optional(),
  source: z.enum(["trip", "gift", "portfolio"]).default("trip"),
  locale: z.enum(["es", "en"]).default("es"),
  // Honeypot: real people never fill this.
  company: z.string().max(0).optional(),
})

const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5
const hits = new Map<string, number[]>()

function rateLimited(key: string) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > RATE_MAX
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 })
  }

  const parsed = leadSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  // Drop the honeypot before forwarding.
  const { company, ...lead } = parsed.data
  void company

  const webhookUrl = process.env.LEAD_WEBHOOK_URL
  const webhookSecret = process.env.LEAD_WEBHOOK_SECRET
  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "lead_backend_not_configured" }, { status: 503 })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${webhookSecret}` },
      body: JSON.stringify({
        ...lead,
        channel: lead.contact.includes("@") ? "email" : "whatsapp",
        site: "querencia",
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) {
      console.error("lead webhook failed", response.status)
      return NextResponse.json({ ok: false, error: "lead_backend_error" }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("lead webhook unreachable", error)
    return NextResponse.json({ ok: false, error: "lead_backend_unreachable" }, { status: 502 })
  }
}

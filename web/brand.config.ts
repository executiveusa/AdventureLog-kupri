// One file per client. Everything brand-specific the app reads lives here; values that
// differ per deployment (numbers, names, URLs) come from env so no code change is needed.

export const LOCALES = ["es", "en"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "es"

// Placeholder until the owner sets NEXT_PUBLIC_WHATSAPP_NUMBER. The UI flags it.
const WHATSAPP_PLACEHOLDER = "520000000000"

export const BRAND = {
  name: "Querencia",
  studio: "Kupuri Media",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP_PLACEHOLDER,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hola@kupurimedia.com",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // The creative strategist credited for concept, strategy and art direction.
  // Left empty until the owner sets it: we never guess a person's name.
  credit: {
    name: process.env.NEXT_PUBLIC_CREDIT_NAME || "",
    url: process.env.NEXT_PUBLIC_CREDIT_URL || "",
  },
  colors: {
    ink: "#15120f",
    paper: "#f3ede4",
    accent: "#c4704f", // cantera rose
    thermal: "#2f6f6a",
  },
} as const

export const isWhatsAppPlaceholder = BRAND.whatsappNumber === WHATSAPP_PLACEHOLDER

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

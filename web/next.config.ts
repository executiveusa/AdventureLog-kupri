import type { NextConfig } from "next"

// When web/ replaces the legacy app, the private birthday surprise stays wherever the
// legacy frontend is hosted. Set LEGACY_BIRTHDAY_URL to keep the old /birthday links working.
const legacyBirthday = process.env.LEGACY_BIRTHDAY_URL

// A production deploy without the real WhatsApp number would send every lead to a
// placeholder. Fail that build loudly instead (previews and local builds still work).
if (process.env.VERCEL_ENV === "production" && !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
  throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER must be set for a production deploy of Querencia.")
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    if (!legacyBirthday) return []
    return ["/birthday", "/birthday.html", "/surprise/:path*"].map((source) => ({
      source,
      destination: legacyBirthday,
      permanent: false,
    }))
  },
}

export default nextConfig

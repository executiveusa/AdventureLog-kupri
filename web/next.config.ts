import type { NextConfig } from "next"

// When web/ replaces the legacy app, the private birthday surprise stays wherever the
// legacy frontend is hosted. Set LEGACY_BIRTHDAY_URL to keep the old /birthday links working.
const legacyBirthday = process.env.LEGACY_BIRTHDAY_URL

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

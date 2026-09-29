import { NextResponse, type NextRequest } from "next/server"

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/brand.config"

// Every page lives under /es or /en. A path without a locale is redirected: the visitor's
// saved choice first, then their browser language, then Spanish.
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("lang")?.value
  if (isLocale(saved)) return saved
  const accept = request.headers.get("accept-language") ?? ""
  for (const part of accept.split(",")) {
    const code = part.split(";")[0]?.trim().slice(0, 2).toLowerCase()
    if (isLocale(code)) return code
  }
  return DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const first = pathname.split("/")[1]
  if (isLocale(first)) {
    const response = NextResponse.next()
    if (request.cookies.get("lang")?.value !== first) {
      response.cookies.set("lang", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" })
    }
    return response
  }
  const url = request.nextUrl.clone()
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`
  url.search = search
  return NextResponse.redirect(url)
}

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, the engine...).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}

import { NextResponse, type NextRequest } from "next/server"

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/brand.config"

// Every page lives under /es or /en. Spanish comes first: a path without a locale goes to
// Spanish unless the visitor already chose English (saved in the `lang` cookie).
function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("lang")?.value
  return isLocale(saved) ? saved : DEFAULT_LOCALE
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

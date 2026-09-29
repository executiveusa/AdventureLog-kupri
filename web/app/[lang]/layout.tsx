import type { Metadata, Viewport } from "next"
import { Fraunces, Instrument_Sans } from "next/font/google"
import { notFound } from "next/navigation"

import { BRAND, isLocale, LOCALES } from "@/brand.config"
import { getDictionary } from "@/content/i18n"

import "../globals.css"

// Self-hosted at build time by next/font (no runtime request to Google).
const display = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], style: ["normal", "italic"], variable: "--font-display" })
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" })

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = getDictionary(lang)
  return {
    metadataBase: new URL(BRAND.siteUrl),
    title: { default: dict.meta.title, template: `%s · ${BRAND.name}` },
    description: dict.meta.description,
    alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en" } },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === "es" ? "es_MX" : "en_US",
      type: "website",
      images: ["/media/journey/posters/cdmx.svg"],
    },
  }
}

export const viewport: Viewport = {
  themeColor: BRAND.colors.ink,
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}

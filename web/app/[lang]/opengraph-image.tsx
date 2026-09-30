import { ImageResponse } from "next/og"

import { isLocale } from "@/brand.config"
import { getDictionary } from "@/content/i18n"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Querencia"

// Share card: film-dark, the headline and the one action. PNG, since most apps ignore SVG.
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = getDictionary(isLocale(lang) ? lang : "es")
  const scene = dict.journey.scenes.cdmx
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(180deg, #3b2a3f 0%, #c9826b 55%, #0b0a09 100%)",
          color: "#f5f5f7",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 600, color: "#f0c09a" }}>{scene.eyebrow}</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, marginTop: 16, maxWidth: 980 }}>
          {scene.title}
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 30, fontWeight: 600 }}>Querencia</div>
      </div>
    ),
    size,
  )
}

// The scroll journey: one continuous trip from the Mexico City sky to the Pacific.
// Scene copy lives in the dictionaries; this file only wires media to scene ids.
// Every clip/poster is atmosphere (illustration or AI-generated) — never a specific venue.

import type { Dictionary } from "@/content/i18n"

export interface ScrollWorldSection {
  id: string
  label: string
  still?: string
  stillMobile?: string
  clip?: string
  clipMobile?: string
  accent: string
  scroll?: number
  linger?: number
  eyebrow: string
  title: string
  body: string
  tags?: string[]
  cta?: { primary?: { label: string; href: string }; secondary?: { label: string; href: string } }
}

export interface ScrollWorldConfig {
  hint?: string
  nav?: boolean
  atmosphere?: boolean
  diveScroll?: number
  crossfade?: number
  sections: ScrollWorldSection[]
  connectors: (string | null)[]
  connectorsMobile?: (string | null)[]
}

export const SCENE_IDS = ["cdmx", "tepoztlan", "aguas", "valle", "pacifico", "querencia"] as const
export type SceneId = (typeof SCENE_IDS)[number]

const ACCENT: Record<SceneId, string> = {
  // Light enough to read as eyebrow text on the dark copy layer.
  cdmx: "#e0906c",
  tepoztlan: "#b5c28f",
  aguas: "#86c9bb",
  valle: "#a9c3e0",
  pacifico: "#f0b98a",
  querencia: "#e0906c",
}

// Clips are added here once the media is generated (see documentation/PLAN.md step 7).
// Until then each scene shows its illustrated poster, which is also what visitors with
// reduced motion always see.
const MEDIA: Record<SceneId, { clip?: string; clipMobile?: string; still: string; stillMobile?: string }> = {
  cdmx: { still: "/media/journey/posters/cdmx.svg" },
  tepoztlan: { still: "/media/journey/posters/tepoztlan.svg" },
  aguas: { still: "/media/journey/posters/aguas.svg" },
  valle: { still: "/media/journey/posters/valle.svg" },
  pacifico: { still: "/media/journey/posters/pacifico.svg" },
  querencia: { still: "/media/journey/posters/querencia.svg" },
}

export function buildJourneyConfig(dict: Dictionary): ScrollWorldConfig {
  return {
    hint: dict.journey.hint,
    nav: false,
    atmosphere: false,
    diveScroll: 1.3,
    crossfade: 0.12,
    sections: SCENE_IDS.map((id, index) => {
      const copy = dict.journey.scenes[id]
      const last = index === SCENE_IDS.length - 1
      return {
        id,
        accent: ACCENT[id],
        ...MEDIA[id],
        ...(index === 0 ? { scroll: 1.6, linger: 0.35 } : {}),
        // One action at the end of the film: the same one the header offers.
        ...(last ? { scroll: 1.3, linger: 0.4, cta: { primary: { label: dict.journey.cta, href: "#armar" } } } : {}),
        ...copy,
      }
    }),
    connectors: [],
    connectorsMobile: [],
  }
}

"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"

import type { ScrollWorldConfig } from "@/content/journey"

declare global {
  interface Window {
    mountScrollWorld?: (container: HTMLElement, config: ScrollWorldConfig) => void
  }
}

// The journey starts as still, readable panels (server-rendered, so it works without
// JavaScript and is what visitors who prefer reduced motion keep). When motion is allowed,
// the panels are swapped for the vendored scroll-scrub film
// (public/scroll-world/scrub-engine.js, from executiveusa/pauli-scroll-world via BREATHE).
export function ScrollWorld({ config, label }: { config: ScrollWorldConfig; label: string }) {
  const [mode, setMode] = useState<"still" | "film">("still")
  const [engineLoaded, setEngineLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setMode("film")
  }, [])

  // The engine pins its layers with position:fixed; once the visitor scrolls past its track
  // we hide them so the gallery below reads normally. Classes are toggled on the node
  // directly because the engine adds its own (`sw-root`) to it.
  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current
    if (mode !== "film" || !container || !end) return
    let frame = 0
    const update = () => {
      frame = 0
      container.classList.toggle("q-world--past", end.getBoundingClientRect().top < window.innerHeight)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    if (engineLoaded && window.mountScrollWorld && !container.dataset.mounted) {
      container.dataset.mounted = "true"
      window.mountScrollWorld(container, config)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [mode, engineLoaded, config])

  if (mode === "still") {
    return (
      <div className="stills" aria-label={label}>
        {config.sections.map((s) => (
          <section key={s.id} className="still" style={{ backgroundImage: s.still ? `url(${s.still})` : undefined }}>
            <div className="still__copy">
              <p className="still__eyebrow" style={{ color: s.accent }}>
                {s.eyebrow}
              </p>
              <h2 className="still__title">{s.title}</h2>
              <p className="still__body">{s.body}</p>
              {s.tags && s.tags.length > 0 && (
                <ul className="still__tags">
                  {s.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              {s.cta?.primary && (
                <a href={s.cta.primary.href} className="btn btn--solid">
                  {s.cta.primary.label}
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <>
      <Script src="/scroll-world/scrub-engine.js" strategy="afterInteractive" onReady={() => setEngineLoaded(true)} />
      <div ref={containerRef} className="q-world" aria-label={label} />
      <div ref={endRef} aria-hidden />
    </>
  )
}

"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"

import type { ScrollWorldConfig } from "@/content/journey"

declare global {
  interface Window {
    mountScrollWorld?: (container: HTMLElement, config: ScrollWorldConfig) => void
  }
}

// Mounts the vendored scroll-world scrub engine (public/scroll-world/scrub-engine.js, from
// executiveusa/pauli-scroll-world via BREATHE International). The engine pins its layers
// with position:fixed; once the visitor scrolls past its track we hide those layers so the
// page sections below read normally. Classes are toggled on the node directly because the
// engine adds its own (`sw-root`) to it.
export function ScrollWorld({ config, label }: { config: ScrollWorldConfig; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [engineLoaded, setEngineLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current
    if (!container || !end) return
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
  }, [engineLoaded, config])

  return (
    <>
      <Script src="/scroll-world/scrub-engine.js" strategy="afterInteractive" onReady={() => setEngineLoaded(true)} />
      <div ref={containerRef} className="q-world" aria-label={label}>
        {/* Readable without JavaScript: the engine replaces this on mount. */}
        <noscript>
          <div className="q-noscript">
            {config.sections.map((s) => (
              <section key={s.id}>
                <p className="eyebrow">{s.eyebrow}</p>
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </noscript>
      </div>
      <div ref={endRef} aria-hidden />
    </>
  )
}

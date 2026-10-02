"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { BRAND, type Locale } from "@/brand.config"
import type { Dictionary } from "@/content/i18n"

function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es"
}

// Over the film the header is dark glass; once the white gallery reaches it, it turns light.
// `watch` names the element whose top edge marks that switch (the home page); other pages
// start light.
export function SiteHeader({ dict, path = "", watch }: { dict: Dictionary; path?: string; watch?: string }) {
  const locale = dict.locale
  const [tone, setTone] = useState<"dark" | "light">(watch ? "dark" : "light")

  useEffect(() => {
    if (!watch) return
    const target = document.getElementById(watch)
    if (!target) return
    const header = document.querySelector<HTMLElement>(".site-header")
    let frame = 0
    const update = () => {
      frame = 0
      const edge = header?.getBoundingClientRect().bottom ?? 52
      setTone(target.getBoundingClientRect().top <= edge ? "light" : "dark")
    }
    const onChange = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // The film sizes its track after the engine loads, which moves the gallery without a
    // scroll event — so also re-check whenever the page's height changes.
    const resize = new ResizeObserver(onChange)
    resize.observe(document.body)
    update()
    window.addEventListener("scroll", onChange, { passive: true })
    window.addEventListener("resize", onChange)
    return () => {
      resize.disconnect()
      window.removeEventListener("scroll", onChange)
      window.removeEventListener("resize", onChange)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [watch])

  return (
    <header className="site-header" data-tone={tone}>
      <div className="site-header__inner">
        <Link href={`/${locale}`} className="wordmark">
          {BRAND.name}
        </Link>
        <nav aria-label={dict.nav.main} className="site-header__nav">
          <Link
            href={`/${otherLocale(locale)}${path}`}
            hrefLang={otherLocale(locale)}
            lang={otherLocale(locale)}
            className="lang"
            aria-label={dict.nav.otherLocaleLabel}
          >
            {dict.nav.otherLocale}
          </Link>
          <a href={`/${locale}#armar`} className="btn btn--solid btn--small">
            {dict.nav.plan}
          </a>
        </nav>
      </div>
    </header>
  )
}

export function Credit({ dict }: { dict: Dictionary }) {
  const { name, url } = BRAND.credit
  const who = name || dict.footer.creditPending
  return (
    <p className="credit">
      {dict.caso.creditLabel}:{" "}
      {url ? (
        <a href={url} target="_blank" rel="noopener" className="link">
          {who}
        </a>
      ) : (
        <strong>{who}</strong>
      )}
    </p>
  )
}

export function SiteFooter({ dict, path = "" }: { dict: Dictionary; path?: string }) {
  const locale = dict.locale
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="wordmark">{BRAND.name}</p>
          <Credit dict={dict} />
          <p className="small muted">{dict.footer.truth}</p>
        </div>
        <ul className="footer-links">
          <li>
            <Link href={`/${locale}/regalo`}>{dict.footer.gift}</Link>
          </li>
          <li>
            <Link href={`/${locale}/caso`}>{dict.footer.caseStudy}</Link>
          </li>
          <li>
            <Link href={`/${otherLocale(locale)}${path}`} hrefLang={otherLocale(locale)} lang={otherLocale(locale)}>
              {dict.nav.otherLocaleLabel}
            </Link>
          </li>
          <li>
            <a href={`mailto:${BRAND.contactEmail}`}>
              {dict.footer.contact}: {BRAND.contactEmail}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

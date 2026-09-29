import Link from "next/link"

import { BRAND, type Locale } from "@/brand.config"
import type { Dictionary } from "@/content/i18n"

function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es"
}

export function SiteHeader({ dict, path = "" }: { dict: Dictionary; path?: string }) {
  const locale = dict.locale
  return (
    <header className="site-header">
      <Link href={`/${locale}`} className="wordmark">
        {BRAND.name}
      </Link>
      <nav aria-label={locale === "es" ? "Principal" : "Main"}>
        <Link href={`/${otherLocale(locale)}${path}`} hrefLang={otherLocale(locale)} className="pill">
          {dict.nav.otherLocale}
        </Link>
        <a href={`/${locale}#planear`} className="pill pill--solid">
          {dict.nav.plan}
        </a>
      </nav>
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

export function SiteFooter({ dict }: { dict: Dictionary }) {
  const locale = dict.locale
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="wordmark">{BRAND.name}</p>
          <Credit dict={dict} />
          <p className="muted small">{dict.footer.truth}</p>
        </div>
        <ul className="footer-links">
          <li>
            <Link href={`/${locale}/regalo`}>{dict.nav.gift}</Link>
          </li>
          <li>
            <Link href={`/${locale}/caso`}>{dict.nav.caseStudy}</Link>
          </li>
          <li>
            {dict.footer.contact}: <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

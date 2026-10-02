import type { Metadata } from "next"
import Link from "next/link"

import type { Locale } from "@/brand.config"
import { Credit, SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { getDictionary } from "@/content/i18n"

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ embed?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)
  return { title: dict.caso.title, description: dict.caso.intro, alternates: { canonical: `/${lang}/caso` } }
}

// Case study for the creative strategist's portfolio. `?embed=1` renders a compact card
// meant to be iframed on her profile page.
export default async function CaseStudyPage({ params, searchParams }: Props) {
  const { lang } = (await params) as { lang: Locale }
  const { embed } = await searchParams
  const dict = getDictionary(lang)

  if (embed === "1") {
    return (
      <main className="embed gallery">
        <div className="embed__art" aria-hidden />
        <div className="embed__body">
          <p className="eyebrow">{dict.caso.eyebrow}</p>
          <h1 className="embed__title">{dict.caso.embedTitle}</h1>
          <p className="small muted">{dict.caso.intro}</p>
          <Credit dict={dict} />
          <a href={`/${lang}`} target="_blank" rel="noopener" className="btn btn--solid">
            {dict.caso.visit} ↗
          </a>
        </div>
      </main>
    )
  }

  return (
    <>
      <SiteHeader dict={dict} path="/caso" />
      <main className="page gallery">
        <section className="section section--top wrap narrow">
          <p className="eyebrow">{dict.caso.eyebrow}</p>
          <h1 className="display">{dict.caso.title}</h1>
          <p className="lede muted">{dict.caso.intro}</p>
          <Credit dict={dict} />
          <ol className="case-steps">
            {dict.caso.sections.map((section, index) => (
              <li key={section.title}>
                <span className="case-steps__n">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p className="muted">{section.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href={`/${lang}`} className="btn btn--solid">
            {dict.caso.visit}
          </Link>
        </section>
        <SiteFooter dict={dict} path="/caso" />
      </main>
    </>
  )
}

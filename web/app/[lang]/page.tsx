import Link from "next/link"

import type { Locale } from "@/brand.config"
import { LeadForm } from "@/components/LeadForm"
import { ScrollWorld } from "@/components/ScrollWorld"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { getDictionary } from "@/content/i18n"
import { buildJourneyConfig } from "@/content/journey"
import { PLACES, REGIONS } from "@/content/places"

// The journey, in order: film → how it works → real places → the form. One primary action.
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)

  return (
    <>
      <a href="#armar" className="skip">
        {dict.nav.skip}
      </a>
      <SiteHeader dict={dict} watch="galeria" />
      <main>
        <h1 className="sr-only">{dict.meta.title}</h1>
        <ScrollWorld config={buildJourneyConfig(dict)} label={dict.journey.label} />

        <div id="galeria" className="gallery">
          <section id="como" className="section" aria-labelledby="como-title">
            <div className="wrap">
              <p className="eyebrow">{dict.how.eyebrow}</p>
              <h2 id="como-title" className="display">
                {dict.how.title}
              </h2>
              <ol className="steps">
                {dict.how.steps.map((step, index) => (
                  <li key={step.title}>
                    <span className="steps__n" aria-hidden>
                      {index + 1}
                    </span>
                    <h3>{step.title}</h3>
                    <p className="muted">{step.body}</p>
                  </li>
                ))}
              </ol>
              <Link href={`/${lang}/regalo`} className="link link--arrow">
                {dict.how.demo}
              </Link>
            </div>
          </section>

          <section id="lugares" className="section section--mist" aria-labelledby="lugares-title">
            <div className="wrap">
              <p className="eyebrow">{dict.places.eyebrow}</p>
              <h2 id="lugares-title" className="display">
                {dict.places.title}
              </h2>
              <p className="lede muted">{dict.places.intro}</p>
              <div className="regions">
                {REGIONS.map((region) => (
                  <div key={region.id} className="region">
                    <h3 className="region__name">{region.name[lang]}</h3>
                    <ul className="places">
                      {PLACES.filter((p) => p.region === region.id).map((place) => (
                        <li key={place.id}>
                          <a href={place.link.href} target="_blank" rel="noopener noreferrer" className="place">
                            <span className="place__text">
                              <span className="place__name">{place.name}</span>
                              <span className="place__blurb">{place.blurb[lang]}</span>
                            </span>
                            <span className="place__source">{dict.places.linkKinds[place.link.kind]}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="small muted">{dict.places.checked}</p>
            </div>
          </section>

          <section id="armar" className="section" aria-labelledby="armar-title">
            <div className="wrap narrow">
              <p className="eyebrow">{dict.form.eyebrow}</p>
              <h2 id="armar-title" className="display">
                {dict.form.title}
              </h2>
              <p className="lede muted">{dict.form.intro}</p>
              <LeadForm dict={dict} />
            </div>
          </section>

          <SiteFooter dict={dict} />
        </div>
      </main>
    </>
  )
}

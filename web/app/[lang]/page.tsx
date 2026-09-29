import Link from "next/link"

import type { Locale } from "@/brand.config"
import { LeadForm } from "@/components/LeadForm"
import { ScrollWorld } from "@/components/ScrollWorld"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { getDictionary } from "@/content/i18n"
import { buildJourneyConfig } from "@/content/journey"
import { PLACES, REGIONS } from "@/content/places"

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)
  const config = buildJourneyConfig(dict)

  return (
    <>
      <a href="#planear" className="skip">
        {dict.nav.skip}
      </a>
      <SiteHeader dict={dict} />
      <main>
        <ScrollWorld config={config} label={dict.meta.title} />

        <div className="after-world">
          <section id="lugares" className="section wrap">
            <p className="eyebrow">{dict.places.eyebrow}</p>
            <h2 className="display">{dict.places.title}</h2>
            <p className="lede muted">{dict.places.intro}</p>

            {REGIONS.map((region) => (
              <div key={region.id} className="region">
                <h3 className="region__name">{region.name[lang]}</h3>
                <ul className="places">
                  {PLACES.filter((p) => p.region === region.id).map((place) => (
                    <li key={place.id} className="place" data-region={place.region}>
                      <div className="place__art" aria-hidden>
                        <span className="tag">{dict.places.photoLabels[place.photo]}</span>
                      </div>
                      <div className="place__body">
                        <h4>{place.name}</h4>
                        <p className="small muted">{place.town}</p>
                        <p>{place.blurb[lang]}</p>
                        <p className="small">
                          <a href={place.link.href} target="_blank" rel="noopener noreferrer" className="link">
                            {dict.places.linkKinds[place.link.kind]} ↗
                          </a>
                          <span className="muted">
                            {" "}
                            · {dict.places.retrieved} {formatDate(place.retrievedAt, lang)}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section id="planear" className="section section--paper">
            <div className="wrap narrow">
              <p className="eyebrow">{dict.form.eyebrow}</p>
              <h2 className="display">{dict.form.title}</h2>
              <p className="lede muted">{dict.form.intro}</p>
              <LeadForm dict={dict} source="trip" />
            </div>
          </section>

          <section id="regalo" className="section wrap gift-teaser">
            <p className="eyebrow">{dict.gift.teaserEyebrow}</p>
            <h2 className="display">{dict.gift.teaserTitle}</h2>
            <p className="lede muted">{dict.gift.teaserBody}</p>
            <Link href={`/${lang}/regalo`} className="btn btn--solid">
              {dict.gift.teaserCta}
            </Link>
          </section>

          <SiteFooter dict={dict} />
        </div>
      </main>
    </>
  )
}

function formatDate(iso: string, locale: Locale) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale === "es" ? "es-MX" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

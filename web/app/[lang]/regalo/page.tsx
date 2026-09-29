import type { Metadata } from "next"

import type { Locale } from "@/brand.config"
import { LeadForm } from "@/components/LeadForm"
import { RevealFlow } from "@/components/RevealFlow"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { getDictionary } from "@/content/i18n"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)
  return { title: dict.gift.title, description: dict.gift.intro, alternates: { canonical: `/${lang}/regalo` } }
}

export default async function GiftPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)

  return (
    <>
      <SiteHeader dict={dict} path="/regalo" />
      <main className="page">
        <section className="section wrap narrow">
          <p className="eyebrow">{dict.gift.teaserEyebrow}</p>
          <h1 className="display">{dict.gift.title}</h1>
          <p className="lede muted">{dict.gift.intro}</p>
          <RevealFlow dict={dict} />
        </section>
        <section id="crear" className="section section--paper">
          <div className="wrap narrow">
            <h2 className="display">{dict.gift.formTitle}</h2>
            <p className="lede muted">{dict.gift.doneBody}</p>
            <LeadForm dict={dict} source="gift" />
          </div>
        </section>
      </main>
      <SiteFooter dict={dict} />
    </>
  )
}

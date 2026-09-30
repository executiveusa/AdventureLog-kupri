import type { Metadata } from "next"
import Link from "next/link"

import type { Locale } from "@/brand.config"
import { RevealFlow } from "@/components/RevealFlow"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"
import { getDictionary } from "@/content/i18n"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)
  return { title: dict.gift.title, description: dict.gift.intro, alternates: { canonical: `/${lang}/regalo` } }
}

// Proof of the signature idea. It ends in the same form as the home page (gift switch on),
// so there is still only one conversion.
export default async function GiftPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Locale }
  const dict = getDictionary(lang)

  return (
    <>
      <SiteHeader dict={dict} path="/regalo" />
      <main className="page gallery">
        <section className="section section--top">
          <div className="wrap narrow">
            <p className="eyebrow">{dict.gift.eyebrow}</p>
            <h1 className="display">{dict.gift.title}</h1>
            <p className="lede muted">{dict.gift.intro}</p>
            <RevealFlow dict={dict} />
            <div className="gift-cta">
              <p className="muted">{dict.gift.doneBody}</p>
              <Link href={`/${lang}?regalo=1#armar`} className="btn btn--solid">
                {dict.gift.cta}
              </Link>
            </div>
          </div>
        </section>
        <SiteFooter dict={dict} path="/regalo" />
      </main>
    </>
  )
}

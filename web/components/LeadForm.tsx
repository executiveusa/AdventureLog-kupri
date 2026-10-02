"use client"

import { useEffect, useState } from "react"

import { isWhatsAppPlaceholder } from "@/brand.config"
import type { BudgetBand, Dictionary, GroupSize } from "@/content/i18n"
import { REGIONS, type RegionId } from "@/content/places"
import { emailLink, whatsappLink } from "@/lib/contact"

type Status = "idle" | "sending" | "saved" | "not_saved"

// The site's one conversion. WhatsApp opens on submit (inside the click, so popup blockers
// allow it) with the answers written out; the lead is saved server-side in parallel and the
// confirmation says honestly whether that worked.
export function LeadForm({ dict }: { dict: Dictionary }) {
  const t = dict.form
  const locale = dict.locale
  const [regions, setRegions] = useState<RegionId[]>([])
  const [group, setGroup] = useState<GroupSize | "">("")
  const [budget, setBudget] = useState<BudgetBand | "">("")
  const [gift, setGift] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [handoff, setHandoff] = useState({ wa: "", email: "" })

  // /regalo links here with ?regalo=1 so the gift switch arrives already on.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("regalo") === "1") setGift(true)
  }, [])

  function toggleRegion(id: RegionId) {
    setRegions((current) => (current.includes(id) ? current.filter((r) => r !== id) : [...current, id]))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const contact = String(form.get("contact") ?? "").trim()
    const dates = String(form.get("dates") ?? "").trim()

    const regionNames = regions.map((id) => REGIONS.find((r) => r.id === id)!.name[locale])
    const text = [
      `${t.waGreeting} ${name}.`,
      `${t.waLabels.regions}: ${regionNames.join(", ") || t.anyRegion}`,
      dates && `${t.waLabels.dates}: ${dates}`,
      group && `${t.waLabels.group}: ${t.groupOptions[group]}`,
      budget && `${t.waLabels.budget}: ${t.budgetOptions[budget]}`,
      gift && t.waLabels.gift,
    ]
      .filter(Boolean)
      .join("\n")
    const links = { wa: whatsappLink(text), email: emailLink(t.emailSubject, `${text}\n\n${contact}`) }
    setHandoff(links)
    setStatus("sending")
    window.open(links.wa, "_blank", "noopener,noreferrer")

    let saved = false
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          regions,
          dates: dates || undefined,
          group: group || undefined,
          budget: budget || undefined,
          gift,
          source: gift ? "gift" : "trip",
          locale,
          company: String(form.get("company") ?? ""),
        }),
      })
      saved = response.ok
    } catch {
      saved = false
    }
    setStatus(saved ? "saved" : "not_saved")
  }

  if (status === "saved" || status === "not_saved") {
    return (
      <div role="status" className="lead-done">
        <p className="lead-done__title">{status === "saved" ? t.savedTitle : t.notSavedTitle}</p>
        <p className="muted">{status === "saved" ? t.savedBody : t.notSavedBody}</p>
        <div className="actions">
          <a className="btn btn--solid" href={handoff.wa} target="_blank" rel="noopener noreferrer">
            {t.openWhatsapp}
          </a>
          <a className="btn btn--quiet" href={handoff.email}>
            {t.sendEmail}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="lead-form">
      <fieldset className="q">
        <legend>{t.regions}</legend>
        <p className="q__hint">{t.regionsHint}</p>
        <div className="chips">
          {REGIONS.map((region) => (
            <label key={region.id} className="chip" data-active={regions.includes(region.id)}>
              <input
                type="checkbox"
                name="regions"
                value={region.id}
                checked={regions.includes(region.id)}
                onChange={() => toggleRegion(region.id)}
              />
              {region.short[locale]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="q field">
        <span className="legend">{t.dates}</span>
        <input name="dates" placeholder={t.datesPlaceholder} maxLength={120} autoComplete="off" />
      </label>

      <ChoiceGroup legend={t.group} name="group" options={t.groupOptions} value={group} onChange={setGroup} />

      <ChoiceGroup
        legend={t.budget}
        hint={t.budgetNote}
        name="budget"
        options={t.budgetOptions}
        value={budget}
        onChange={setBudget}
      />

      <label className="switch">
        <input type="checkbox" name="gift" checked={gift} onChange={(e) => setGift(e.target.checked)} />
        <span className="switch__track" aria-hidden />
        <span>
          <span className="switch__label">{t.gift}</span>
          <span className="switch__hint">{t.giftHint}</span>
        </span>
      </label>

      <div className="q grid-2">
        <label className="field">
          <span className="legend">{t.name}</span>
          <input name="name" required autoComplete="name" maxLength={120} />
        </label>
        <label className="field">
          <span className="legend">{t.contact}</span>
          <input name="contact" required autoComplete="tel" inputMode="text" maxLength={160} />
        </label>
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hp" />

      <div className="submit-row">
        {isWhatsAppPlaceholder && <p className="small warn">{t.placeholderWarning}</p>}
        <button type="submit" className="btn btn--solid btn--wide" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p className="small muted">{t.privacy}</p>
      </div>
    </form>
  )
}

function ChoiceGroup<K extends string>(props: {
  legend: string
  hint?: string
  name: string
  options: Record<K, string>
  value: K | ""
  onChange: (value: K) => void
}) {
  return (
    <fieldset className="q">
      <legend>{props.legend}</legend>
      {props.hint && <p className="q__hint">{props.hint}</p>}
      <div className="chips">
        {(Object.keys(props.options) as K[]).map((key) => (
          <label key={key} className="chip" data-active={props.value === key}>
            <input
              type="radio"
              name={props.name}
              value={key}
              checked={props.value === key}
              onChange={() => props.onChange(key)}
            />
            {props.options[key]}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

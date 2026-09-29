"use client"

import { useState } from "react"

import { isWhatsAppPlaceholder } from "@/brand.config"
import type { BudgetBand, Dictionary, GroupSize } from "@/content/i18n"
import { REGIONS, type RegionId } from "@/content/places"
import { emailLink, whatsappLink } from "@/lib/contact"

type Status = "idle" | "sending" | "saved" | "not_saved"
type Source = "trip" | "gift" | "portfolio"

export function LeadForm({ dict, source = "trip" }: { dict: Dictionary; source?: Source }) {
  const t = dict.form
  const locale = dict.locale
  const [regions, setRegions] = useState<RegionId[]>([])
  const [group, setGroup] = useState<GroupSize | "">("")
  const [budget, setBudget] = useState<BudgetBand | "">("")
  const [status, setStatus] = useState<Status>("idle")
  const [handoff, setHandoff] = useState({ wa: "", email: "" })

  function toggleRegion(id: RegionId) {
    setRegions((current) => (current.includes(id) ? current.filter((r) => r !== id) : [...current, id]))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const contact = String(form.get("contact") ?? "").trim()
    const dates = String(form.get("dates") ?? "").trim()
    const message = String(form.get("message") ?? "").trim()

    const regionNames = regions.map((id) => REGIONS.find((r) => r.id === id)!.name[locale])
    const lines = [
      `${t.waGreeting} ${name}.`,
      `${t.waLabels.regions}: ${regionNames.join(", ") || t.anyRegion}`,
      dates && `${t.waLabels.dates}: ${dates}`,
      group && `${t.waLabels.group}: ${t.groupOptions[group]}`,
      budget && `${t.waLabels.budget}: ${t.budgetOptions[budget]}`,
      message && `${t.waLabels.message}: ${message}`,
    ].filter(Boolean)
    const text = lines.join("\n")
    const links = { wa: whatsappLink(text), email: emailLink(t.emailSubject, `${text}\n\n${contact}`) }
    setHandoff(links)
    setStatus("sending")
    // Open WhatsApp while we still have the click's user gesture (popup blockers reject
    // window.open after an await); the lead is saved in parallel.
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
          message: message || undefined,
          source,
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
        <div className="row">
          <a className="btn btn--solid" href={handoff.wa} target="_blank" rel="noopener noreferrer">
            {t.openWhatsapp}
          </a>
          <a className="btn" href={handoff.email}>
            {t.sendEmail}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="lead-form">
      <fieldset>
        <legend>{t.regions}</legend>
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
              {region.name[locale]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span className="legend">{t.dates}</span>
        <input name="dates" placeholder={t.datesPlaceholder} maxLength={120} />
      </label>

      <ChoiceGroup legend={t.group} name="group" options={t.groupOptions} value={group} onChange={setGroup} />

      <ChoiceGroup
        legend={t.budget}
        note={t.budgetNote}
        name="budget"
        options={t.budgetOptions}
        value={budget}
        onChange={setBudget}
      />

      <div className="grid-2">
        <label className="field">
          <span>{t.name}</span>
          <input name="name" required autoComplete="name" maxLength={120} />
        </label>
        <label className="field">
          <span>{t.contact}</span>
          <input name="contact" required autoComplete="email" inputMode="email" maxLength={160} />
        </label>
      </div>
      <label className="field">
        <span>{t.message}</span>
        <textarea name="message" rows={3} maxLength={1000} />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hp" />

      <p className="muted small">{t.privacy}</p>
      {isWhatsAppPlaceholder && <p className="small warn">{t.placeholderWarning}</p>}
      <button type="submit" className="btn btn--solid btn--wide" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.submit}
      </button>
    </form>
  )
}

function ChoiceGroup<K extends string>(props: {
  legend: string
  note?: string
  name: string
  options: Record<K, string>
  value: K | ""
  onChange: (value: K) => void
}) {
  return (
    <fieldset>
      <legend>{props.legend}</legend>
      {props.note && <p className="muted small">{props.note}</p>}
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

"use client"

import { useEffect, useState } from "react"

import { GIFT_DEMO, mapsLink } from "@/content/gift-demo"
import type { Dictionary } from "@/content/i18n"

const STORAGE_KEY = "querencia:gift-demo"

function readProgress(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

function writeProgress(steps: number[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(steps))
  } catch {
    // Private mode / blocked storage: the demo still works for this visit.
  }
}

// Each stop stays hidden until its code is entered, one at a time, in order.
export function RevealFlow({ dict }: { dict: Dictionary }) {
  const t = dict.gift
  const locale = dict.locale
  const [unlocked, setUnlocked] = useState<number[]>([])

  useEffect(() => setUnlocked(readProgress()), [])

  function unlock(step: number) {
    const next = [...new Set([...unlocked, step])]
    setUnlocked(next)
    writeProgress(next)
  }

  function reset() {
    setUnlocked([])
    writeProgress([])
  }

  const nextStep = GIFT_DEMO.find((s) => !unlocked.includes(s.step))?.step
  const done = !nextStep

  return (
    <div className="reveal">
      <div className="reveal__progress" aria-live="polite">
        <span>
          {unlocked.length} {t.of} {GIFT_DEMO.length} {t.progress}
        </span>
        <div className="bar">
          <i style={{ width: `${(unlocked.length / GIFT_DEMO.length) * 100}%` }} />
        </div>
      </div>

      <ol className="reveal__steps">
        {GIFT_DEMO.map((step) => {
          const open = unlocked.includes(step.step)
          const current = step.step === nextStep
          return (
            <li key={step.step} className="reveal-card" data-state={open ? "open" : current ? "current" : "locked"}>
              <p className="reveal-card__meta" data-locked={t.locked}>
                {t.day} {step.day} · {t.stop} {step.step}
              </p>
              <h3>{step.title[locale]}</h3>
              <p className="muted">{step.clue[locale]}</p>
              {open ? (
                <div className="reveal-card__open">
                  <p className="reveal-card__place">{step.place}</p>
                  <p>{step.reveal[locale]}</p>
                  <a href={mapsLink(step.mapsQuery)} target="_blank" rel="noopener noreferrer" className="link">
                    {t.maps} ↗
                  </a>
                </div>
              ) : current ? (
                <CodeForm dict={dict} code={step.code} focus={unlocked.length > 0} onUnlock={() => unlock(step.step)} />
              ) : null}
            </li>
          )
        })}
      </ol>

      {done && (
        <div className="reveal__done" role="status">
          <h3>{t.doneTitle}</h3>
          <button type="button" className="btn btn--quiet" onClick={reset}>
            {t.reset}
          </button>
        </div>
      )}
    </div>
  )
}

function CodeForm({
  dict,
  code,
  focus,
  onUnlock,
}: {
  dict: Dictionary
  code: string
  focus: boolean
  onUnlock: () => void
}) {
  const t = dict.gift
  const [value, setValue] = useState("")
  const [wrong, setWrong] = useState(false)

  return (
    <form
      className="code-form"
      onSubmit={(event) => {
        event.preventDefault()
        if (value.trim().toUpperCase() === code) onUnlock()
        else setWrong(true)
      }}
    >
      <p className="small muted">
        {t.demoNote}: <code>{code}</code>
      </p>
      <div className="row">
        <label className="field grow field--inline">
          <span className="sr-only">{t.codeLabel}</span>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setWrong(false)
            }}
            placeholder={t.codeLabel}
            autoCapitalize="characters"
            // After an unlock, move focus to the next stop's code so keyboard and
            // screen-reader users continue where the reveal happened.
            autoFocus={focus}
            autoComplete="off"
          />
        </label>
        <button type="submit" className="btn btn--solid">
          {t.unlock}
        </button>
      </div>
      {wrong && (
        <p className="small warn" role="alert">
          {t.wrong}
        </p>
      )}
    </form>
  )
}

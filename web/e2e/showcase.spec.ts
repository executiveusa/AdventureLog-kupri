import { expect, test } from "@playwright/test"

test("root goes to Spanish first; English only when the visitor chose it", async ({ browser, baseURL }) => {
  const en = await browser.newContext({ locale: "en-US" })
  const page = await en.newPage()
  await page.goto("/")
  await expect(page).toHaveURL(/\/es$/)

  await en.addCookies([{ name: "lang", value: "en", url: baseURL! }])
  await page.goto("/")
  await expect(page).toHaveURL(/\/en$/)
  await en.close()
})

for (const [lang, htmlLang, heading, submit] of [
  ["es", "es-MX", "Platícanos qué se te antoja.", "Mandar por WhatsApp"],
  ["en", "en", "Tell us what you're in the mood for.", "Send on WhatsApp"],
] as const) {
  test(`/${lang}: one journey, real places with sources, one form`, async ({ page }) => {
    await page.goto(`/${lang}`)
    await expect(page.locator("html")).toHaveAttribute("lang", htmlLang)
    await expect(page.getByRole("heading", { name: heading })).toBeAttached()
    await expect(page.getByRole("button", { name: submit })).toBeAttached()

    const places = page.locator("a.place")
    await expect(places).toHaveCount(9)
    for (const place of await places.all()) {
      await expect(place).toHaveAttribute("href", /^https:\/\//)
    }
  })
}

test("the form opens WhatsApp with the answers and never fakes success", async ({ page, context }) => {
  await page.goto("/en")
  await page.locator("#armar").scrollIntoViewIfNeeded()
  await page.locator(".chip", { hasText: "Tepoztlán & Cuernavaca" }).click()
  await page.getByPlaceholder("e.g. March").fill("March, 4 nights")
  await page.locator(".chip", { hasText: "3 to 6" }).click()
  await page.locator(".switch").click()
  await page.getByLabel("Your name").fill("E2E Traveller")
  await page.getByLabel("Your WhatsApp or email").fill("e2e@example.com")

  // Stub wa.me so the test doesn't depend on reaching WhatsApp.
  await context.route("https://wa.me/**", (route) => route.fulfill({ body: "whatsapp stub" }))
  const waRequest = context.waitForEvent("request", (r) => r.url().startsWith("https://wa.me/"))
  await page.getByRole("button", { name: "Send on WhatsApp" }).click()
  const url = decodeURIComponent((await waRequest).url())
  for (const part of ["E2E Traveller", "Tepoztlán & Cuernavaca", "March, 4 nights", "3 to 6", "It's a surprise gift"]) {
    expect(url).toContain(part)
  }

  if (!process.env.LEAD_WEBHOOK_URL) {
    await expect(page.getByRole("status")).toContainText("couldn't save your details")
  }
  await expect(page.getByRole("link", { name: "Open WhatsApp" })).toHaveAttribute("href", /wa\.me/)
})

test("lead API validates input and reports a missing backend honestly", async ({ request }, info) => {
  test.skip(info.project.name !== "desktop", "API contract is viewport-independent; run once to stay under the rate limit")
  const invalid = await request.post("/api/lead", { data: { name: "" } })
  expect(invalid.status()).toBe(400)

  const valid = await request.post("/api/lead", {
    data: { name: "E2E", contact: "e2e@example.com", regions: ["cdmx"], budget: "tier2", gift: true, locale: "es" },
  })
  if (!process.env.LEAD_WEBHOOK_URL) {
    expect(valid.status()).toBe(503)
    expect((await valid.json()).ok).toBe(false)
  }
})

test("gift demo unlocks stop by stop and hands off to the form with the gift switch on", async ({ page }) => {
  await page.goto("/es/regalo")
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  const current = () => page.locator(".reveal-card[data-state='current']")
  await current().getByPlaceholder("Escribe la clave").fill("equivocada")
  await current().getByRole("button", { name: "Abrir" }).click()
  await expect(page.locator(".reveal").getByRole("alert")).toContainText("Esa no es")

  for (const code of ["AGUA", "JARDIN", "CANTERA", "CERRO", "CANDELA"]) {
    await current().getByPlaceholder("Escribe la clave").fill(code)
    await current().getByRole("button", { name: "Abrir" }).click()
  }
  await expect(page.locator(".reveal-card[data-state='open']")).toHaveCount(5)
  await expect(page.getByText("Así se siente recibirlo.")).toBeVisible()

  await page.getByRole("link", { name: "Quiero regalar uno" }).click()
  await expect(page).toHaveURL(/\/es\?regalo=1#armar$/)
  await expect(page.locator(".switch input")).toBeChecked()
})

test("case study renders in full and as an embeddable card", async ({ page }) => {
  await page.goto("/en/caso")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Querencia")
  await expect(page.locator(".case-steps li")).toHaveCount(5)

  await page.goto("/en/caso?embed=1")
  await expect(page.locator("main.embed")).toBeVisible()
  await expect(page.locator(".site-header")).toHaveCount(0)
})

// Small Android up to desktop: no sideways scroll, no tiny tap targets, no iOS input zoom.
for (const [w, h] of [
  [320, 568],
  [360, 800],
  [768, 1024],
]) {
  test(`${w}px: no overflow, tap targets ≥44px, inputs ≥16px`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "explicit viewports; run once")
    await page.setViewportSize({ width: w, height: h })
    for (const path of ["/es", "/en/regalo", "/es/caso", "/en/caso?embed=1"]) {
      await page.goto(path)
      const result = await page.evaluate(() => {
        const visible = (e: Element) => {
          const r = e.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden" && !e.closest(".q-world")
        }
        const targets = [...document.querySelectorAll("a, button, label.chip, label.switch, input:not([type=checkbox]):not([type=radio])")]
          .filter((e) => visible(e) && !e.classList.contains("skip"))
          .filter((e) => {
            const r = e.getBoundingClientRect()
            return r.height < 44
          })
          .map((e) => `${e.tagName}.${e.className} ${Math.round(e.getBoundingClientRect().height)}px`)
        const smallInputs = [...document.querySelectorAll("input:not([type=checkbox]):not([type=radio]):not(.hp)")]
          .filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16)
          .map((e) => (e as HTMLInputElement).name)
        return { overflow: document.documentElement.scrollWidth - window.innerWidth, targets, smallInputs }
      })
      expect(result.overflow, `${path} overflow`).toBeLessThanOrEqual(0)
      // The header CTA must stay on one line at every width.
      const cta = page.locator(".site-header .btn--small")
      if ((await cta.count()) > 0) {
        expect((await cta.boundingBox())!.height, `${path} header CTA wraps`).toBeLessThanOrEqual(46)
      }
      expect(result.targets, `${path} small targets`).toEqual([])
      expect(result.smallInputs, `${path} small inputs`).toEqual([])
    }
  })
}

test("header is dark over the film and turns light over the gallery", async ({ page }) => {
  await page.goto("/es")
  const header = page.locator(".site-header")
  await expect(header).toHaveAttribute("data-tone", "dark")
  await page.evaluate(() => document.getElementById("armar")!.scrollIntoView({ behavior: "instant" }))
  await expect(header).toHaveAttribute("data-tone", "light")
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }))
  await expect(header).toHaveAttribute("data-tone", "dark")
})

test("reduced motion gets still, fully readable scenes instead of the film", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto("/es")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await expect(page.locator(".q-world")).toHaveCount(0)
  await expect(page.locator(".still")).toHaveCount(6)
  const first = page.locator(".still__title").first()
  await expect(first).toHaveText("Tu viaje por México, revelado paso a paso.")
  await expect(first).toHaveCSS("opacity", "1")
  await expect(page.locator(".still a.btn", { hasText: "Armar mi viaje" })).toHaveAttribute("href", "#armar")
  await context.close()
})

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health")
  expect(response.ok()).toBeTruthy()
})

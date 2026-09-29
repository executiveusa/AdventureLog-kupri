import { expect, test } from "@playwright/test"

test("root redirects to Spanish by default and to English for English browsers", async ({ browser }) => {
  const es = await browser.newContext({ locale: "es-MX" })
  const esPage = await es.newPage()
  await esPage.goto("/")
  await expect(esPage).toHaveURL(/\/es$/)
  await es.close()

  const en = await browser.newContext({ locale: "en-US" })
  const enPage = await en.newPage()
  await enPage.goto("/")
  await expect(enPage).toHaveURL(/\/en$/)
  await en.close()
})

for (const [lang, heading, plan] of [
  ["es", "Cuéntanos qué buscas.", "Enviar y abrir WhatsApp"],
  ["en", "Tell us what you're looking for.", "Send and open WhatsApp"],
] as const) {
  test(`/${lang} renders the journey, real places and the lead form`, async ({ page }) => {
    await page.goto(`/${lang}`)
    await expect(page.locator("html")).toHaveAttribute("lang", lang)
    await expect(page.getByRole("heading", { name: heading })).toBeAttached()
    await expect(page.getByRole("button", { name: plan })).toBeAttached()
    // Every place card links a source and labels its image.
    const cards = page.locator(".place")
    await expect(cards).toHaveCount(9)
    for (const card of await cards.all()) {
      await expect(card.locator("a[href^='https://']")).toHaveCount(1)
      await expect(card.locator(".tag")).not.toBeEmpty()
    }
  })
}

test("form opens WhatsApp prefilled and never fakes success without a backend", async ({ page, context }) => {
  await page.goto("/en")
  await page.locator("#planear").scrollIntoViewIfNeeded()
  await page.locator(".chip", { hasText: "Morelos" }).click()
  await page.getByPlaceholder("e.g. mid-March").fill("March, 5 nights")
  await page.locator(".chip", { hasText: "3–6" }).click()
  await page.getByLabel("Your name").fill("E2E Traveller")
  await page.getByLabel("WhatsApp or email").fill("e2e@example.com")

  // Stub wa.me so the test doesn't depend on reaching WhatsApp.
  await context.route("https://wa.me/**", (route) => route.fulfill({ body: "whatsapp stub" }))
  const waRequest = context.waitForEvent("request", (r) => r.url().startsWith("https://wa.me/"))
  await page.getByRole("button", { name: "Send and open WhatsApp" }).click()
  const url = decodeURIComponent((await waRequest).url())
  expect(url).toContain("wa.me/")
  expect(url).toContain("E2E Traveller")
  expect(url).toContain("Morelos")
  expect(url).toContain("March, 5 nights")

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
    data: { name: "E2E", contact: "e2e@example.com", regions: ["cdmx"], source: "trip", locale: "en" },
  })
  if (!process.env.LEAD_WEBHOOK_URL) {
    expect(valid.status()).toBe(503)
    expect((await valid.json()).ok).toBe(false)
  }
})

test("gift demo unlocks stops one at a time with their codes", async ({ page }) => {
  await page.goto("/es/regalo")
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  const current = page.locator(".reveal-card[data-state='current']")
  await current.getByPlaceholder("Escribe la clave").fill("equivocada")
  await current.getByRole("button", { name: "Revelar" }).click()
  await expect(page.locator(".reveal").getByRole("alert")).toContainText("no es la clave")

  for (const code of ["AGUA", "JARDIN", "CANTERA", "CERRO", "CANDELA"]) {
    await page.locator(".reveal-card[data-state='current']").getByPlaceholder("Escribe la clave").fill(code)
    await page.locator(".reveal-card[data-state='current']").getByRole("button", { name: "Revelar" }).click()
  }
  await expect(page.locator(".reveal-card[data-state='open']")).toHaveCount(5)
  await expect(page.getByText("Así se siente recibirlo.")).toBeVisible()
})

test("case study renders in full and as an embeddable card", async ({ page }) => {
  await page.goto("/en/caso")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Querencia")
  await expect(page.locator(".case-steps li")).toHaveCount(5)

  await page.goto("/en/caso?embed=1")
  await expect(page.locator("main.embed")).toBeVisible()
  await expect(page.locator(".site-header")).toHaveCount(0)
})

test("no horizontal overflow on any page", async ({ page }) => {
  for (const path of ["/es", "/en/regalo", "/es/caso", "/en/caso?embed=1"]) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})

test("health endpoint responds", async ({ request }) => {
  const response = await request.get("/api/health")
  expect(response.ok()).toBeTruthy()
})

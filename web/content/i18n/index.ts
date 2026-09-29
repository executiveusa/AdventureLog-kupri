import type { Locale } from "@/brand.config"

import { en } from "./en"
import { es } from "./es"

export type Dictionary = typeof es

export function getDictionary(locale: Locale): Dictionary {
  return locale === "en" ? en : es
}

export type BudgetBand = keyof Dictionary["form"]["budgetOptions"]
export type GroupSize = keyof Dictionary["form"]["groupOptions"]

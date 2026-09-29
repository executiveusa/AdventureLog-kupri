import { BRAND } from "@/brand.config"

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${BRAND.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function emailLink(subject: string, body: string) {
  return `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

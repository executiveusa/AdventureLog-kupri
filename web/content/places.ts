// Real places only. Every card links its source and says what kind of source it is.
// Facts in the blurbs are limited to what the linked page states (retrieved 29 Sep 2026).
// No prices, ratings, availability or partnerships — Querencia has none to claim yet.

import type { Locale } from "@/brand.config"

export type RegionId = "cdmx" | "morelos" | "valle" | "vallarta"

// official = government / institution page · venue = the place's own site ·
// reference = independent page (used only when no official page exists)
export type LinkKind = "official" | "venue" | "reference"

// What the image on the card is. Until real photography is licensed every card is an
// illustration, and it says so.
export type PhotoLabel = "official-photo" | "our-photo" | "illustration"

export interface Place {
  id: string
  region: RegionId
  name: string
  town: string
  blurb: Record<Locale, string>
  link: { href: string; kind: LinkKind }
  photo: PhotoLabel
  retrievedAt: string
}

export const REGIONS: { id: RegionId; name: Record<Locale, string> }[] = [
  { id: "cdmx", name: { es: "Ciudad de México", en: "Mexico City" } },
  { id: "morelos", name: { es: "Morelos: Tepoztlán y Cuernavaca", en: "Morelos: Tepoztlán & Cuernavaca" } },
  { id: "valle", name: { es: "Valle de Bravo", en: "Valle de Bravo" } },
  { id: "vallarta", name: { es: "Puerto Vallarta y Punta Mita", en: "Puerto Vallarta & Punta Mita" } },
]

const RETRIEVED = "2026-09-29"

export const PLACES: Place[] = [
  {
    id: "mna",
    region: "cdmx",
    name: "Museo Nacional de Antropología",
    town: "Bosque de Chapultepec, CDMX",
    blurb: {
      es: "Las salas de las culturas antiguas de México, dentro del Bosque de Chapultepec.",
      en: "The halls of Mexico's ancient cultures, inside Chapultepec Park.",
    },
    link: { href: "https://mna.inah.gob.mx/", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "los-manantiales",
    region: "cdmx",
    name: "Los Manantiales",
    town: "Xochimilco, CDMX",
    blurb: {
      es: "El restaurante de Félix Candela: una bóveda delgada de concreto junto a los canales de Xochimilco.",
      en: "Félix Candela's restaurant: a thin concrete shell beside the canals of Xochimilco.",
    },
    link: { href: "https://architectuul.com/architecture/los-manantiales-restaurant", kind: "reference" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "tepozteco",
    region: "morelos",
    name: "El Tepozteco",
    town: "Tepoztlán, Morelos",
    blurb: {
      es: "Un templo prehispánico en la cima del cerro, tras una vereda de unos 2 km desde el pueblo.",
      en: "A pre-Hispanic temple on the clifftop, reached by a trail of about 2 km from the village.",
    },
    link: { href: "https://www.inah.gob.mx/zonas/zona-arqueologica-tepozteco", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "las-huertas",
    region: "morelos",
    name: "Balneario Las Huertas",
    town: "Tlaquiltenango, Morelos",
    blurb: {
      es: "Al sur de Cuernavaca: pozas naturales de agua templada que nacen de un manantial.",
      en: "South of Cuernavaca: natural pools of warm water fed by a spring.",
    },
    link: { href: "https://paraisoaventura.mx/", kind: "venue" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "jardin-borda",
    region: "morelos",
    name: "Jardín Borda",
    town: "Centro, Cuernavaca",
    blurb: {
      es: "Casa virreinal con lago artificial y jardines, construida por un minero de la plata.",
      en: "A colonial-era house with an artificial lake and gardens, built by a silver miner.",
    },
    link: { href: "https://cuernavaca.gob.mx/?ova_por=jardin-borda", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "catedral-cuernavaca",
    region: "morelos",
    name: "Catedral de Cuernavaca",
    town: "Centro, Cuernavaca",
    blurb: {
      es: "Su antiguo monasterio es parte del Patrimonio Mundial de la UNESCO: los primeros monasterios del siglo XVI en las laderas del Popocatépetl.",
      en: "Its former monastery is part of a UNESCO World Heritage site: the earliest 16th-century monasteries on the slopes of Popocatépetl.",
    },
    link: { href: "https://whc.unesco.org/en/list/702/", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "monte-alto",
    region: "valle",
    name: "Parque Estatal Monte Alto",
    town: "Valle de Bravo, Estado de México",
    blurb: {
      es: "Bosque protegido sobre el lago de Valle de Bravo, decretado parque estatal en 2013.",
      en: "Protected forest above Lake Valle de Bravo, declared a state park in 2013.",
    },
    link: { href: "https://cepanaf.edomex.gob.mx/parque_monte_alto", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "puerto-vallarta",
    region: "vallarta",
    name: "Puerto Vallarta",
    town: "Jalisco",
    blurb: {
      es: "El malecón, la sierra y la Bahía de Banderas.",
      en: "The malecón, the mountains and Banderas Bay.",
    },
    link: { href: "https://visitpuertovallarta.com/", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
  {
    id: "islas-marietas",
    region: "vallarta",
    name: "Parque Nacional Islas Marietas",
    town: "Bahía de Banderas, Nayarit",
    blurb: {
      es: "Parque nacional: solo se visita con prestadores de servicios que tengan permiso de la Conanp.",
      en: "A national park: visits only with tour operators holding a Conanp permit.",
    },
    link: { href: "https://www.gob.mx/conanp/documentos/parque-nacional-islas-marietas", kind: "official" },
    photo: "illustration",
    retrievedAt: RETRIEVED,
  },
]

// Public demo of the surprise reveal. Adapted from the original birthday itinerary
// (frontend/static/surprise/itinerary/cuernavaca-sacred.json) with corrected locations
// and its own demo codes; the private birthday version is not exposed here.

import type { Locale } from "@/brand.config"

export interface GiftStep {
  step: number
  day: number
  place: string
  code: string
  title: Record<Locale, string>
  clue: Record<Locale, string>
  reveal: Record<Locale, string>
  mapsQuery: string
}

export const GIFT_DEMO: GiftStep[] = [
  {
    step: 1,
    day: 1,
    place: "Balneario Las Huertas, Tlaquiltenango",
    code: "AGUA",
    title: { es: "Primera sorpresa: agua templada", en: "First surprise: warm water" },
    clue: {
      es: "Empezamos despacio, con agua que nace de la tierra.",
      en: "We start slowly, with water that rises from the ground.",
    },
    reveal: {
      es: "Pozas de manantial al sur de Cuernavaca. Trae traje de baño.",
      en: "Spring-fed pools south of Cuernavaca. Bring a swimsuit.",
    },
    mapsQuery: "Balneario Las Huertas Tlaquiltenango Morelos",
  },
  {
    step: 2,
    day: 1,
    place: "Jardín Borda, Cuernavaca",
    code: "JARDIN",
    title: { es: "Un jardín con lago en el centro", en: "A garden with a lake in the centre" },
    clue: {
      es: "Un minero de la plata lo construyó para quedarse.",
      en: "A silver miner built it to stay.",
    },
    reveal: {
      es: "Casa virreinal y jardines con lago artificial, en el centro de Cuernavaca.",
      en: "A colonial-era house and gardens with an artificial lake, in central Cuernavaca.",
    },
    mapsQuery: "Jardín Borda Cuernavaca",
  },
  {
    step: 3,
    day: 1,
    place: "Catedral de Cuernavaca",
    code: "CANTERA",
    title: { es: "Un patio de piedra y silencio", en: "A courtyard of stone and silence" },
    clue: {
      es: "Cinco siglos de muros, a unos pasos del jardín.",
      en: "Five centuries of walls, a few steps from the garden.",
    },
    reveal: {
      es: "Su antiguo monasterio es Patrimonio Mundial de la UNESCO.",
      en: "Its former monastery is a UNESCO World Heritage site.",
    },
    mapsQuery: "Catedral de Cuernavaca",
  },
  {
    step: 4,
    day: 2,
    place: "El Tepozteco, Tepoztlán",
    code: "CERRO",
    title: { es: "Día dos: subir al cerro", en: "Day two: up the mountain" },
    clue: {
      es: "Tenis cómodos. La vista se gana a pie.",
      en: "Comfortable shoes. The view is earned on foot.",
    },
    reveal: {
      es: "Un templo prehispánico en la cima, tras una vereda de unos 2 km.",
      en: "A pre-Hispanic temple at the top, after a trail of about 2 km.",
    },
    mapsQuery: "Zona Arqueológica Tepozteco",
  },
  {
    step: 5,
    day: 2,
    place: "Los Manantiales, Xochimilco",
    code: "CANDELA",
    title: { es: "Cena bajo una bóveda", en: "Dinner under a shell" },
    clue: {
      es: "De regreso a la ciudad, junto al agua, bajo una obra de arquitectura.",
      en: "Back in the city, beside the water, under a piece of architecture.",
    },
    reveal: {
      es: "El restaurante de Félix Candela junto a los canales de Xochimilco.",
      en: "Félix Candela's restaurant beside the canals of Xochimilco.",
    },
    mapsQuery: "Restaurante Los Manantiales Xochimilco",
  },
]

export function mapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

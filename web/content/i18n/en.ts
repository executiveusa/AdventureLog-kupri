import type { Dictionary } from "./index"

// English. A separate, complete version — written alongside the Spanish, not translated line by line.

export const en: Dictionary = {
  locale: "en",
  htmlLang: "en",
  meta: {
    title: "Querencia · Custom trips through Mexico",
    description:
      "Custom trips through Mexico City, Tepoztlán, Cuernavaca, Valle de Bravo and Puerto Vallarta, built from real places. Tell us on WhatsApp.",
  },
  nav: {
    plan: "Plan my trip",
    otherLocale: "ES",
    otherLocaleLabel: "Leer en español",
    skip: "Skip to the form",
    main: "Main",
  },
  journey: {
    hint: "scroll",
    label: "A journey through Mexico, from Mexico City to the Pacific",
    cta: "Plan my trip",
    scenes: {
      cdmx: {
        label: "Mexico City",
        eyebrow: "Custom trips through Mexico",
        title: "Your trip through Mexico, revealed one stop at a time.",
        body: "We build your route from real places, from Mexico City to Vallarta, and you discover it stop by stop.",
        tags: ["Mexico City", "Museo Nacional de Antropología"],
      },
      tepoztlan: {
        label: "Tepoztlán",
        eyebrow: "Tepoztlán, Morelos",
        title: "Tepoztlán is climbed on foot.",
        body: "A trail of about 2 km up to the Tepozteco, then back down to the village and its market.",
        tags: ["El Tepozteco"],
      },
      aguas: {
        label: "The waters",
        eyebrow: "Morelos",
        title: "Warm water, steam and no rush.",
        body: "South of Cuernavaca, pools fed by a spring. Then Jardín Borda and the cathedral, right in the centre.",
        tags: ["Las Huertas", "Jardín Borda", "Cuernavaca Cathedral"],
      },
      valle: {
        label: "Valle de Bravo",
        eyebrow: "Valle de Bravo",
        title: "A weekend to breathe.",
        body: "The lake, the Monte Alto forest and a sky full of paragliders.",
        tags: ["Monte Alto State Park"],
      },
      pacifico: {
        label: "The Pacific",
        eyebrow: "Puerto Vallarta · Punta Mita",
        title: "And to finish, the sea.",
        body: "Banderas Bay and the Marietas Islands, which you can only visit with a permit.",
        tags: ["Banderas Bay", "Marietas Islands"],
      },
      querencia: {
        label: "Your trip",
        eyebrow: "Querencia",
        title: "Where would you like to go?",
        body: "Tell us in a minute and we'll reply on WhatsApp with a plan made for you.",
      },
    },
  },
  how: {
    eyebrow: "How it works",
    title: "You bring the wish. We build the route.",
    steps: [
      {
        title: "Tell us",
        body: "Dates, who's coming and what you're in the mood for. It takes a minute and goes straight to WhatsApp.",
      },
      {
        title: "We build your route",
        body: "Only places that exist and that you can check. No off-the-shelf packages, no made-up prices.",
      },
      {
        title: "You discover it",
        body: "We reveal each stop when it's time. If it's a gift, the other person opens each surprise with a code.",
      },
    ],
    demo: "See how a surprise trip feels",
  },
  places: {
    eyebrow: "Real places",
    title: "A few possible stops.",
    intro: "Every place exists and comes with its source. We build your route with you; this is just a taste.",
    linkKinds: { official: "Official site", venue: "Venue site", reference: "Reference" },
    checked: "Sources checked on 29 September 2026.",
  },
  form: {
    eyebrow: "Plan my trip",
    title: "Tell us what you're in the mood for.",
    intro: "Four quick questions. A person replies, not a bot.",
    regions: "Where to?",
    regionsHint: "Pick one or more.",
    dates: "When?",
    datesPlaceholder: "e.g. March, 4 nights",
    group: "How many of you?",
    groupOptions: { "1-2": "1 or 2", "3-6": "3 to 6", "7-12": "7 to 12", "13+": "13 or more" },
    budget: "Rough budget",
    budgetNote: "For the whole trip, in US dollars. Your own estimate, not our price.",
    budgetOptions: {
      tier1: "Under $5,000",
      tier2: "$5,000 to $10,000",
      tier3: "$10,000 to $25,000",
      tier4: "Over $25,000",
      talk: "I'd rather talk it through",
    },
    gift: "It's a surprise gift",
    giftHint: "We reveal it to them stop by stop.",
    name: "Your name",
    contact: "Your WhatsApp or email",
    privacy: "We only use your details to reply to you. No spam.",
    submit: "Send on WhatsApp",
    sending: "Sending…",
    savedTitle: "Done — we have your details.",
    savedBody: "We'll write to you on WhatsApp or by email once we've looked at it.",
    notSavedTitle: "WhatsApp opened with your answers.",
    notSavedBody:
      "We couldn't save your details on our side. Send the WhatsApp message or email us and we'll reply.",
    openWhatsapp: "Open WhatsApp",
    sendEmail: "Email us instead",
    placeholderWarning: "Preview: the WhatsApp number isn't set up yet.",
    anyRegion: "not sure yet",
    waGreeting: "Hi! I'm",
    waLabels: { regions: "Destinations", dates: "Dates", group: "Group", budget: "Budget", gift: "It's a surprise gift" },
    emailSubject: "I'd like to plan a trip with Querencia",
  },
  gift: {
    eyebrow: "Surprise trip",
    title: "Gift a trip that reveals itself stop by stop.",
    intro:
      "This is how it feels: whoever receives the gift opens each stop with a code you hand them in the moment. In this demo the codes are shown.",
    demoNote: "Demo code",
    codeLabel: "Enter the code",
    unlock: "Open",
    wrong: "Not that one. Try again.",
    progress: "discovered",
    of: "of",
    day: "Day",
    stop: "Stop",
    locked: " · Still to discover",
    maps: "Open in maps",
    doneTitle: "That's what receiving it feels like.",
    doneBody: "Want to give one to someone? Tell us who it's for and when.",
    cta: "I want to gift one",
    reset: "Start again",
  },
  caso: {
    eyebrow: "Case study",
    title: "Querencia: from a birthday surprise to a site built to sell trips.",
    intro:
      "It began as a private gift and became a bilingual experience, designed so every visit ends in a WhatsApp conversation.",
    sections: [
      {
        title: "The challenge",
        body: "Show high-end travel without stock photos or empty promises, and make every visit end in a real conversation.",
      },
      {
        title: "Strategy",
        body: "One journey, from Mexico City to the Pacific, and one action at the end: plan your trip.",
      },
      {
        title: "Art direction",
        body: "Two registers: cinema for the journey, a white gallery for deciding. One typeface and one action colour, clay.",
      },
      {
        title: "Motion",
        body: "The camera moves when you do, on the phone's native scroll. Anyone who prefers less motion sees still images.",
      },
      {
        title: "Conversion and truth",
        body: "A short form that opens WhatsApp with your answers. Every place links its source and no image poses as a photo.",
      },
    ],
    creditLabel: "Concept, strategy & art direction",
    visit: "Explore the site",
    embedTitle: "Querencia — case study",
  },
  footer: {
    truth:
      "Places are real and link to their source. Journey images are illustrations, not photos of a specific venue.",
    contact: "Contact",
    gift: "How a surprise trip feels",
    caseStudy: "Case study",
    creditPending: "Kupuri Media",
  },
}

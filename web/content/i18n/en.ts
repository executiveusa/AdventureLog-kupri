import type { Dictionary } from "./index"

// English. Written alongside the Spanish, not machine-translated.

export const en: Dictionary = {
  locale: "en",
  meta: {
    title: "Querencia — Mexico, revealed one moment at a time",
    description:
      "Tailor-made trips through Mexico City, Tepoztlán and Cuernavaca, Valle de Bravo and Puerto Vallarta. Tell us what you're looking for and a person replies.",
  },
  nav: {
    home: "Home",
    plan: "Plan my journey",
    gift: "Gift a surprise journey",
    caseStudy: "Case study",
    otherLocale: "Español",
    skip: "Skip to the form",
  },
  journey: {
    hint: "scroll to travel",
    ctaPlan: "Plan my journey",
    ctaGift: "Gift a surprise journey",
    scenes: {
      cdmx: {
        label: "Mexico City",
        eyebrow: "Mexico City",
        title: "Mexico, revealed one moment at a time.",
        body: "Dawn breaks over the volcanoes and the city wakes up. Everything starts here: museums, rooftops, markets and dinner under a Candela shell.",
        tags: ["Museo Nacional de Antropología", "Los Manantiales, Xochimilco"],
      },
      tepoztlan: {
        label: "Tepoztlán",
        eyebrow: "Heading south",
        title: "The road drops through the forest and the cliffs appear.",
        body: "Tepoztlán is climbed on foot: a trail up to the Tepozteco, then back down to the village and its market.",
        tags: ["El Tepozteco"],
      },
      aguas: {
        label: "The waters",
        eyebrow: "Morelos",
        title: "Warm water, steam and silence.",
        body: "South of Cuernavaca, pools fed by a spring. Then the city of eternal spring itself: Jardín Borda and the cathedral.",
        tags: ["Balneario Las Huertas", "Jardín Borda", "Catedral de Cuernavaca"],
      },
      valle: {
        label: "Valle de Bravo",
        eyebrow: "Valle de Bravo",
        title: "A weekend made of air.",
        body: "The lake, the Monte Alto forest and a sky that fills with paragliders.",
        tags: ["Parque Estatal Monte Alto"],
      },
      pacifico: {
        label: "The Pacific",
        eyebrow: "Puerto Vallarta · Punta Mita",
        title: "And at the end, the sea.",
        body: "Banderas Bay, mountains that fall into the water, and the Marietas Islands, visited only with a permit.",
        tags: ["Puerto Vallarta", "Islas Marietas"],
      },
      querencia: {
        label: "Querencia",
        eyebrow: "Querencia",
        title: "The place where you feel most yourself.",
        body: "Four questions, and a person replies with a proposal made for you.",
      },
    },
  },
  places: {
    eyebrow: "Real places",
    title: "Every place is real, and we show where each fact comes from.",
    intro: "These are some possible stops. We build every trip with you; nothing here is a fixed-price package.",
    linkKinds: { official: "Official site", venue: "Venue site", reference: "Reference" },
    photoLabels: {
      "official-photo": "Official photo",
      "our-photo": "Our photo",
      illustration: "Illustration",
    },
    retrieved: "Checked on",
  },
  form: {
    eyebrow: "Plan my journey",
    title: "Tell us what you're looking for.",
    intro: "Four questions. A person replies, not a bot.",
    regions: "1. Where would you like to go?",
    dates: "2. When?",
    datesPlaceholder: "e.g. mid-March, 5 nights",
    group: "3. How many people?",
    groupOptions: { "1-2": "1–2", "3-6": "3–6", "7-12": "7–12", "13+": "13 or more" },
    budget: "4. Rough budget for the whole trip",
    budgetNote: "Your own estimate, not our price. It helps us suggest the right things.",
    budgetOptions: {
      lt5k: "Under US$5,000",
      "5-10k": "US$5,000–10,000",
      "10-25k": "US$10,000–25,000",
      "25k+": "Over US$25,000",
      talk: "I'd rather talk it through",
    },
    name: "Your name",
    contact: "WhatsApp or email",
    message: "Anything else? (optional)",
    privacy: "Your details are only used to reply to you. No mailing list unless you ask.",
    submit: "Send and open WhatsApp",
    sending: "Sending…",
    savedTitle: "Thank you — we have your details.",
    savedBody: "A person will reply on WhatsApp or by email.",
    notSavedTitle: "WhatsApp is opening with your answers.",
    notSavedBody:
      "We couldn't save your details on our side just now. Please send the WhatsApp message or email us so we can reply.",
    openWhatsapp: "Open WhatsApp",
    sendEmail: "Email us instead",
    placeholderWarning: "Preview: the WhatsApp number is not configured yet.",
    anyRegion: "not sure yet",
    waGreeting: "Hi, I'm",
    waLabels: { regions: "Destinations", dates: "Dates", group: "People", budget: "Budget", message: "Note" },
    emailSubject: "I'd like to plan a trip with Querencia",
  },
  gift: {
    teaserEyebrow: "Querencia's signature",
    teaserTitle: "Gift a journey that reveals itself one stop at a time.",
    teaserBody:
      "It began as a birthday surprise: each stop unlocks with a code, on the day. Try the demo.",
    teaserCta: "See the demo",
    title: "A surprise journey, revealed step by step",
    intro:
      "This is how it feels: whoever receives the gift opens each stop with a code you hand them in the moment. This public demo shows the codes.",
    demoNote: "Demo code",
    codeLabel: "Enter the code",
    unlock: "Reveal",
    wrong: "That's not the code. Try again.",
    progress: "discovered",
    of: "of",
    maps: "Open in maps",
    doneTitle: "That's what receiving it feels like.",
    doneBody: "Want to create one for someone you love? Tell us who it's for and when.",
    formTitle: "Create a surprise journey",
    reset: "Start again",
  },
  caso: {
    eyebrow: "Case study",
    title: "Querencia: from a birthday surprise to a site that brings in clients",
    intro:
      "A Kupuri Media project. It began as a private gift and became a bilingual experience that shows the craft and brings in real enquiries.",
    sections: [
      {
        title: "The challenge",
        body: "Show high-end travel without generic stock photos or empty promises, and make every visit end in a real conversation.",
      },
      {
        title: "Strategy",
        body: "One journey from start to finish: Mexico City to the Pacific. Each scene answers one traveller question, and the last one invites them to write to us.",
      },
      {
        title: "Art direction",
        body: "The palette comes from the places: pink cantera stone, thermal water, lake and sea. Editorial type and a single motion idea: the camera moves when you do.",
      },
      {
        title: "Motion",
        body: "One continuous flight controlled by scroll, with a native vertical cut for phones and a still mode for anyone who prefers less motion.",
      },
      {
        title: "Conversion and truth",
        body: "A short form that saves the enquiry and opens WhatsApp with the answers. Every place links its source and every image says whether it is a photo or an illustration.",
      },
    ],
    creditLabel: "Concept, strategy & art direction",
    visit: "Explore the site",
    embedTitle: "Querencia — case study",
  },
  footer: {
    truth:
      "Places are real and link to their source. Journey images are illustrations or generated animation, not photos of a specific venue.",
    contact: "Contact",
    creditPending: "Kupuri Media",
  },
}

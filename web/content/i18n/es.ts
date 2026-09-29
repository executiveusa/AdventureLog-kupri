// Español (idioma por defecto). Escrito a mano; el inglés no es traducción automática.

export const es = {
  locale: "es" as "es" | "en",
  meta: {
    title: "Querencia — México, revelado un momento a la vez",
    description:
      "Viajes a la medida por la Ciudad de México, Tepoztlán y Cuernavaca, Valle de Bravo y Puerto Vallarta. Cuéntanos qué buscas y te respondemos en persona.",
  },
  nav: {
    home: "Inicio",
    plan: "Planear mi viaje",
    gift: "Regalar un viaje sorpresa",
    caseStudy: "Caso de estudio",
    otherLocale: "English",
    skip: "Saltar al formulario",
  },
  journey: {
    hint: "desliza para viajar",
    ctaPlan: "Planear mi viaje",
    ctaGift: "Regalar un viaje sorpresa",
    scenes: {
      cdmx: {
        label: "Ciudad de México",
        eyebrow: "Ciudad de México",
        title: "México, revelado un momento a la vez.",
        body: "Amanece sobre los volcanes y la ciudad despierta. Desde aquí empieza todo: museos, azoteas, mercados y cenas bajo bóvedas de Candela.",
        tags: ["Museo Nacional de Antropología", "Los Manantiales, Xochimilco"],
      },
      tepoztlan: {
        label: "Tepoztlán",
        eyebrow: "Hacia el sur",
        title: "La carretera baja entre el bosque y aparece el cerro.",
        body: "Tepoztlán se sube a pie: una vereda hasta el Tepozteco y, al bajar, el pueblo y su mercado.",
        tags: ["El Tepozteco"],
      },
      aguas: {
        label: "Las aguas",
        eyebrow: "Morelos",
        title: "Agua templada, vapor y silencio.",
        body: "Al sur de Cuernavaca, pozas que nacen de un manantial. Después, la ciudad de la eterna primavera: el Jardín Borda y la catedral.",
        tags: ["Balneario Las Huertas", "Jardín Borda", "Catedral de Cuernavaca"],
      },
      valle: {
        label: "Valle de Bravo",
        eyebrow: "Valle de Bravo",
        title: "Un fin de semana de aire.",
        body: "El lago, el bosque de Monte Alto y un cielo que se llena de parapentes.",
        tags: ["Parque Estatal Monte Alto"],
      },
      pacifico: {
        label: "El Pacífico",
        eyebrow: "Puerto Vallarta · Punta Mita",
        title: "Y al final, el mar.",
        body: "La Bahía de Banderas, la sierra que cae al agua y las Islas Marietas, que solo se visitan con permiso.",
        tags: ["Puerto Vallarta", "Islas Marietas"],
      },
      querencia: {
        label: "Querencia",
        eyebrow: "Querencia",
        title: "El lugar donde más te sientes tú.",
        body: "Cuatro preguntas y te respondemos en persona con una propuesta a tu medida.",
      },
    },
  },
  places: {
    eyebrow: "Lugares reales",
    title: "Cada lugar existe, y te decimos de dónde viene cada dato.",
    intro:
      "Estas son algunas paradas posibles. Armamos cada viaje contigo; nada aquí es un paquete con precio fijo.",
    linkKinds: { official: "Sitio oficial", venue: "Sitio del lugar", reference: "Referencia" },
    photoLabels: {
      "official-photo": "Foto oficial",
      "our-photo": "Foto nuestra",
      illustration: "Ilustración",
    },
    retrieved: "Consultado el",
  },
  form: {
    eyebrow: "Planear mi viaje",
    title: "Cuéntanos qué buscas.",
    intro: "Cuatro preguntas. Te responde una persona, no un robot.",
    regions: "1. ¿A dónde quieres ir?",
    dates: "2. ¿Cuándo?",
    datesPlaceholder: "p. ej. mediados de marzo, 5 noches",
    group: "3. ¿Cuántas personas?",
    groupOptions: { "1-2": "1–2", "3-6": "3–6", "7-12": "7–12", "13+": "13 o más" },
    budget: "4. Presupuesto aproximado del viaje (total)",
    budgetNote: "Es tu estimación, no un precio nuestro. Nos ayuda a proponerte lo correcto.",
    budgetOptions: {
      "lt5k": "Menos de US$5,000",
      "5-10k": "US$5,000–10,000",
      "10-25k": "US$10,000–25,000",
      "25k+": "Más de US$25,000",
      talk: "Prefiero platicarlo",
    },
    name: "Tu nombre",
    contact: "WhatsApp o correo",
    message: "¿Algo más? (opcional)",
    privacy: "Tus datos solo se usan para responderte. Sin listas de correo, a menos que las pidas.",
    submit: "Enviar y abrir WhatsApp",
    sending: "Enviando…",
    savedTitle: "Gracias, ya tenemos tus datos.",
    savedBody: "Te escribimos en persona por WhatsApp o correo.",
    notSavedTitle: "WhatsApp se está abriendo con tus respuestas.",
    notSavedBody:
      "No pudimos guardar tus datos de nuestro lado en este momento. Envía el mensaje de WhatsApp o escríbenos por correo para que te respondamos.",
    openWhatsapp: "Abrir WhatsApp",
    sendEmail: "Escribir por correo",
    placeholderWarning: "Vista previa: el número de WhatsApp todavía no está configurado.",
    anyRegion: "aún no sé",
    waGreeting: "Hola, soy",
    waLabels: { regions: "Destinos", dates: "Fechas", group: "Personas", budget: "Presupuesto", message: "Nota" },
    emailSubject: "Quiero planear un viaje con Querencia",
  },
  gift: {
    teaserEyebrow: "La firma de Querencia",
    teaserTitle: "Regala un viaje que se revela paso a paso.",
    teaserBody:
      "Nació como una sorpresa de cumpleaños: cada parada se desbloquea con una clave, el mismo día. Pruébalo con el demo.",
    teaserCta: "Ver el demo",
    title: "Un viaje sorpresa, revelado paso a paso",
    intro:
      "Así se vive: la persona que recibe el regalo abre cada parada con una clave que le das en el momento. Este es un demo público con claves visibles.",
    demoNote: "Clave del demo",
    codeLabel: "Escribe la clave",
    unlock: "Revelar",
    wrong: "Esa no es la clave. Intenta de nuevo.",
    progress: "descubiertas",
    of: "de",
    maps: "Ver en el mapa",
    doneTitle: "Así se siente recibirlo.",
    doneBody: "¿Quieres crear uno para alguien que quieres? Cuéntanos para quién y cuándo.",
    formTitle: "Crear un viaje sorpresa",
    reset: "Volver a empezar",
  },
  caso: {
    eyebrow: "Caso de estudio",
    title: "Querencia: de una sorpresa de cumpleaños a un sitio que genera clientes",
    intro:
      "Un proyecto de Kupuri Media. Empezó como un regalo privado y se convirtió en una experiencia bilingüe que muestra el oficio y trae solicitudes reales.",
    sections: [
      {
        title: "El reto",
        body: "Mostrar viajes de alto nivel sin caer en fotos genéricas ni promesas vacías, y que cada visita termine en una conversación real.",
      },
      {
        title: "Estrategia",
        body: "Un solo recorrido de principio a fin: de la Ciudad de México al Pacífico. Cada escena responde una pregunta del viajero y la última lo invita a escribirnos.",
      },
      {
        title: "Dirección de arte",
        body: "La paleta sale del lugar: cantera rosa, agua termal, lago y mar. Tipografía editorial y un solo gesto de movimiento: la cámara avanza cuando tú avanzas.",
      },
      {
        title: "Movimiento",
        body: "Un vuelo continuo que se controla con el scroll, con versión vertical nativa para teléfono y un modo sin movimiento para quien lo prefiera.",
      },
      {
        title: "Conversión y verdad",
        body: "Formulario corto que guarda la solicitud y abre WhatsApp con las respuestas. Cada lugar enlaza su fuente y cada imagen dice si es foto o ilustración.",
      },
    ],
    creditLabel: "Concepto, estrategia y dirección de arte",
    visit: "Recorrer el sitio",
    embedTitle: "Querencia — caso de estudio",
  },
  footer: {
    truth:
      "Los lugares son reales y enlazan su fuente. Las imágenes del recorrido son ilustraciones o animaciones generadas, no fotos de un lugar específico.",
    contact: "Contacto",
    creditPending: "Kupuri Media",
  },
}

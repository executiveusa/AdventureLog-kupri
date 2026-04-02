<div align="center">

  <img src="brand/screenshots/adventures.png" alt="Querencia" width="200" height="auto" />
  <h1>Querencia™</h1>
  <h3>by Kupuri Media™</h3>
  
  <p>
    <em>El lugar donde más te sientes tú mismo.</em><br/>
    <em>The place where you feel most yourself.</em>
  </p>
  <p>
    Plataforma eco-luxury de viajes curados para Latinoamérica. Hecho en México por una Sociedad de Propósito Social.
  </p>

  <h4>
    <a href="https://querencia.app">querencia.app</a>
    <span> · </span>
    <a href="#documentación">Documentación</a>
    <span> · </span>
    <a href="mailto:hola@kupurimedia.com">Contacto</a>
  </h4>

  <p>
    <img src="https://img.shields.io/badge/Idioma_principal-Español_MX-green" alt="Idioma" />
    <img src="https://img.shields.io/badge/Moneda-MXN-blue" alt="Currency" />
    <img src="https://img.shields.io/badge/Empresa-S.P.S._México-orange" alt="Social Purpose" />
    <img src="https://img.shields.io/badge/Framework-SvelteKit_v2-red" alt="SvelteKit" />
  </p>
</div>

<br />

---

## Acerca del Proyecto · About the Project

**Querencia™** es una aplicación de viajes eco-luxury construida en Mexico, enfocada en experiencias auténticas de Latinoamérica. Combina planificación potenciada por IA con verificación de guías locales, ecoturismo comunitario y experiencias sorpresa personalizadas.

**Querencia™** is an eco-luxury travel app built in Mexico, focused on authentic Latin American experiences. It combines AI-powered planning with local guide verification, community ecotourism, and personalized surprise experiences.

**Empresa**: Kupuri Media™ S.A.S. de P.S.  
**País de incorporación**: México  
**Estructura legal**: Sociedad de Propósito Social — 5% de ganancias netas a reforestación y turismo comunitario.

---

## Tabla de Contenidos

- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Precios](#precios)
- [Instalación Local](#instalación-local)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Agente Hermes](#agente-hermes)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Funcionalidades

### Para Viajeros
- **Directorio Ecoturístico** — 8+ destinos verificados en México y Latinoamérica con calificación de impacto ecológico
- **El Diario (Blog)** — Artículos sobre viaje consciente, destinos ocultos y turismo sostenible (bilingüe ES/EN)
- **Planificación con IA** — Itinerarios generados por el agente Hermes, verificados por guías locales
- **Mapa Interactivo** — Visualiza destinos y aventuras en un mapa en tiempo real

### Sistema de Experiencias Sorpresa
- Flujo de revelación paso a paso con contraseña (modelo "caza del tesoro")
- Rutas dinámicas por slug: `/surprise/experience/[slug]`
- Itinerarios JSON configurables en `frontend/static/surprise/itinerary/`
- Bilingüe ES/EN por defecto

### Precios en MXN
| Plan | Precio | Descripción |
|------|--------|-------------|
| Explorador | Gratis | Acceso al directorio y El Diario |
| Orientador | $490 MXN/mes | IA + verificación local |
| Sagrado | $1,799 MXN/mes | Agente Hermes 24/7 + experiencias curadas |
| Círculo Querencia | $8,499 MXN/trimestre | Agencias, creadores y exploradores frecuentes |

---

## Stack Tecnológico

<details>
  <summary>Frontend</summary>
  <ul>
    <li><a href="https://svelte.dev/">SvelteKit v2</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://daisyui.com/">DaisyUI</a></li>
    <li><a href="https://github.com/dimfeld/svelte-maplibre/">Svelte MapLibre</a></li>
    <li>svelte-i18n (ES por defecto, + 18 idiomas más)</li>
    <li>@sveltejs/adapter-vercel para deploy</li>
  </ul>
</details>

<details>
  <summary>Backend</summary>
  <ul>
    <li><a href="https://www.djangoproject.com/">Django 5</a></li>
    <li><a href="https://postgis.net/">PostGIS / PostgreSQL</a></li>
    <li><a href="https://www.django-rest-framework.org/">Django REST Framework</a></li>
    <li>Supabase (auth + realtime + storage)</li>
    <li>Agente HERMES — LangGraph + OpenAI (ver <code>AGENTS.md</code>)</li>
  </ul>
</details>

<details>
  <summary>Infraestructura</summary>
  <ul>
    <li>Vercel (frontend)</li>
    <li>VPS 31.220.58.212 (agente Hermes)</li>
    <li>Docker Compose (desarrollo local)</li>
  </ul>
</details>

---

## Instalación Local

```bash
# Clonar
git clone https://github.com/executiveusa/AdventureLog-kupri.git
cd AdventureLog-kupri/AdventureLog

# Frontend
cd frontend
npm install
npm run dev

# Backend (requiere Docker)
cd ..
docker-compose -f docker-compose.dev.yml up
```

El frontend corre en `http://localhost:5173` (o 5174 si el puerto está ocupado).

---

## Variables de Entorno

```env
# frontend/.env
PUBLIC_SERVER_URL=http://localhost:8000
PUBLIC_DISABLE_REGISTRATION=false

# backend/.env
DJANGO_SECRET_KEY=your-secret-key
POSTGRES_DB=querencia
POSTGRES_USER=querencia
POSTGRES_PASSWORD=your-password
```

---

## Estructura del Proyecto

```
AdventureLog/
├── vercel.json                  ← Build config para Vercel
├── AGENTS.md                    ← Spec del agente Hermes
├── frontend/
│   └── src/
│       ├── routes/
│       │   ├── +layout.svelte   ← Layout global, i18n init (default: es)
│       │   ├── pricing/         ← Precios en MXN
│       │   ├── blog/            ← El Diario (bilingüe)
│       │   ├── directory/       ← Directorio ecoturístico
│       │   └── (full)/
│       │       └── surprise/    ← Sistema de experiencias sorpresa
│       ├── lib/
│       │   ├── components/
│       │   │   ├── Footer.svelte     ← Footer bilingüe
│       │   │   └── ChatWindow.svelte ← Chat Hermes (placeholder)
│       │   └── surprise/
│       │       └── SurpriseRevealFlow.svelte
│       └── locales/             ← Traducciones svelte-i18n (es.json primario)
└── backend/
    └── server/                  ← Django app
```

---

## Agente Hermes

El agente HERMES es el núcleo de IA de Querencia. Ver [`AGENTS.md`](AGENTS.md) para la especificación completa.

**Capacidades planeadas:**
- Generación y validación de itinerarios
- Concierge 24/7 por WhatsApp (Twilio/Meta Business API)
- Análisis de escenas con VisionClaw
- Coordinación de guías locales
- Gestión de experiencias sorpresa

---

## Idioma y Localización

- **Idioma primario**: Español mexicano (`es`)
- **Idioma secundario**: Inglés (`en`) — traducción secundaria visible en pantalla
- **Moneda**: Pesos mexicanos (MXN)
- **Zona horaria por defecto**: America/Mexico_City
- El sistema usa `svelte-i18n` con cookie de locale. Sin cookie → `es` por defecto.

---

## Licencia

Distribuido bajo la GNU General Public License v3.0. Ver `LICENSE`.

---

## Contacto

**Kupuri Media™**  
Correo: hola@kupurimedia.com  
Web: querencia.app  
México · Sociedad de Propósito Social

> _"Querencia: el lugar donde uno se siente más a gusto, donde uno es más uno mismo."_

  
  <p>
    The ultimate travel companion for the modern-day explorer.
  </p>
   
<h4>
    <a href="https://demo.adventurelog.app">View Demo</a>
  <span> · </span>
    <a href="https://adventurelog.app">Documentation</a>
  <span> · </span>
    <a href="https://discord.gg/wRbQ9Egr8C">Discord</a>
  <span> · </span>
    <a href="https://buymeacoffee.com/seanmorley15">Support 💖</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# Table of Contents

- [About the Project](#-about-the-project)
  - [Screenshots](#-screenshots)
  - [Tech Stack](#-tech-stack)
  - [Features](#-features)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
  - [Translation](#-translation)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgements](#-acknowledgements)

<!-- About the Project -->

## ⭐ About the Project

Starting from a simple idea of tracking travel locations, AdventureLog has grown into a full-fledged travel companion. With AdventureLog, you can log your adventures, keep track of where you've been on the world map, plan your next trip collaboratively, and share your experiences with friends and family.

AdventureLog was created to solve a problem: the lack of a modern, open-source, user-friendly travel companion. Many existing travel apps are either too complex, too expensive, or too closed-off to be useful for the average traveler. AdventureLog aims to be the opposite: simple, beautiful, and open to everyone.

<!-- Screenshots -->

### 📷 Screenshots

<div align="center"> 
  <img src="./brand/screenshots/adventures.png" alt="Locations" />
  <p>Displays the locations you have visited and the ones you plan to embark on. You can also filter and sort the locations.</p>
  <img src="./brand/screenshots/details.png" alt="Location Details" />
  <p>Shows specific details about a location, including the name, date, location, description, and rating.</p>
  <img src="./brand/screenshots/edit.png" alt="Edit Modal" />
  <img src="./brand/screenshots/map.png" alt="Location Details" />
  <p>View all of your locations on a map, with the ability to filter by visit status and add new ones by click on the map</p>
  <img src="./brand/screenshots/map-satellite.png" alt="Location Details" />
  <p>View a 3D representation of your locations and activities on the map, allowing for a more immersive exploration of your travel history.</p>
  <img src="./brand/screenshots/dashboard.png" alt="Dashboard" />
  <p>Displays a summary of your locations, including your world travel stats.</p>
  <img src="./brand/screenshots/itinerary.png" alt="Itinerary" />
  <p>Plan your adventures and travel itinerary with a list of activities and a map view. View your trip in a variety of ways, including an itinerary list, a map view, and a calendar view. Order your plans and details to create the perfect trip.</p>
  <img src="./brand/screenshots/countries.png" alt="Countries" />
  <p>Lists all the countries you have visited and plan to visit, with the ability to filter by visit status.</p>
  <img src="./brand/screenshots/regions.png" alt="Regions" />
  <p>Displays the regions for a specific country, includes a map view to visually select regions.</p>
</div>

<!-- TechStack -->

### 🚀 Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://svelte.dev/">SvelteKit</a></li>
    <li><a href="https://tailwindcss.com/">TailwindCSS</a></li>
    <li><a href="https://daisyui.com/">DaisyUI</a></li>
    <li><a href="https://github.com/dimfeld/svelte-maplibre/">Svelte MapLibre</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://www.djangoproject.com/">Django</a></li>
    <li><a href="https://postgis.net/">PostGIS</a></li>
    <li><a href="https://www.django-rest-framework.org/">Django REST Framework</a></li>
    <li><a href="https://allauth.org/">AllAuth</a></li>
  </ul>
</details>
<!-- Features -->

### 🎯 Features

- **Track Your Adventures** 🌍: Log your adventures and keep track of where you've been on the world map.
  - Locations can store a variety of information, including the location, date, and description.
  - Locations can be sorted into custom categories for easy organization.
  - Locations can be marked as private or public, allowing you to share your adventures with friends and family.
  - Keep track of the countries and regions you've visited with the world travel book.
  - Upload trails and activities to your locations to remember your experiences with detailed maps and stats.
- **Plan Your Next Trip** 📃: Take the guesswork out of planning your next adventure with an easy-to-use itinerary planner.
  - Itineraries can be created for any number of days and can include multiple destinations.
  - Itineraries include many planning features like flight information, notes, checklists, and links to external resources.
  - Itineraries can be shared with friends and family for collaborative planning.
- **Share Your Experiences** 📸: Share your adventures with friends and family and collaborate on trips together.
  - Locations and itineraries can be shared via a public link or directly with other AdventureLog users.
  - Collaborators can view and edit shared itineraries (collections), making planning a breeze.

<!-- Roadmap -->

## 🧭 Roadmap

The AdventureLog Roadmap can be found [here](https://github.com/users/seanmorley15/projects/5)

<!-- Contributing -->

## 👋 Contributing

<a href="https://github.com/seanmorley15/AdventureLog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=seanmorley15/AdventureLog" />
</a>

Contributions are always welcome!

See `contributing.md` for ways to get started.

### Translation

AdventureLog is available on [Weblate](https://hosted.weblate.org/projects/adventurelog/). If you would like to help translate AdventureLog into your language, please visit the link and contribute!

<a href="https://hosted.weblate.org/engage/adventurelog/">
<img src="https://hosted.weblate.org/widget/adventurelog/multi-auto.svg" alt="Translation status" />
</a>

<!-- License -->

## 📃 License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

<!-- Contact -->

## 🤝 Contact

Sean Morley - [website](https://seanmorley.com)

Hi! I'm Sean, the creator of AdventureLog. I'm a college student and software developer with a passion for travel and adventure. I created AdventureLog to help people like me document their adventures and plan new ones effortlessly. As a student, I am always looking for more opportunities to learn and grow, so feel free to reach out via the contact on my website if you would like to collaborate or chat!

<!-- Acknowledgments -->

## 💎 Acknowledgements

- Logo Design by [nordtektiger](https://github.com/nordtektiger)
- WorldTravel Dataset [dr5hn/countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)

### Top Supporters 💖

- [Veymax](https://x.com/veymax)
- [nebriv](https://github.com/nebriv)
- [Miguel Cruz](https://github.com/Tokynet)
- [Victor Butler](https://x.com/victor_butler)

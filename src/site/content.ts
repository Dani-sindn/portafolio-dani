// Single source of truth for every word on the site, in both languages.
// Fields marked TODO(linkedin) are waiting on data from Dani's LinkedIn profile.

export type Lang = "en" | "es";

export const profile = {
  name: "Dani Cruz",
  // TODO(linkedin): confirm public contact email before publishing.
  email: "",
  links: {
    github: "https://github.com/Dani-sindn",
    linkedin: "", // TODO(linkedin): profile URL
    instagram: "https://www.instagram.com/dani_masdesign/",
  },
};

export interface Capability {
  index: string;
  title: string;
  body: string;
  tags: string[];
}

export interface Step {
  kicker: string;
  title: string;
  body: string;
}

export interface Job {
  period: string;
  company: string;
  role: string;
  body: string;
}

const en = {
  nav: { about: "About", work: "Work", lab: "Lab", contact: "Contact", palette: "Change palette" },
  langModal: {
    title: "How would you like to read?",
    body: "You can switch anytime from the menu.",
  },
  hero: {
    role: "Designer & creative technologist",
    location: "Bogotá, Colombia",
    tagline: "I design systems, interfaces and images — and then I build them.",
    portraitAlt: "Portrait of Dani Cruz",
    tryIt: "Transform",
    particles: "particles",
    density: "Density",
    round: "Round particles",
    scroll: "Hover to play · scroll to scatter ↓",
    ideaSpace: "My space for ideas",
    nextIn: "Next image in {s} seconds",
    prev: "Previous image",
    next: "Next image",
    slides: "Hero images",
  },
  manifesto: {
    label: "About",
    text: "I work in that strange place between an idea and something that actually works.\n\nI design interfaces, content, processes and systems. The tools change; what I'm after doesn't, much: understanding how things fit together — and making them fit better.",
    accents: ["strange", "works.", "fit", "better."],
  },
  inspiration: {
    label: "Inspiration",
    title: "We are the ideas",
    titleAccent: "we execute.",
    body: "In 2024, before AI had the reach it has today, I was already experimenting with this premise. I wanted to push the interface beyond design: to make it felt, to leave a mark. Today, technology lets me carry that impulse further and turn it into more memorable experiences.",
    meta: "2024 · La Fórmula",
    videoTitle: "La Fórmula — Instagram post by Dani Cruz",
  },
  capabilities: {
    label: "What I do",
    title: "Four materials,",
    titleAccent: "one practice.",
    items: [
      {
        index: "01",
        title: "Systems & structure",
        body: "Design systems, information architecture and the rules that let a product grow without falling apart.",
        tags: ["Design systems", "Information architecture", "Tokens"],
      },
      {
        index: "02",
        title: "Generative design",
        body: "AI workflows built like products: prompt systems, custom datasets, LoRAs and fine-tuning for visual production at scale.",
        tags: ["AI workflows", "Prompt systems", "Datasets", "LoRAs"],
      },
      {
        index: "03",
        title: "UI & product",
        body: "Interfaces with clear components, honest states and flows that work on the phone in your pocket first.",
        tags: ["Components", "Interaction", "User flows", "Mobile-first"],
      },
      {
        index: "04",
        title: "Art direction & vibe coding",
        body: "Photography, composition and mood — carried all the way to code, so the idea ships the way it was imagined.",
        tags: ["Photography", "Editorial", "Creative coding"],
      },
    ] as Capability[],
  },
  featured: {
    label: "Featured work",
    name: "RedAcopio",
    year: "2026",
    summary: "An open-source platform to coordinate authorized donation drop-off points during emergencies.",
    url: "https://redacopio-ten.vercel.app",
    role: ["Product design", "UI", "Front-end", "Data model"],
    cta: "Visit live site",
    steps: [
      {
        kicker: "Context",
        title: "An earthquake, and too much goodwill",
        body: "After the M7.4 earthquake of 10 August 2026, northern Bogotá became a logistics hub. People wanted to help but didn't know where to go, what was needed, or whether a point was already full.",
      },
      {
        kicker: "The rule",
        title: "Only verified, physical points",
        body: "The non-negotiable design rule: nothing is public until an authorized entity verifies it. No private homes, no self-registered points. Trust is the product.",
      },
      {
        kicker: "Live status",
        title: "Freshness you can see",
        body: "Each point shows what it needs (urgent, normal, no longer accepting), how crowded it is, and when it was last updated — so outdated info stops redirecting help.",
      },
      {
        kicker: "Replicable",
        title: "Built to be cloned",
        body: "Three roles — public, coordinator, admin — and a deploy any city can repeat. Next.js, Supabase realtime, OpenStreetMap, free tiers.",
      },
    ] as Step[],
  },
  experience: {
    label: "Experience",
    // TODO(linkedin): replace with the real timeline.
    jobs: [
      {
        period: "Present",
        company: "Omnicom Production LATAM — formerly Flare",
        role: "Designer",
        body: "Design and visual production for global brands from the Bogotá hub.",
      },
    ] as Job[],
  },
  labTeaser: {
    label: "Lab",
    title: "Things to",
    titleAccent: "poke at.",
    body: "Mini apps and half-ideas, vibe-coded in public. Play with them, break them, steal the idea.",
    cta: "Open the lab",
  },
  contact: {
    label: "Contact",
    title1: "Let’s make",
    titleAccent: "something",
    title2: "move.",
    footer: "Built with React, canvas and too many palettes.",
  },
  lab: {
    back: "Back to home",
    allExperiments: "All experiments",
    title: "Lab",
    intro: "A shelf of small experiments built through vibe coding — each one starts as an idea I want to test with my hands. Open one, play, and read the note on why it exists.",
    open: "Open",
    idea: "The idea",
    how: "How it was made",
    status: { live: "Live", wip: "In progress", idea: "Idea" },
    soon: "More experiments on the way.",
  },
  labs: {
    palette: {
      title: "Palette lab",
      blurb: "Repaint the whole site — particles included.",
      idea: "Color is the fastest way to change the mood of a system. I wanted a palette to feel like a toy, not a settings page: shuffle until something clicks, then copy the hex.",
      how: "Random harmonies in HSL (complementary, triadic, split) pushed through CSS variables, so every component — even the canvas particles — listens to the same three tokens.",
      shuffle: "Shuffle",
      hint: "Shuffle for a random harmony, or pick a preset.",
      swatches: ["Accent", "Accent 2", "Surface"],
    },
    type: {
      title: "Type lab",
      blurb: "Type anything and bend its weight.",
      idea: "Typography is voice. A variable font lets one word go from whisper to shout — I wanted to feel that range with a single slider.",
      how: "Inter Tight as a variable font (100–900) with letter-spacing that tightens as the weight grows, next to Instrument Serif for contrast.",
      placeholder: "Vibe",
      weight: "Weight",
      size: "Size",
    },
    depth: {
      title: "Depth lab",
      blurb: "Layers that follow your cursor or finger.",
      idea: "Flat screens can still feel deep. Four layers moving at different speeds are enough to fake space.",
      how: "CSS custom properties updated on pointer move drive translate3d per layer plus a subtle perspective tilt. No libraries.",
      hint: "Move or drag",
      word: "depth",
    },
    dither: {
      title: "Dither",
      blurb: "My portrait, crushed into your palette.",
      idea: "The hero breaks my portrait into particles; this one breaks it into pixels. Old-school ordered dithering with today's colors.",
      how: "Bayer 4×4 ordered dithering on a downsampled canvas, mapping luminance to the active palette (surface → accent → accent 2 → white).",
      pixel: "Pixel size",
      contrast: "Contrast",
    },
  },
};

export type Dict = typeof en;

const es: Dict = {
  nav: { about: "Sobre mí", work: "Trabajo", lab: "Lab", contact: "Contacto", palette: "Cambiar paleta" },
  langModal: {
    title: "¿En qué idioma quieres leer?",
    body: "Puedes cambiarlo cuando quieras desde el menú.",
  },
  hero: {
    role: "Diseñador y tecnólogo creativo",
    location: "Bogotá, Colombia",
    tagline: "Diseño sistemas, interfaces e imágenes — y después los construyo.",
    portraitAlt: "Retrato de Dani Cruz",
    tryIt: "Transforma",
    particles: "partículas",
    density: "Densidad",
    round: "Partículas redondas",
    scroll: "Pasa el cursor · haz scroll para dispersar ↓",
    ideaSpace: "Mi espacio de ideas",
    nextIn: "Siguiente imagen en {s} segundos",
    prev: "Imagen anterior",
    next: "Imagen siguiente",
    slides: "Imágenes del inicio",
  },
  manifesto: {
    label: "Sobre mí",
    text: "Trabajo en ese lugar extraño entre una idea y algo que realmente funciona.\n\nDiseño interfaces, contenido, procesos y sistemas. La herramienta cambia, lo que busco no tanto: entender cómo encajan las cosas y hacer que encajen mejor.",
    accents: ["extraño", "funciona.", "encajan", "mejor."],
  },
  inspiration: {
    label: "Inspiración",
    title: "Somos las ideas",
    titleAccent: "que ejecutamos.",
    body: "En 2024, antes de que la IA tuviera el alcance de hoy, ya experimentaba con esta premisa. Quería llevar la interfaz más allá del diseño: que se sintiera, que dejara huella. Hoy la tecnología me permite llevar ese impulso más lejos y convertirlo en experiencias más memorables.",
    meta: "2024 · La Fórmula",
    videoTitle: "La Fórmula — post de Instagram de Dani Cruz",
  },
  capabilities: {
    label: "Qué hago",
    title: "Cuatro materiales,",
    titleAccent: "una práctica.",
    items: [
      {
        index: "01",
        title: "Sistemas y estructura",
        body: "Sistemas de diseño, arquitectura de información y las reglas que dejan crecer un producto sin que se desarme.",
        tags: ["Design systems", "Arquitectura de información", "Tokens"],
      },
      {
        index: "02",
        title: "Diseño generativo",
        body: "Flujos de IA construidos como productos: sistemas de prompts, datasets propios, LoRAs y fine-tuning para producción visual a escala.",
        tags: ["Flujos de IA", "Sistemas de prompts", "Datasets", "LoRAs"],
      },
      {
        index: "03",
        title: "UI y producto",
        body: "Interfaces con componentes claros, estados honestos y flujos que funcionan primero en el teléfono que llevas en el bolsillo.",
        tags: ["Componentes", "Interacción", "Flujos de usuario", "Mobile-first"],
      },
      {
        index: "04",
        title: "Dirección de arte y vibe coding",
        body: "Fotografía, composición y atmósfera — llevadas hasta el código, para que la idea salga tal como se imaginó.",
        tags: ["Fotografía", "Editorial", "Creative coding"],
      },
    ],
  },
  featured: {
    label: "Proyecto destacado",
    name: "RedAcopio",
    year: "2026",
    summary: "Plataforma open-source para coordinar puntos de acopio autorizados durante emergencias.",
    url: "https://redacopio-ten.vercel.app",
    role: ["Diseño de producto", "UI", "Front-end", "Modelo de datos"],
    cta: "Ver sitio en vivo",
    steps: [
      {
        kicker: "Contexto",
        title: "Un terremoto, y demasiada buena voluntad",
        body: "Tras el terremoto M7,4 del 10 de agosto de 2026, el norte de Bogotá se volvió un centro logístico. La gente quería ayudar pero no sabía a dónde ir, qué se necesitaba o si un punto ya estaba lleno.",
      },
      {
        kicker: "La regla",
        title: "Solo puntos físicos verificados",
        body: "La regla de diseño no negociable: nada es público hasta que una entidad autorizada lo verifica. Nada de casas particulares ni puntos auto-registrados. La confianza es el producto.",
      },
      {
        kicker: "Estado en vivo",
        title: "Frescura que se ve",
        body: "Cada punto muestra qué necesita (urgente, normal, ya no recibe), qué tan lleno está y cuándo se actualizó — para que la información vieja deje de desviar la ayuda.",
      },
      {
        kicker: "Replicable",
        title: "Hecha para clonarse",
        body: "Tres roles — público, coordinador, admin — y un despliegue que cualquier ciudad puede repetir. Next.js, Supabase realtime, OpenStreetMap, tiers gratuitos.",
      },
    ],
  },
  experience: {
    label: "Experiencia",
    jobs: [
      {
        period: "Actual",
        company: "Omnicom Production LATAM — antes Flare",
        role: "Diseñador",
        body: "Diseño y producción visual para marcas globales desde el hub de Bogotá.",
      },
    ],
  },
  labTeaser: {
    label: "Lab",
    title: "Cosas para",
    titleAccent: "jugar.",
    body: "Mini apps y medias ideas, hechas con vibe coding en público. Juega con ellas, rómpelas, llévate la idea.",
    cta: "Entrar al lab",
  },
  contact: {
    label: "Contacto",
    title1: "Hagamos que",
    titleAccent: "algo",
    title2: "se mueva.",
    footer: "Hecho con React, canvas y demasiadas paletas.",
  },
  lab: {
    back: "Volver al inicio",
    allExperiments: "Todos los experimentos",
    title: "Lab",
    intro: "Una repisa de experimentos pequeños hechos con vibe coding — cada uno empieza como una idea que quiero probar con las manos. Abre uno, juega y lee la nota de por qué existe.",
    open: "Abrir",
    idea: "La idea",
    how: "Cómo se hizo",
    status: { live: "En vivo", wip: "En proceso", idea: "Idea" },
    soon: "Vienen más experimentos.",
  },
  labs: {
    palette: {
      title: "Laboratorio de paletas",
      blurb: "Repinta todo el sitio — partículas incluidas.",
      idea: "El color es la forma más rápida de cambiar la atmósfera de un sistema. Quería que una paleta se sintiera como un juguete y no como una página de ajustes: mezcla hasta que algo encaje y copia el hex.",
      how: "Armonías aleatorias en HSL (complementaria, triádica, dividida) llevadas a variables CSS, para que cada componente — incluso las partículas del canvas — escuche los mismos tres tokens.",
      shuffle: "Mezclar",
      hint: "Mezcla para una armonía aleatoria o elige una predefinida.",
      swatches: ["Acento", "Acento 2", "Superficie"],
    },
    type: {
      title: "Laboratorio tipográfico",
      blurb: "Escribe lo que quieras y dobla su peso.",
      idea: "La tipografía es voz. Una fuente variable deja que una palabra pase de susurro a grito — quería sentir ese rango con un solo slider.",
      how: "Inter Tight como fuente variable (100–900) con un tracking que se cierra a medida que crece el peso, junto a Instrument Serif para contraste.",
      placeholder: "Vibe",
      weight: "Peso",
      size: "Tamaño",
    },
    depth: {
      title: "Laboratorio de profundidad",
      blurb: "Capas que siguen tu cursor o tu dedo.",
      idea: "Una pantalla plana también puede sentirse profunda. Cuatro capas moviéndose a distinta velocidad bastan para fingir espacio.",
      how: "Variables CSS que se actualizan con el puntero mueven cada capa con translate3d, más una inclinación sutil en perspectiva. Sin librerías.",
      hint: "Mueve o arrastra",
      word: "profundo",
    },
    dither: {
      title: "Dither",
      blurb: "Mi retrato, triturado en tu paleta.",
      idea: "El hero rompe mi retrato en partículas; este lo rompe en píxeles. Dithering ordenado de la vieja escuela con colores de hoy.",
      how: "Dithering ordenado Bayer 4×4 sobre un canvas reducido, mapeando la luminancia a la paleta activa (superficie → acento → acento 2 → blanco).",
      pixel: "Tamaño de píxel",
      contrast: "Contraste",
    },
  },
};

export const dictionaries: Record<Lang, Dict> = { en, es };

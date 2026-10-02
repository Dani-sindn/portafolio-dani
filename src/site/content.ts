// Single source of truth for every word on the site, in both languages.

export type Lang = "en" | "es";

export const profile = {
  name: "Dani Cruz",
  // Public contact email — left empty until Dani confirms one. Booking requests are sent here.
  email: "",
  // Optional Calendly / Cal.com link. When set, the booking section links to it too.
  bookingUrl: "",
  links: {
    linkedin: "https://www.linkedin.com/in/danielcruzui/",
    instagram: "https://www.instagram.com/dani_masdesign/",
  },
};

export interface Capability {
  index: string;
  title: string;
  body: string;
  tags: string[];
}

export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  /** Also selects the generative cover in Featured.tsx. */
  id: "zalo" | "elbosque" | "redacopio" | "more";
  kicker: string;
  title: string;
  year?: string;
  summary: string;
  body: string[];
  tags: string[];
  links: WorkLink[];
}

export interface Job {
  period: string;
  company: string;
  role: string;
  body: string;
}

const en = {
  nav: { about: "About", work: "Work", lab: "Lab", contact: "Contact", agenda: "Let's talk", palette: "Change palette", menu: "Open menu", close: "Close menu" },
  langModal: {
    title: "How would you like to read?",
    body: "You can switch anytime from the menu.",
  },
  hero: {
    role: "Designer & solutions orchestrator",
    region: "LATAM",
    hello: "Hi, I'm",
    helloName: "Dani!",
    location: "Bogotá, Colombia",
    portraitAlt: "Portrait of Dani Cruz",
    tryIt: "Transform",
    particles: "particles",
    density: "Density",
    round: "Round particles",
    scroll: "Hover to play · scroll to scatter ↓",
    ideaSpace: "My space for ideas",
    scrollTouch: "Touch & drag · scroll to scatter ↓",
    settings: "Particle settings",
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
    title: "I solve problems",
    titleAccent: "from different angles.",
    intro: "I don't always arrive at a problem from the same place. Sometimes a process needs ordering, sometimes an experience needs designing, and sometimes a team needs to learn a different way of working.",
    items: [
      {
        index: "01",
        title: "I orchestrate processes, systems and structures",
        body: "I connect people, tools and processes to find where things can work better. I design workflows, automations and systems that turn complexity into something actionable.",
        tags: ["Workflows", "Automation", "Systems"],
      },
      {
        index: "02",
        title: "I design digital experiences",
        body: "UX/UI, interfaces and visual systems. I translate needs, behaviors and goals into experiences that work and make sense.",
        tags: ["UX/UI", "Interfaces", "Visual systems"],
      },
      {
        index: "03",
        title: "I guide AI adoption",
        body: "I help teams and people bring AI and vibe coding into the way they work: from understanding what's possible to building workflows and testing them on real projects.",
        tags: ["AI", "Vibe coding", "Workshops"],
      },
    ] as Capability[],
  },
  work: {
    label: "Selected work",
    title: "Projects, talks",
    titleAccent: "and ideas in motion.",
    hint: "Scroll or drag · tap a card to open it",
    hintTouch: "Swipe · tap a card to open it",
    open: "Open",
    close: "Close",
    items: [
      {
        id: "zalo",
        kicker: "Talks · Dominican Republic & Mexico",
        title: "AI & process tour with Zalo Rocks",
        year: "2026",
        summary: "Invited by Zalo Rocks to share how processes and AI are redefining workflows and automation.",
        body: [
          "Talks in the Dominican Republic and, before that, in Mexico about how processes and artificial intelligence are reshaping workflows and automation across sectors: healthcare, marketing, advertising and digital media.",
          "The core: methodologies that use AI not as a random result generator but as an engine for logic and automation — with Figma as the tool. Sometimes even an auto layout frees up real time in someone's day.",
        ],
        tags: ["Speaking", "AI", "Process design", "Figma"],
        links: [{ label: "LinkedIn post", href: "https://www.linkedin.com/in/danielcruzui/recent-activity/all/" }],
      },
      {
        id: "elbosque",
        kicker: "Talk · Universidad El Bosque",
        title: "Digital Creation program",
        summary: "A talk for students of the Digital Creation program about design, AI and creative process.",
        body: [
          "A conversation with students of Universidad El Bosque's Digital Creation program about designing with AI: writing, thinking and structuring better, without losing your hand, your eye or your style.",
        ],
        tags: ["Speaking", "Education", "AI"],
        links: [],
      },
      {
        id: "redacopio",
        kicker: "Product · Open source",
        title: "RedAcopio",
        year: "2026",
        summary: "An open-source platform to coordinate authorized donation drop-off points during emergencies.",
        body: [
          "After the M7.4 earthquake of 10 August 2026, northern Bogotá became a logistics hub. People wanted to help but didn't know where to go, what was needed, or whether a point was already full.",
          "The non-negotiable rule: nothing is public until an authorized entity verifies it. Each point shows what it needs, how crowded it is and when it was last updated — and any city can deploy its own instance.",
        ],
        tags: ["Product design", "UI", "Front-end", "Data model"],
        links: [{ label: "Visit live site", href: "https://redacopio-ten.vercel.app" }],
      },
      {
        id: "more",
        kicker: "And counting",
        title: "Many more",
        summary: "Experiments, mini apps and processes still in motion.",
        body: [
          "Prompt-Driven Design, generative image and video experiments, automation work for creative teams and small vibe-coded tools. Most of it lives in the Lab, on Instagram and on LinkedIn.",
        ],
        tags: ["Lab", "Experiments", "Automation"],
        links: [
          { label: "Open the lab", href: "/lab" },
          { label: "Instagram", href: "https://www.instagram.com/dani_masdesign/" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/danielcruzui/" },
        ],
      },
    ] as WorkItem[],
  },
  experience: {
    label: "Experience",
    // From LinkedIn (linkedin.com/in/danielcruzui), October 2026.
    jobs: [
      {
        period: "2026 — Now",
        company: "Mercado Libre",
        role: "UX/UI Designer",
        body: "User experience and AI applied to product, for teams across Latin America.",
      },
      {
        period: "2024 — 2025",
        company: "Flare BBDO",
        role: "UI Design Lead · Automation Team",
        body: "Led the design side of automation: creative prompting, visual design, client presentations and team management.",
      },
      {
        period: "2023 — 2024",
        company: "Flare BBDO",
        role: "Creative Engineer",
        body: "Interaction design and Figma systems bridging creative production and technology.",
      },
      {
        period: "2022 — 2023",
        company: "Grupo Sancho",
        role: "UI Designer · Graphic Designer",
        body: "User interfaces in Figma and graphic design for brand campaigns.",
      },
      {
        period: "2020 — 2021",
        company: "Starniza · Mercedes-Benz",
        role: "Creative Designer",
        body: "Digital interfaces for innovation projects, AI-enhanced visuals and marketing aligned with Mercedes-Benz global guidelines.",
      },
      {
        period: "2019 — 2020",
        company: "Dalh design · Ortix",
        role: "Freelance & Industrial Designer",
        body: "Where it started: illustration, retouching and industrial product design.",
      },
    ] as Job[],
    alsoLabel: "Also",
    also: [
      "Talks in the Dominican Republic and Mexico, invited by Zalo Rocks, on how AI and process design are reshaping workflows.",
      "Prompt-Driven Design — a living guide for designers using AI without losing their hand, eye or style (2025).",
    ],
    education: "Universidad Antonio Nariño",
  },
  labTeaser: {
    label: "Lab",
    title: "Things to",
    titleAccent: "poke at.",
    body: "Mini apps and half-ideas, vibe-coded in public. Play with them, break them, steal the idea.",
    cta: "Open the lab",
  },
  booking: {
    label: "Let's talk",
    title: "Book a",
    titleAccent: "space.",
    body: "Pick what you'd like to talk about, a day and a time. It opens an email with everything filled in — I'll reply to confirm.",
    typeLabel: "What about?",
    types: [
      { id: "talk", title: "Talk or workshop", body: "AI, processes and design for your team or event." },
      { id: "ai", title: "AI & process advisory", body: "Bring AI and automation into the way you work." },
      { id: "project", title: "Design project", body: "UX/UI, interfaces or a product idea." },
    ],
    dayLabel: "Day",
    timeLabel: "Time (Bogotá, GMT-5)",
    name: "Your name",
    email: "Your email",
    message: "Tell me a bit (optional)",
    submit: "Send request",
    directCta: "Or book directly on my calendar",
    unavailable: "Booking opens soon — meanwhile, write to me on LinkedIn.",
    subject: "Meeting request",
    note: "Suggested times; I'll confirm by email.",
  },
  cta: { label: "Let's talk", aria: "Book a conversation" },
  contact: {
    label: "Contact",
    title1: "Let’s make",
    titleAccent: "something",
    title2: "move.",
    footer: "No particles were harmed in the process.",
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
  nav: { about: "Sobre mí", work: "Trabajo", lab: "Lab", contact: "Contacto", agenda: "Hablemos", palette: "Cambiar paleta", menu: "Abrir menú", close: "Cerrar menú" },
  langModal: {
    title: "¿En qué idioma quieres leer?",
    body: "Puedes cambiarlo cuando quieras desde el menú.",
  },
  hero: {
    role: "Diseñador y orquestador de soluciones",
    region: "LATAM",
    hello: "¡Hola, soy",
    helloName: "Dani!",
    location: "Bogotá, Colombia",
    portraitAlt: "Retrato de Dani Cruz",
    tryIt: "Transforma",
    particles: "partículas",
    density: "Densidad",
    round: "Partículas redondas",
    scroll: "Pasa el cursor · haz scroll para dispersar ↓",
    ideaSpace: "Mi espacio de ideas",
    scrollTouch: "Toca y arrastra · haz scroll para dispersar ↓",
    settings: "Ajustes de partículas",
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
    title: "Resuelvo problemas",
    titleAccent: "desde distintas miradas.",
    intro: "No siempre llego al problema desde el mismo lugar. A veces hay que ordenar un proceso, otras diseñar una experiencia y otras enseñar a un equipo a trabajar de una manera distinta.",
    items: [
      {
        index: "01",
        title: "Orquesto procesos, sistemas y estructuras",
        body: "Conecto personas, herramientas y procesos para encontrar dónde se puede hacer mejor. Diseño workflows, automatizaciones y sistemas que convierten la complejidad en algo accionable.",
        tags: ["Workflows", "Automatización", "Sistemas"],
      },
      {
        index: "02",
        title: "Diseño experiencias digitales",
        body: "UX/UI, interfaces y sistemas visuales. Traduzco necesidades, comportamientos y objetivos en experiencias que funcionan y tienen sentido.",
        tags: ["UX/UI", "Interfaces", "Sistemas visuales"],
      },
      {
        index: "03",
        title: "Acompaño la adopción de IA",
        body: "Ayudo a equipos y personas a incorporar IA y vibe coding en su forma de trabajar: desde entender las posibilidades hasta construir workflows y probarlos en proyectos reales.",
        tags: ["IA", "Vibe coding", "Talleres"],
      },
    ],
  },
  work: {
    label: "Trabajo destacado",
    title: "Proyectos, charlas",
    titleAccent: "e ideas en movimiento.",
    hint: "Haz scroll o arrastra · toca una tarjeta para abrirla",
    hintTouch: "Desliza · toca una tarjeta para abrirla",
    open: "Abrir",
    close: "Cerrar",
    items: [
      {
        id: "zalo",
        kicker: "Charlas · República Dominicana y México",
        title: "Gira de IA y procesos con Zalo Rocks",
        year: "2026",
        summary: "Invitado por Zalo Rocks a compartir cómo los procesos y la IA están redefiniendo los flujos de trabajo y la automatización.",
        body: [
          "Charlas en República Dominicana y, antes, en México sobre cómo los procesos y la inteligencia artificial están redefiniendo los flujos de trabajo y la automatización en distintos sectores: salud, marketing, publicidad y medios digitales.",
          "El centro: metodologías que integran la IA no como un generador de resultados al azar, sino como un motor de lógica y automatización — con Figma como herramienta. A veces hasta un autolayout libera tiempo real en el día a día.",
        ],
        tags: ["Charlas", "IA", "Diseño de procesos", "Figma"],
        links: [{ label: "Publicación en LinkedIn", href: "https://www.linkedin.com/in/danielcruzui/recent-activity/all/" }],
      },
      {
        id: "elbosque",
        kicker: "Charla · Universidad El Bosque",
        title: "Programa de Creación Digital",
        summary: "Una charla para estudiantes del programa de Creación Digital sobre diseño, IA y proceso creativo.",
        body: [
          "Una conversación con estudiantes del programa de Creación Digital de la Universidad El Bosque sobre diseñar con IA: escribir, pensar y estructurar mejor, sin perder la mano, el ojo ni el estilo.",
        ],
        tags: ["Charlas", "Educación", "IA"],
        links: [],
      },
      {
        id: "redacopio",
        kicker: "Producto · Open source",
        title: "RedAcopio",
        year: "2026",
        summary: "Plataforma open-source para coordinar puntos de acopio autorizados durante emergencias.",
        body: [
          "Tras el terremoto M7,4 del 10 de agosto de 2026, el norte de Bogotá se volvió un centro logístico. La gente quería ayudar pero no sabía a dónde ir, qué se necesitaba o si un punto ya estaba lleno.",
          "La regla no negociable: nada es público hasta que una entidad autorizada lo verifica. Cada punto muestra qué necesita, qué tan lleno está y cuándo se actualizó — y cualquier ciudad puede desplegar su propia instancia.",
        ],
        tags: ["Diseño de producto", "UI", "Front-end", "Modelo de datos"],
        links: [{ label: "Ver sitio en vivo", href: "https://redacopio-ten.vercel.app" }],
      },
      {
        id: "more",
        kicker: "Y contando",
        title: "Muchos más",
        summary: "Experimentos, mini apps y procesos que siguen en marcha.",
        body: [
          "Prompt-Driven Design, experimentos de imagen y video generativo, automatizaciones para equipos creativos y pequeñas herramientas hechas con vibe coding. Casi todo vive en el Lab, en Instagram y en LinkedIn.",
        ],
        tags: ["Lab", "Experimentos", "Automatización"],
        links: [
          { label: "Entrar al lab", href: "/lab" },
          { label: "Instagram", href: "https://www.instagram.com/dani_masdesign/" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/danielcruzui/" },
        ],
      },
    ],
  },
  experience: {
    label: "Experiencia",
    jobs: [
      {
        period: "2026 — Hoy",
        company: "Mercado Libre",
        role: "Diseñador UX/UI",
        body: "Experiencia de usuario e IA aplicada a producto, para equipos de toda América Latina.",
      },
      {
        period: "2024 — 2025",
        company: "Flare BBDO",
        role: "UI Design Lead · Equipo de Automatización",
        body: "Lideré el diseño en automatización: prompts creativos, diseño visual, presentaciones a clientes y gestión del equipo.",
      },
      {
        period: "2023 — 2024",
        company: "Flare BBDO",
        role: "Creative Engineer",
        body: "Diseño de interacción y sistemas en Figma entre la producción creativa y la tecnología.",
      },
      {
        period: "2022 — 2023",
        company: "Grupo Sancho",
        role: "Diseñador UI · Diseñador gráfico",
        body: "Interfaces de usuario en Figma y diseño gráfico para campañas de marca.",
      },
      {
        period: "2020 — 2021",
        company: "Starniza · Mercedes-Benz",
        role: "Creative Designer",
        body: "Interfaces digitales para proyectos de innovación, visuales con IA y marketing alineado a los lineamientos globales de Mercedes-Benz.",
      },
      {
        period: "2019 — 2020",
        company: "Dalh design · Ortix",
        role: "Diseñador freelance e industrial",
        body: "Donde empezó todo: ilustración, retoque y diseño industrial de producto.",
      },
    ],
    alsoLabel: "Además",
    also: [
      "Charlas en República Dominicana y México, invitado por Zalo Rocks, sobre cómo la IA y el diseño de procesos están redefiniendo los flujos de trabajo.",
      "Prompt-Driven Design — una guía viva para diseñadores que usan IA sin perder su mano, su ojo ni su estilo (2025).",
    ],
    education: "Universidad Antonio Nariño",
  },
  labTeaser: {
    label: "Lab",
    title: "Cosas para",
    titleAccent: "jugar.",
    body: "Mini apps y medias ideas, hechas con vibe coding en público. Juega con ellas, rómpelas, llévate la idea.",
    cta: "Entrar al lab",
  },
  booking: {
    label: "Hablemos",
    title: "Agenda un",
    titleAccent: "espacio.",
    body: "Elige de qué quieres hablar, un día y una hora. Se abre un correo con todo listo y te respondo para confirmar.",
    typeLabel: "¿Sobre qué?",
    types: [
      { id: "talk", title: "Charla o taller", body: "IA, procesos y diseño para tu equipo o evento." },
      { id: "ai", title: "Asesoría en IA y procesos", body: "Incorporar IA y automatización a tu forma de trabajar." },
      { id: "project", title: "Proyecto de diseño", body: "UX/UI, interfaces o una idea de producto." },
    ],
    dayLabel: "Día",
    timeLabel: "Hora (Bogotá, GMT-5)",
    name: "Tu nombre",
    email: "Tu correo",
    message: "Cuéntame un poco (opcional)",
    submit: "Enviar solicitud",
    directCta: "O agenda directo en mi calendario",
    unavailable: "La agenda abre pronto — mientras tanto, escríbeme por LinkedIn.",
    subject: "Solicitud de reunión",
    note: "Horarios sugeridos; confirmo por correo.",
  },
  cta: { label: "Hablemos", aria: "Agendar una conversación" },
  contact: {
    label: "Contacto",
    title1: "Hagamos que",
    titleAccent: "algo",
    title2: "se mueva.",
    footer: "Ninguna partícula fue dañada en el proceso.",
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

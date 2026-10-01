# Dani Cruz — Portafolio

Sitio personal de Dani Cruz, diseñador y orquestador de soluciones.
**En vivo:** https://portfolio-dani-cruz.vercel.app

Bilingüe (ES/EN), con un header de partículas interactivo, secciones con scrollytelling,
una galería de trabajo, un Lab de mini apps y una agenda para conversar.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS 3** para estilos; tipografías de Google Fonts (Instrument Serif, Inter Tight, JetBrains Mono)
- **Framer Motion** para scrollytelling y transiciones · **GSAP** solo para el botón "Hablemos"
- **Canvas 2D** escrito a mano para el header de partículas (sin librerías)
- **Vercel** para hosting, Web Analytics y Speed Insights

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # typecheck + build de producción en /build
npm run typecheck
```

Node 22 (ver `.nvmrc` y `engines` en `package.json`).

## Publicar

Todo lo que entra a `main` se publica solo en Vercel. Para probar antes:

1. Crea una rama (`git switch -c mi-cambio`) y súbela.
2. Vercel genera una URL de vista previa para esa rama — revísala en el teléfono.
3. Si todo está bien, haz merge a `main`.

## Estructura

```
src/
  App.tsx              Rutas (/, /lab, /lab/:slug), providers y orden de secciones
  index.css            Tokens de color, tipografías y clases utilitarias (.glass, .btn, .field…)
  assets/              Fotos del header (WebP)
  site/
    content.ts         ← TODOS los textos del sitio, en español e inglés
    i18n.tsx           Idioma activo + modal de idioma
    palette.tsx        Paletas de color (variables CSS --accent, --accent-2, --surface)
    router.tsx         Router mínimo con History API + componente <Link>
    Hero.tsx           Carrusel de partículas (canvas)
    Manifesto.tsx      "Sobre mí" con palabras que se iluminan al hacer scroll
    Inspiration.tsx    Tarjeta con el post de Instagram de La Fórmula
    Capabilities.tsx   "Qué hago": tarjetas apiladas
    Featured.tsx       Galería de trabajo + detalle de cada proyecto
    Chrome.tsx         Menú, experiencia y pie de página
    Playground.tsx     Vista previa del Lab en el home
    Booking.tsx        Agenda tipo Calendly (abre un correo prellenado)
    TalkButton.tsx     Botón flotante "Hablemos" (GSAP)
    lab/               Página del Lab y sus mini apps
public/                favicon.svg y og-image.jpg (imagen al compartir en redes)
```

## Tareas comunes

**Cambiar un texto** → `src/site/content.ts`. Cada texto existe en `en` y `es`; TypeScript avisa si falta uno.

**Agregar una foto al carrusel del header**
1. Convierte a WebP (~1600 px de ancho): `cwebp -q 85 -resize 1600 0 foto.jpg -o src/assets/hero-5.webp`
2. Impórtala en `src/site/Hero.tsx` y agrégala a `SLIDES`.
3. Opcionales por foto: `cutoff` (sube el umbral si el fondo es gris) y `focusX` (0–1, punto focal horizontal en teléfonos).
   Funcionan mejor las fotos con luz de contorno o alto contraste sobre fondo negro o en degradado.

**Agregar un proyecto a la galería** → agrega un item en `work.items` (en ambos idiomas) en `content.ts`.
Si es un tipo nuevo, crea su portada en `Featured.tsx` (objeto `covers`) y agrega su `id` al tipo `WorkItem`.

**Agregar una mini app al Lab**
1. Crea el componente en `src/site/lab/`.
2. Agrega sus textos en `labs.<slug>` (título, blurb, idea, how) en ambos idiomas.
3. Regístrala en `src/site/lab/experiments.tsx`.

**Activar la agenda** → en `content.ts`, completa `profile.email` (recibe las solicitudes) y/o `profile.bookingUrl` (Calendly o Cal.com).

## Analítica

Vercel Web Analytics (sin cookies) y Speed Insights están integrados en `App.tsx`.
Se activan desde el dashboard del proyecto en Vercel. Eventos propios: `cta_click` y `booking_request`.

## Mantenimiento

- **Dependabot** abre PRs semanales de actualización (`.github/dependabot.yml`). Cada PR tiene su vista previa en Vercel: revísala antes de hacer merge.
- Los archivos en `/assets/*` se sirven con caché inmutable de un año (`vercel.json`); sus nombres cambian en cada build.

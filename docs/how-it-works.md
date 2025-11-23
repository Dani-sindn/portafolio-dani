# How It Works

This document provides an overview of the project's architecture and the technologies used.

## Tech Stack

- **Framework**: [React](https://react.dev/) - A JavaScript library for building user interfaces.
- **Build Tool**: [Vite](https://vitejs.dev/) - A fast build tool and development server.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Adds static typing to JavaScript for better developer experience and code quality.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
- **UI Components**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components for building high-quality design systems.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - A production-ready motion library for React.

## Project Structure

```
portafolio-dani/
├── docs/               # Project documentation
├── public/             # Static assets (images, favicon, etc.)
├── src/                # Source code
│   ├── components/     # Reusable UI components
│   │   ├── ui/         # Base UI components (buttons, inputs, etc.)
│   │   └── ...         # Feature-specific components
│   ├── lib/            # Utility functions and helpers
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles and Tailwind directives
├── package.json        # Project metadata and dependencies
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Key Concepts

### Component Architecture
The project follows a component-based architecture. Small, reusable components are built using Radix UI primitives and styled with Tailwind CSS. These are located in `src/components/ui`. Complex features are composed of these smaller components.

### Styling
We use Tailwind CSS for styling. Utility classes are applied directly to elements. For conditional styling and class merging, we use `clsx` and `tailwind-merge` (often via a `cn` utility function in `src/lib/utils.ts`).

### Routing
(If applicable) The project currently uses a single-page application structure. If routing is added later, it will likely be handled by `react-router-dom` or similar.

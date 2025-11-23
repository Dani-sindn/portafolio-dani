# Developer Notes

This document contains guidelines and tips for developers working on this project.

## Best Practices

### Component Creation
- **Reusability**: Before creating a new component, check `src/components/ui` to see if a similar primitive already exists.
- **Naming**: Use PascalCase for component filenames and function names (e.g., `MyComponent.tsx`).
- **Props**: Define clear interfaces for component props using TypeScript.

### Styling with Tailwind
- **Utility First**: Try to use utility classes for everything. Avoid writing custom CSS in `index.css` unless absolutely necessary.
- **Consistency**: Use the theme values defined in `tailwind.config.js` (colors, spacing, etc.) to maintain visual consistency.
- **Responsiveness**: Use Tailwind's responsive prefixes (e.g., `md:flex`, `lg:w-1/2`) to build mobile-first layouts.

## Where to Edit

- **Global Styles**: `src/index.css` - Contains Tailwind directives and base styles.
- **Theme Configuration**: `tailwind.config.js` - Customize colors, fonts, and breakpoints here.
- **Main Layout**: `src/App.tsx` - The root component where the main layout structure is defined.
- **Assets**: Place static images and files in the `public/` directory.

## Common Tasks

### Adding a New UI Component
1.  Check if it's available in the Shadcn UI / Radix UI ecosystem.
2.  Create the file in `src/components/ui/`.
3.  Export it and use it in your pages.

### Updating Dependencies
Run `npm update` to update dependencies to their latest compatible versions. Always check for breaking changes in major updates.

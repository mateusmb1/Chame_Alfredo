# Structure

## Directory Overview

- `components/`: Global UI components.
- `pages/`: Main application screens, organized by feature or portal (e.g., `pages/client/`).
- `contexts/`: React context providers.
- `hooks/`: Custom React hooks.
- `lib/`: Configuration for external libraries (Supabase).
- `types/`: TypeScript definitions.
- `utils/`: Helper functions.
- `assets/`: Static assets like images and styles.
- `public/`: Publicly accessible files.
- `downloader/`: Integrated module for invoices and products.
- `supabase/`: Database configuration and potentially edge functions.
- `migrations/`: Database migration files.
- `testsprite_tests/`: E2E/Integration test suite using TestSprite.
- `scripts/`: Maintenance and utility scripts (e.g., mascot conversion).

## Key Files
- `App.tsx`: Main application entry point with route definitions.
- `index.tsx`: React mounting point.
- `index.html`: Global template and Tailwind CDN configuration.
- `package.json`: Dependency and script management.
- `vite.config.ts`: Build tool configuration.
- `vercel.json`: Deployment configuration.

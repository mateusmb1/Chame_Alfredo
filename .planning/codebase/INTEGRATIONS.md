# Integrations

## Supabase
- **Role**: Primary backend, database, and authentication provider.
- **Client Initialization**: Located in `src/lib/supabase.ts`.
- **Resources**: Database schema and migrations are managed in the `supabase/` and `migrations/` directories.

## Vercel
- **Role**: Hosting and deployment platform.
- **Configuration**: `vercel.json` in the root directory.

## Google Fonts
- **Fonts**: Inter (for display and body) and Material Symbols Outlined.
- **Loading**: Loaded via standard link tags in `index.html`.

## Tailwind CSS CDN
- **Configuration**: Customized in a script tag within `index.html`, including dark mode and custom color tokens (primary, status colors, etc.).
- **Plugins**: uses `forms` and `container-queries` plugins.

## Schema.org JSON-LD
- **Purpose**: Local business SEO data for "Chame Alfredo".
- **Location**: Embedded in `index.html`.

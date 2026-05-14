# Conventions

## Coding Standards
- **Language**: TypeScript is used throughout for type safety.
- **Component Style**: Functional components with hooks are preferred.
- **Naming**:
  - Components and Pages: `PascalCase`.
  - Folders and Utilities: `camelCase` or `kebab-case`.
  - CSS Classes: Standard Tailwind utility classes.

## Styling
- **Framework**: Tailwind CSS.
- **Method**: Utility-first styling directly in JSX/TSX.
- **Icons**: Lucide React for consistent iconography.
- **Animations**: Framer Motion for UI transitions and micro-interactions.

## Directory Structure
- There is some overlap between root directories and `src/` directories. New development should likely favor the `src/` structure if that's the intended direction.
- Components are separated from pages to promote reusability.

## Data Fetching
- **Supabase**: Direct interaction with Supabase using the JS client.
- **Context**: State shared across components is handled via specific contexts.

# Concerns

## Technical Debt
- **Tailwind CDN**: Loading Tailwind via CDN in `index.html` is not recommended for production as it increases initial load time and can cause layout shifts.
- **Directory Duplication**: Existence of top-level `components`, `pages`, `hooks`, etc., alongside a `src/` directory containing similar folders. This creates confusion about where new code should live.
- **Large Main Component**: `App.tsx` is becoming monolithic, handling all routing, layout logic, and multiple portal wrappers.

## Maintenance
- **Importmap**: Use of `importmap` for React and other dependencies can lead to versioning issues that are harder to track than standard `package.json` management.
- **Third-party Bloat**: The `downloader/` directory appears to be an external module integrated directly into the source, which may have its own maintenance lifecycle.

## Quality Assurance
- **Lack of Unit Tests**: While E2E tests exist, the absence of unit and component tests makes it harder to catch regressions early in development.
- **Performance**: Use of many dynamic libraries and CDN loads may impact mobile performance, which is critical for the technician portal.

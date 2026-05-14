# Testing

## Automated Testing
- **E2E/Integration**: The project uses `testsprite`, a Python-based testing tool.
- **Location**: Test cases are found in `testsprite_tests/`.
- **Coverage**: Includes performance tests, synchronization checks, RBAC verification, and usability audits.
- **Reports**: HTML and Markdown reports are generated in the `testsprite_tests/` directory.

## Manual Testing
- Testing seems focused on verifying the integration between the frontend portals and the Supabase backend.
- Mobile responsiveness is a key testing area (verified by specific test cases).

## Missing Layers
- **Unit Testing**: No explicit unit testing framework (like Vitest or Jest) was identified in the dependencies.
- **Component Testing**: Similar to unit testing, no dedicated library for component-level testing is present.

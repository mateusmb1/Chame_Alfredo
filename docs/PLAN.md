# 📋 Plan: Operational Command Center Fixes

The Command Center implementation has introduced two critical issues:
1. **CSS Leakage**: Raw design tokens and comments are visible at the top of the interface.
2. **Chart Rendering Errors**: Recharts components are failing to determine container dimensions.

## Proposed Strategy

### 1. Style leakage in `index.html`
- **Root Cause**: Missing `<style>` opening tag before the Command Center CSS tokens.
- **Fix**: Add `<style>` tag correctly after line 50.

### 2. Chart Dimension Errors in `Dashboard.tsx`
- **Root Cause**: `ResponsiveContainer` requires a parent with defined height. In logic-heavy components, initial render might provide invalid dimensions.
- **Fix**: Ensure `WidgetCard` or its internal container provides a calculated or fixed minimum height. Check for conditional rendering race conditions.

### 3. Layout Duplication
- **Observation**: The screenshot shows multiple sidebars/topbars.
- **Root Cause**: `AppLayout` updated to wrap with `DashboardShell`, but some pages might still have their own internal layout logic or hardcoded navigation.
- **Fix**: Audit `Dashboard.tsx` and `App.tsx` routes.

---

## Proposed Changes

### [Frontend Components]

#### [MODIFY] [index.html](file:///c:/Users/Mateus.B.Silva/OneDrive - Mota-Engil/Documentos/Documentos/Eu/SaaS/Chame_Alfredo/Chame_Alfredo/index.html)
- Add `<style>` tag opening at line 51.

#### [MODIFY] [Dashboard.tsx](file:///c:/Users/Mateus.B.Silva/OneDrive - Mota-Engil/Documentos/Documentos/Eu/SaaS/Chame_Alfredo/Chame_Alfredo/pages/Dashboard.tsx)
- Adjust containers for `ResponsiveContainer` to guarantee height.

#### [MODIFY] [DashboardShell.tsx](file:///c:/Users/Mateus.B.Silva/OneDrive - Mota-Engil/Documentos/Documentos/Eu/SaaS/Chame_Alfredo/Chame_Alfredo/components/layout/DashboardShell.tsx)
- Ensure layout blocks (Sidebar/Topbar) are correctly structured to prevent duplication.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` to check for JSX/TS errors.

### Manual Verification
- Confirm with user if CSS code is gone from the header.
- Verify if charts are rendering correctly.

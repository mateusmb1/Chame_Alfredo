# Architecture

## Application Structure
The application is a multi-portal system built with React and Vite. It serves three primary user groups:
1. **Admin Portal (Default)**: For managing orders, clients, inventory, and team members.
2. **Client Portal (`/client/*`)**: For clients to view quotes, invoices, and reports.
3. **Mobile/Technician App (`/mobile/*`)**: A mobile-optimized interface for technicians to manage their agenda and service orders.

## Navigation and Layout
- **Routing**: Managed by `react-router-dom`. Routes are centralized in `App.tsx`.
- **Layouts**: 
  - `Layout`: Default admin layout.
  - `MobileLayout`: Specialized layout for the technician app.
  - `ClientLayout`: Specialized layout for the client portal.
  - `DashboardShell`: An alternative admin layout for the "commandCenter" theme.

## State Management
- **Context API**: Global state is managed using React Contexts:
  - `AppContext`: Likely for general app data.
  - `ToastContext`: For notifications.
  - `DashboardThemeContext`: For managing UI themes (default vs commandCenter).

## Feature Modules
- **Downloader Module**: Located in `downloader/`, this directory contains its own pages and logic for handling invoices and products, possibly indicating a shared or third-party module integration.
- **Supabase**: Handles data persistence and likely authentication.

# Copilot Context (NB_PEM)

## Purpose
This file captures a concise, up-to-date overview of the project so new work starts with the right context.

## Project Summary
- React 18 + TypeScript app for document checklist management.
- Built with Vite; styling via Tailwind and shadcn/ui.
- State: Zustand + React context/hooks.
- Data: Axios client + TanStack Query.
- Auth: MSAL for Azure AD (currently commented out).
- Testing: Jest + React Testing Library.

## Key Paths
- App entry: src/main.tsx
- Router: src/app/router
- Providers: src/app/providers
- Shared UI: src/shared/components/ui
- Data table system: src/shared/components/data-table
- Shared hooks: src/shared/hooks
- State stores: src/shared/store
- Features: src/features/*

## Data Table System (High Level)
- Store: src/shared/store/tableStore.ts (per-table state by tableid).
- Hook: src/shared/hooks/data-table/use-data-table.ts (binds store to TanStack Table).
- UI: src/shared/components/data-table/data-table.tsx (render rows/headers/pinning).
- Controls: filter list/menu, sort list, view options, pagination, action bar.
- Column factories: src/shared/components/data-table/column/* (text/date/boolean/action).

## Notes
- Table pagination/sorting/filtering are manual (server-driven) by default.
- Filters/sorts update Zustand state; pages typically reset on filter changes.
- Column meta controls filter variants and labels.

## Environment
- OS: Windows
- Package manager: pnpm
- Common commands:
  - pnpm dev
  - pnpm build
  - pnpm lint
  - pnpm test

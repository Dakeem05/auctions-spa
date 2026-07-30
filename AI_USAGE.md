# AI Usage

## What was done with AI assistance

- Initial scaffold of TypeScript types from the OpenAPI schema (`shared/types/api.types.ts`)
- MSW handler boilerplate and seed data generation
- Tailwind class suggestions for UI components
- TanStack Router route tree structure

## Decisions made independently

- FSD folder structure layout and how to divide responsibilities across layers
- Choosing Zustand for toast state only (not for server state — that stays in TanStack Query)
- Route file naming strategy to handle TanStack Router's `_` flat-route convention alongside nested folders
- Decision to hand-write the `routeTree.gen.ts` manually rather than rely on the Vite plugin generating it at build time, to ensure a stable build in environments without the dev server running first
- Separating `createBetSchema` as a factory function that accepts min/max/step at runtime rather than at schema definition time

## AI suggestions that were rejected

- AI suggested using a context provider for the query client — rejected in favour of the standard pattern at the root
- AI suggested putting filter state in Zustand — rejected because filter state belongs in the URL, not client state
- AI suggested using `any` types in several places — replaced with proper TypeScript types throughout

## Places checked especially carefully

- `applyBet` function in the MSW store — this mutates shared in-memory state and had to correctly update the list item, detail response, and bets array simultaneously without causing stale data on re-fetch
- The `createBetSchema` Zod factory — the `refine` chain ordering matters; min/max/step validation must not run when price is 0 or negative
- Route tree import paths — the deeply nested `auctions_/$uuid/bets.new.tsx` required `../../../../shared/` (4 levels) while `auctions_/$uuid.tsx` required `../../../shared/` (3 levels)
- The `validateSearch` on the auctions list route — all filters use `.catch()` on the Zod schema to ensure a malformed URL never crashes the page

## Risks that remain

- The hand-written `routeTree.gen.ts` will be overwritten if the TanStack Router Vite plugin runs. This is expected behaviour — the generated file is the source of truth in a real project.
- No unit tests written yet. The schema validation and search params parsing logic are the highest priority candidates for testing.
- MSW store is a simple mutable object — not thread-safe, but acceptable for a browser mock.

## What would be improved with one more day

- Add Vitest unit tests for: `AuctionFiltersSchema.parse()`, `createBetSchema` edge cases, `applyBet` mutations
- Add a minimal E2E scenario with Playwright: load list, open detail, place bid, verify bets list updated
- Improve mobile layout on the detail page — currently readable but not optimised
- Add an auction status badge colour map that is more semantically consistent
- Implement the `statuses` (multi-select) filter field in the UI

# Auctions SPA

SPA for working with freight auctions — React + Vite + TanStack Router/Query.

## Stack

- React + TypeScript
- Vite
- TanStack Router (file-based routing)
- TanStack Query (server state)
- React Hook Form + Zod (forms + validation)
- MSW (API mocking in browser)
- Zustand (toast UI state)
- Tailwind CSS v4
- Feature-Sliced Design

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Routes

| Path | Description |
|---|---|
| `/auctions` | List with filters and pagination |
| `/auctions/:uuid` | Auction detail |
| `/auctions/:uuid/bets` | Bids history |
| `/auctions/:uuid/bets/new` | Place a bid |

## Project structure

```
src/
  app/routes/       # TanStack Router file-based routes
  shared/
    api/            # Client, endpoint functions, query keys
    lib/            # Formatters, Zod schemas
    mocks/          # MSW handlers + in-memory store (40 seeded auctions)
    types/          # TypeScript types from OpenAPI schema
    ui/             # Badge, Skeleton, Toast, Pagination
  widgets/          # AuctionCard, AuctionFilters
```

## MSW mock behaviour

The store holds 40 seeded auctions. `POST /auctions/:uuid/bets` mutates the in-memory store — updating current price, user trading status, and the bets list. Subsequent GET calls return the updated state.

## What was verified

- List loads, paginates, filters (all 10+ filter fields)
- Filters sync to URL search params with Zod safe fallbacks
- Detail shows organizer, cargo, trading, payment, route points
- `hide_bets_history` shows locked state on bets page
- `hide_points_address_and_contacts` hides addresses
- `no_view_cargo_price` hides cargo price
- Bid form disabled when `can_set_bet` is false
- Bid form validates min, max, step
- 422 errors surfaced per field
- After bid: list + detail + bets queries invalidated
- Prefetch on card hover
- Skeleton, empty, and error states on all pages
- Toast on bid success and error

## Known limitations

- Unit tests not yet added (schemas and search params parsing are priority candidates)
- No map view for route points

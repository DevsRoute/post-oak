# Northledger — Business Banking App

A full multi-page business-banking web app built with **React + TypeScript +
Vite**. It reproduces the structure, layout and navigation of a modern fintech
banking product — every nav section is a real page, with working tabs, search,
sorting, filters and dialogs — under its own original "Northledger" branding and
palette. All data is placeholder sample data.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Build for production:

```bash
npm run build && npm run preview
```

## What's included

**Pages** (hash-routed — every sidebar link works):

| Route | Page |
| --- | --- |
| `/` | Home dashboard — balance chart, accounts, module cards, money in/out, transactions |
| `/tasks` | Tasks — Incomplete / Completed tabs |
| `/command` | Command — assistant-style prompt screen |
| `/accounts` | Accounts — Available/Pending summary + accounts table |
| `/accounts/treasury` | Treasury — balance, yield, portfolio, activity |
| `/accounts/financing` | Financing — capital options |
| `/transactions` | Transactions — search, direction filter, sortable table, running totals |
| `/insights` | Insights — cashflow bar chart + Top money in / out tables |
| `/cards` | Cards — grouped by cardholder with status chips |
| `/team-spend/budgets` · `/reimbursements` · `/policies` | Team Spend |
| `/payments/bill-pay` · `/recipients` · `/taxes` · `/wire-drawdowns` · `/ach` · `/checkbooks` | Payments |
| `/invoicing` · `/series` · `/customers` · `/catalog` | Invoicing |
| `/accounting` | Accounting — books setup |

**Dialogs** (open from the top bar, quick actions, and buttons across pages):
Move money launcher, Send, Transfer, Deposit, Request, Upload bill, Create
account, Create card, Request/Create invoice, and a ⌘K command palette that
searches pages and actions.

**Interactive behavior**: sortable tables (click any header), live search and
filtering on Transactions, tabbed sub-navigation, light/dark theme toggle
(saved to `localStorage`), and forms with a success state.

## Making it yours

- **Branding** — `BRAND` in `src/data.ts` and the mark in `src/components/Logo.tsx`.
- **Colors / theme** — tokens at the top of `src/index.css` (`:root` + the two
  dark blocks). Change `--accent` to re-skin everything.
- **Data** — `src/data.ts` (dashboard) and `src/pagedata.ts` (all other pages).
  Types live in `src/types.ts` and inline in `pagedata.ts`. Swap for your API.

## Structure

```
src/
  App.tsx              shell + route outlet
  router.tsx           tiny hash router (useRoute, navigate, Link)
  routes.ts            nav + route definitions
  useTheme.ts          light/dark hook
  index.css            design tokens + globals
  data.ts, pagedata.ts sample data
  types.ts, format.ts  types + currency helpers
  components/          Sidebar, TopBar, DataTable, ui primitives, dashboard cards, icons
  modals/              ModalContext/Host + every dialog
  pages/               one file per nav section
```

The router is a ~50-line zero-dependency hash router so the project installs
with just React. Swap in `react-router-dom` later if you prefer — pages read the
path via `useRoute()` / `useSegments()`.
# post-oak

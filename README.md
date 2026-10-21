# VELOOP Rewards — React experience

A complete, responsive **frontend prototype** built with React, TypeScript and Vite. It expands the original VELOOP landing page into a public website and interactive member workspace, retaining honest simulated-data labelling throughout.

**No production backend is connected.** There is no real authentication, advertising, referral attribution, cryptocurrency mining, email delivery or payment processing. All other explorers, rewards and transactions are fictional. Demo progress is stored only in the current browser.

## Start locally

Use Node.js **22.12+** (Node 24 LTS is also supported).

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. Use **Find your loop** to open the member experience. The optional **Enter demo** flow accepts a sample display name, without credentials.

```bash
npm run build          # TypeScript check + production bundle in dist/
npm run preview        # Serve production bundle
npm test               # Domain and ledger tests
npm run test:browser   # End-to-end journey, responsive routes, accessibility audit
```

Before running browser tests on a new machine, install the test browser:

```bash
npx playwright install chromium
```

`BROWSER_EXECUTABLE` optionally points to an existing Chromium binary. `QA_OUTPUT` changes the screenshot/audit destination (default `/tmp/veloop-qa`). Tests start and stop their own Vite server on 127.0.0.1:5188. Browser test artifacts are temporary and are not part of the application.

## Included experiences

| Area                   | Functionality                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Public website         | Responsive landing page, product features, wallet explainer, about, help, privacy and demo terms                                    |
| Overview               | Current virtual balance, pending rewards, task progress, streak, dynamic reward chart and recommendations                           |
| Explore & earn         | Search, categories, sorting, available-only filter, activity details and one-time demo task completion                              |
| Daily check-in         | 50 virtual VEs and 25 XP, once per local calendar day; consecutive-day streak calculation                                           |
| Reward session         | A 60-second saved timer, cross-page/reload continuation, one-time reward claim and daily session limit; no crypto mining            |
| Missions               | Completion milestones, one-time bonus claims, XP, levels and unlockable badges                                                      |
| Lucky spin             | Six random virtual outcomes, one free spin per local day, reduced-motion support and wallet credit                                  |
| Wallet                 | Ledger-derived balances, pending states, search, status filters, pagination, details and CSV export                                 |
| Demo redemption        | Whole-VEs input validation, available-balance checks, reservation, request history and cancellation with point release              |
| Referrals              | Clipboard invite link, manual fallback, bounded fictional activations and corresponding virtual credits                             |
| Leaderboard            | Clearly fictional explorers ranked by XP, with the local profile's position updated dynamically                                     |
| Analytics              | Ledger-derived 7/30-day charts, area/bar toggle, accessible chart table, source breakdown, definitions, local events and CSV export |
| Help                   | Searchable/category-filtered FAQ and local-only support request examples                                                            |
| Settings               | Demo profile, goal, dark/light appearance, motion, sample email preference, JSON export and confirmed reset                         |
| Local waitlist example | Browser validation and explicit local-storage consent; no subscription or email delivery                                            |
| Navigation             | Member/public routing, responsive mobile navigation, page search, update dialog, profile menu and not-found page                    |

Daily dates follow the device's local calendar. Sample transaction timestamps are ISO timestamps and are grouped by local day for charts. The welcome ledger contains 1,250 credited virtual VEs plus a separate 120 pending VEs; pending credits never increase spendable balance.

## Routes

Public: `/`, `/features`, `/rewards-wallet`, `/about`, `/help`, `/privacy`, `/terms`.

Member: `/app`, `/app/earn`, `/app/wallet`, `/app/session`, `/app/missions`, `/app/spin`, `/app/referrals`, `/app/leaderboard`, `/app/analytics`, `/app/help`, `/app/settings`.

The original broken `/dashboard` link now redirects to `/app/analytics`.

## Single-file preview

```bash
npm run build:standalone
```

`standalone/index.html` embeds React, styles, charts and fonts. It uses hash routing, so it can be opened directly as a file and navigated without a server. Its browser storage is separate from a hosted deployment and depends on the browser's file-storage policy. The normal production build uses clean browser URLs.

## Deploy to Vercel

Import this project, select **Vite**, and use `npm run build` with output directory `dist`. `vercel.json` includes route rewrites and security headers. Verify that direct navigation to `/app/wallet`, `/features` and `/dashboard` works after deployment.

This package does **not** modify or replace the existing GitHub repository or Vercel deployment. Review changes in a branch before replacing the existing site. A custom domain should be configured before adding absolute canonical URLs or social images; no deployment domain is invented in this source.

## Project structure

```text
src/
  App.tsx                 Routes, lazy page loading and feedback
  main.tsx                React setup and browser/hash routing
  model.ts                Typed state, reducer, ledger rules and export utilities
  store.tsx               Shared state, persistence, preferences and toast messages
  styles.css              Responsive design system, dark appearance and reduced motion
  components/
    Layout.tsx            Member navigation, search, profile and updates
    Chart.tsx             Reward aggregation and responsive charts
    ui.tsx                Shared cards, dialogs, badges and task interaction
  pages/                  Public website and individual member screens
tests/
  model.test.ts           Ledger, duplicate-claim, recovery and session invariants
  browser.smoke.mjs        Browser journeys, route layouts and axe audits
vite.config.ts             Normal multi-file production build
vite.standalone.config.ts  Embedded single-file preview build
vercel.json                SPA rewrites and deployment headers
```

## Production integration handoff

Treat this frontend as the interaction/design layer. Before accepting real users:

1. Replace demo entry with managed authentication and server-verified sessions. Enforce authorization for every profile and wallet query. LocalStorage is not an authentication boundary.
2. Move reward and redemption mutations to an authoritative backend. Use idempotency keys, transactional reservations, unique claim constraints, a ledger and verified partner callbacks. A client-side timer, spin or button must never award real funds.
3. Define product-approved eligibility, limits, conversion rules and reversal behavior. Gems and Tokens have no assigned value or conversion in this demo.
4. Use backend-issued referral codes and verified qualifying events; do not pay for client-simulated activations.
5. Connect waitlist and support forms to approved services with server validation, abuse controls, consent records and retention rules. Update the local-only copy only when integration is working.
6. Implement governed event collection from the original analytics blueprint. Keep unnecessary PII out of analytics; supply versioned contracts, UTC event timestamps, identity rules and deduplication.
7. Add real monitoring, observability, accessibility review, privacy/terms and payment-provider integration before launch.

The demo is intentionally client-editable and is not suitable for real financial balances. It does not synchronize concurrent tabs/devices; refreshing uses the latest state saved by this browser. CSV exports escape fields and neutralize text formula prefixes.

## Attribution and dependencies

Inspired by Iqra Siddiqui's original projects:

- https://github.com/iqra-insights/veloop-rewards-landing-page
- https://github.com/iqra-insights/veloop-rewards-analytics-blueprint

Uses React, React Router, Lucide icons, Recharts, Manrope and DM Serif Display. Fonts are bundled locally; no font CDN or analytics service is required. Dependency licenses are provided in `licenses/` and by the installed packages. See `THIRD_PARTY_NOTICES.md`.

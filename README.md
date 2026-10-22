# VELOOP Rewards - React Prototype

![React](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Vite](https://img.shields.io/badge/Vite-7-646cff) ![Data](https://img.shields.io/badge/data-simulated-orange) ![Deploy](https://img.shields.io/badge/deployed%20on-Vercel-black)

**Live demo:** https://veloop-rewards-landing-page-bay.vercel.app/

A responsive frontend prototype for **VELOOP Rewards**, a rewards and engagement platform that is still in development. It combines a public website (landing page, features, wallet explainer, about, help, privacy and demo terms) with an interactive member workspace: wallet ledger, daily check-in, tasks, missions, lucky spin, referrals, leaderboard and an analytics dashboard.

> **Everything is simulated.** No production backend is connected: no real authentication, advertising, referral attribution, payments, e-mail delivery or payouts. Balances, rewards and leaderboard entries are fictional. Demo progress is stored only in the current browser.

## Highlights

- **Responsive and accessible:** mobile navigation, keyboard-friendly controls, reduced-motion support, dark and light appearance.
- **Ledger-based wallet:** balances are derived from ledger entries; pending rewards never count as spendable; redemption requests reserve and can release points.
- **Habit mechanics:** daily check-in with streaks, timed reward session, missions with XP, levels and badges, a once-a-day lucky spin.
- **Analytics dashboard:** 7/30-day charts, accessible chart table, source breakdown, metric definitions and CSV export.
- **Honest by design:** no invented user counts, ratings, testimonials or earning promises; every sample value is labelled.
- **Tested domain logic:** unit tests for the ledger, duplicate claims, streak dates and CSV escaping, plus a browser smoke test (see `VALIDATION.md`).

## Tech stack

React 19, TypeScript (strict), Vite 7, React Router, Recharts, Lucide icons. Fonts (Manrope, DM Serif Display) are bundled locally; no CDN and no third-party analytics.

## Run locally

Requires Node.js 22.12 or newer.

```bash
npm ci
npm run dev        # development server
npm run build      # type check + production bundle in dist/
npm run preview    # serve the production bundle
npm test           # domain and ledger tests
npm run test:browser   # end-to-end journey and accessibility audit
```

Before the browser test on a new machine: `npx playwright install chromium`.

## Routes

| Public | Member workspace |
| --- | --- |
| `/`, `/features`, `/rewards-wallet`, `/about`, `/help`, `/privacy`, `/terms` | `/app`, `/app/earn`, `/app/wallet`, `/app/session`, `/app/missions`, `/app/spin`, `/app/referrals`, `/app/leaderboard`, `/app/analytics`, `/app/help`, `/app/settings` |

`/dashboard` redirects to `/app/analytics`.

## Project layout

The repository uses a flat layout (source files in the root) so it can be maintained entirely through the GitHub web interface.

```text
.
|-- index.html, main.tsx, App.tsx        entry point and routes
|-- Layout.tsx, ui.tsx, Chart.tsx        shared components
|-- Overview.tsx, Earn.tsx, Wallet.tsx, Missions.tsx, Session.tsx,
|   Spin.tsx, Referrals.tsx, Leaderboard.tsx, Analytics.tsx,
|   Help.tsx, Settings.tsx, Marketing.tsx   pages
|-- model.ts, store.tsx                  state, ledger rules, persistence
|-- model.test.ts, browser.smoke.mjs     tests
|-- styles.css                           design system
|-- public/                              robots.txt, sitemap.xml, manifest, favicon, og-image
|-- vite.config.ts, vite.standalone.config.ts, tsconfig.json
|-- vercel.json                          SPA rewrites and security headers
`-- README.md, VALIDATION.md, THIRD_PARTY_NOTICES.md, LICENSES.txt
```

## Deploy

Import the repository in Vercel, choose the **Vite** preset, build command `npm run build`, output directory `dist`. `vercel.json` provides SPA rewrites and security headers. After deployment, check that direct links such as `/app/wallet`, `/features` and `/dashboard` open correctly.

## Before real users

This is the interaction and design layer, not a production system. A real launch needs managed authentication, a server-side ledger with idempotent reward and redemption mutations, approved reward and conversion rules, backend-issued referral codes, governed event collection (UTC timestamps, deduplication, no unnecessary personal data), real privacy and terms text, and monitoring. LocalStorage is not a security boundary.

## Related work

- Analytics blueprint for VELOOP (event tracking plan, data dictionary, KPI catalogue, data-quality audit): [veloop-rewards-analytics-blueprint](https://github.com/iqra-insights/veloop-rewards-analytics-blueprint) (private; access on request).
- Official VELOOP site: https://www.velooprewards.in

## Author

**Iqra Siddiqui** - Data Analyst Intern, VELOOP Rewards (ID: VLRINT202601918) - [@iqra-insights](https://github.com/iqra-insights)

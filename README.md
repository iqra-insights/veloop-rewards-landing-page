# VELOOP Rewards - Landing Page

![Status](https://img.shields.io/badge/status-demo-orange) ![HTML](https://img.shields.io/badge/HTML5-single%20file-e34f26) ![Responsive](https://img.shields.io/badge/responsive-mobile%20first-success) ![Deploy](https://img.shields.io/badge/deployed%20on-Vercel-black)

**Live demo:** https://veloop-rewards-landing-page-bay.vercel.app/

A responsive landing page for **VELOOP Rewards**, an online rewards and engagement platform that is still in development. It explains the product idea (tasks, streaks, levels, referrals, a clear wallet and transparent withdrawals) without making any claims the company cannot back up.

## Highlights

- **Mobile-first and responsive:** tested at 390 px (phone) and 1280 px (desktop) with no horizontal scrolling; mobile menu with 44 px+ touch targets.
- **Everything clickable does something:**
  - Google Play and App Store badges open a "coming soon" pop-up, because the apps are not released and there is no store listing to link to.
  - Each "Ways to earn" card opens a details pop-up; filter chips narrow the cards.
  - Footer links open the official website, LinkedIn, e-mail, and draft Privacy / Terms / Cookies summaries.
- **Interactive demo:** streak, XP and level bar plus a lucky-spin wheel, clearly labelled as illustrative.
- **Wallet lifecycle explainer:** task completed, reward pending/credited, withdrawal requested, under review, completed or rejected with a reason.
- **Sections:** hero, ways to earn, interactive preview, how it works, wallet and withdrawals, roadmap, for brands and partners, FAQ, waitlist.
- **Accessibility:** semantic HTML, keyboard-operable cards, visible focus states, `aria-live` messages, and reduced-motion support.

## Honest by design

This project follows the company's data-authenticity rules. The page contains **no** invented user counts, ratings, earnings, payout speeds, or testimonials. Sample values (such as the wallet balance in the phone mockup) are labelled as sample data. The waitlist form is a **demo**: it validates the e-mail but does not store it.

## Tech

Plain HTML, CSS and JavaScript in one file (`index.html`). No framework, no build step, no dependencies, no cookies or browser storage.

## Run locally

**Option 1:** double-click `index.html`.

**Option 2 (VS Code):** install the *Live Server* extension, right-click `index.html` and choose *Open with Live Server*.

**Option 3 (terminal):**
```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Deploy

1. Push this repository to GitHub.
2. In Vercel choose **Add New -> Project**, import the repository (preset: *Other*) and click **Deploy**. No build command is needed.
3. Every later `git push` to `main` redeploys automatically.

## Pages

- `/` - landing page
- `/features` - the nine planned ways to take part
- `/rewards-wallet` - units, wallet entries, reward states, withdrawal lifecycle
- `/help` - searchable help center
- `/about` - principles, roadmap, data-first approach
- `/dashboard/` - user analytics prototype built on SIMULATED data (Task 01)

## Project structure

```
.
|-- index.html
|-- features.html, rewards-wallet.html, help.html, about.html
|-- dashboard/index.html   # analytics prototype (simulated data)
|-- assets/styles.css      # shared styles
|-- 404.html, robots.txt, sitemap.xml, site.webmanifest, og-image.png
|-- vercel.json            # clean URLs and security headers
`-- README.md
```

## Roadmap ideas

- Connect the waitlist form to a real backend (for example Formspree) after approval.
- Replace the draft legal summaries with official Privacy Policy and Terms.
- Add real store links when the apps are published.

## Links

- Official website: https://www.velooprewards.in
- Company LinkedIn: https://www.linkedin.com/company/veloop-rewards/

## Author

**Iqra Siddiqui** - Data Analyst Intern, VELOOP Rewards (ID: VLRINT202601918)
GitHub: [@iqra-insights](https://github.com/iqra-insights)

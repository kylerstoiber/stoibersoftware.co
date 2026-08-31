# Project context: Stoiber Software LLC website

You are helping me build a small, fast, static company website. Read this whole file before writing any code. Everything below is context about me, my company, my products, and what this site needs to accomplish.

## Who I am

I'm Kyler Stoiber — a student at the University of Illinois Urbana-Champaign (BS in Information Sciences, CS minor, interested in data science and marketing analytics) and an indie iOS developer. I founded **Stoiber Software LLC** in August 2026 as the home for my apps. I'm the sole member and do all the development, design, and marketing myself.

Personal brand in one line: a young builder who ships polished, practical iOS apps for everyday problems.

## The company

- **Legal name:** Stoiber Software LLC (single-member Illinois LLC, formed August 2026)
- **Address:** 5341 Grand Ave, Western Springs, IL 60558
- **Contact email:** kyler@stoibersoftware.co (confirmed Aug 30, 2026)
- **Domain:** stoibersoftware.co (confirmed Aug 30, 2026; stoibersoftware.com has belonged to someone else since 2012)
- **What it does:** iOS app development

Do not put a phone number, EIN, or D-U-N-S number on the site. Only the two products below appear on the site — do not mention any other projects, businesses, or unreleased apps.

## Products

Source material on this Mac: Fliqit project `~/Desktop/flickbean app/fliqit` (SwiftUI app + Share Extension, Next.js API; icon in `ios/Fliqit/Assets.xcassets`), App Store screenshots `~/Downloads/Fliqit-App-Store-0[1-4].png`, mascots `~/Desktop/fliqit-mascot`. SaleScout project `~/thriftstop` (Expo/React Native, Supabase; icon in `ios/SaleScout/Images.xcassets`), onboarding screens `~/Desktop/SaleScout onboarding flow`, badges `~/thriftstop/badgeszip`. Optimized copies used by the site live in `assets/`.

### SaleScout (published, iOS)
- Finds nearby yard sales, estate sales, and thrift stores.
- Built with React Native / JavaScript.
- Features: interactive map with pin clustering, advanced filters, saved-search alerts, favorites, pinned locations, a sale calendar, and a 5-tier badge/leveling system (Bin Digger up through The Holy Grail) for retention.
- Monetized with a **SaleScout Pro** subscription (monthly or yearly, free trial).
- App Store link: https://apps.apple.com/us/app/salescout-find-yard-sales/id6782672334 (App Store name "SaleScout - Find Yard Sales"; free download, SaleScout Pro subscription)
- Privacy policy: `privacy.html#salescout` on this site (no external page yet)
- Support: `support.html#salescout` on this site

### Fliqit (published, iOS)
- Turns screenshots into calendar events. Screenshot a text about plans, tap Share, pick Fliqit — it extracts the title, date, time, and location for review, then adds the event to your calendar.
- Taglines already in use in App Store screenshots: "Turn screenshots into plans", "Plans found. Details handled.", "Three steps. No typing."
- Visual identity: a friendly calendar mascot (teal header, white body, grey day-dots, one teal dot, small eyes). Brand teal is roughly `#3E7B7C`; the App Store screenshots use cream, sage, and muted teal backgrounds. On this dark site, use the teal as the accent and let the cream/sage appear only as text or subtle tints.
- App Store link: `[FLIQIT_APP_STORE_URL]` (not live on the App Store as of Aug 30, 2026 — the site shows a "Coming soon" pill until it is)
- Privacy policy: https://getfliqit.com/privacy.html (live; Fliqit's own site is in `~/Desktop/flickbean app/fliqit/website`)
- Support: https://getfliqit.com/support.html (live)

## Why this site exists (the hard requirements)

The primary purpose is to satisfy Apple's requirement for converting my Apple Developer account from Individual to Organization, so the App Store seller name changes from my personal name to Stoiber Software LLC. Apple requires the organization's website to be **publicly available and functional, with a domain name associated with the organization**. Placeholder pages, "coming soon" pages, and social links are rejected.

So the site must clearly and unambiguously present itself as the website of Stoiber Software LLC:

1. Company name in the header/title and in the page `<title>`.
2. An **About** section naming Stoiber Software LLC, what it does, who's behind it, and that it's based in Western Springs, Illinois.
3. A **Products** section with a card for each app (icon placeholder, one-line description, App Store link).
4. **Legal / support links:** privacy policy and support page for each app. Use the placeholder URLs above; if I don't supply external URLs, create simple `privacy.html` and `support.html` pages on this domain instead.
5. A **Contact** section with the company email.
6. A footer with: `© 2026 Stoiber Software LLC · 5341 Grand Ave, Western Springs, IL 60558` and the contact email.

Secondary purpose: a portfolio-grade landing page that shows I can design and build good interfaces. Recruiters and other developers will see this. It should be a demonstration of UX/UI craft, not just a compliance page.

All of the required content above must be present and readable in plain HTML even if JavaScript fails or is disabled. Animations are progressive enhancement on top of a complete page.

## Design direction

**Dark mode, always on.** No light theme toggle needed.

- Palette: near-black background (around `#0B0D0F`), one slightly lighter surface tone for cards (around `#14181B`), off-white text (around `#ECEAE3` — warm, not pure white), muted secondary text, and the Fliqit teal as the single accent (brighten it to roughly `#5FB3B4` so it reads on dark). Hairline borders at ~10% white. Subtle grain or a soft radial teal glow behind the hero is welcome; no gradients that look like a template.
- Typography: big, confident headlines; a geometric or grotesque sans with real weight contrast. A single self-hosted or single-request Google Font is fine. Body text stays comfortable at 16–18px with generous line height.
- Layout: generous whitespace, a narrow max-width for reading sections, full-bleed for the hero and product showcases. Rounded corners, soft elevated cards, no stock photos.
- Voice: plain words, short sentences, a little playful — the same register as the Fliqit taglines.

## Interaction and motion (this is the point of the site)

Build these as tasteful, well-engineered interactions — transforms and opacity only, 60fps, no jank, no heavy libraries. Vanilla JS. Every animation must respect `prefers-reduced-motion` (reduce to simple fades or static states).

1. **Hero typing animation.** On load, type out `Stoiber Software` character by character with a blinking caret, using natural per-character timing (slight randomness, a small pause after the space). After it finishes, fade in a one-line tagline beneath it. Optionally the caret then continues on a second line cycling through short phrases like "builds iOS apps." / "makes small, useful things." — keep the cycle to 3–4 phrases and make it easy for me to edit the list. The company name must also exist as real text in the DOM for accessibility and for anyone with JS off.
2. **Scroll-triggered reveals.** Sections and cards fade/slide in on first entry via `IntersectionObserver`, staggered within a group. Once, not every scroll.
3. **Product cards that respond.** Hover/pointer tilt (subtle 3D perspective), a soft teal glow that follows the cursor across the card, and a clear press state. Must degrade to a simple hover lift on touch devices.
4. **Live product demos, in CSS/JS, not screenshots.** Each app card should include a small looping "how it works" vignette:
   - **Fliqit:** a mock text bubble ("Pickleball at 3 tomorrow?") → a share-sheet icon pulse → an event card assembling itself (title, date, time filling in) → a checkmark. Loop with a pause.
   - **SaleScout:** a stylized map surface with pins dropping in, clustering into a numbered cluster as they get close, then one pin expanding into a small sale card. Loop with a pause.
   These should be small, restrained, and clearly illustrative — abstract shapes and short labels, not pixel-perfect device mockups.
5. **Micro-interactions everywhere else:** nav links with an animated underline, buttons with a satisfying press, smooth scrolling for in-page anchors, a thin scroll-progress bar at the top, and focus-visible states that look designed, not default.
6. **Performance budget:** no layout thrash (no reading layout in scroll handlers), animations paused when off-screen, total JS under ~15KB unminified, Lighthouse performance and accessibility both 95+.

If any of these would make the page feel busy, cut it. Restraint is part of the demonstration.

## Technical constraints

- **Static only.** HTML + CSS + vanilla JS. No frameworks, no build step, no npm.
- Files: `index.html`, `styles.css`, `script.js`, plus `privacy.html` / `support.html` only if needed per above.
- Deploys to **GitHub Pages** from the `main` branch root. Include a `CNAME` file containing the domain and a `.nojekyll` file.
- Responsive and mobile-first — most visitors will come from phones. Test the hero typing animation and product demos at 375px width specifically.
- Accessible: semantic HTML, landmarks, alt text, sufficient contrast on dark backgrounds, keyboard-navigable, `prefers-reduced-motion` honored.
- Proper `<meta>` tags: description, viewport, Open Graph title/description, theme-color set to the background color, and an SVG favicon you generate.
- No analytics or third-party scripts.

## Workflow

1. Before writing code, list the placeholder values you still need from me and ask for them in one message. If I say to proceed with placeholders, use clearly visible `[PLACEHOLDER]` text and keep a checklist of them at the top of the README.
2. Build the page. Do the static content and layout first, then layer on the motion — so the site is already valid for Apple's purposes before any animation exists.
3. Add a short `README.md` covering: how to run locally (`python3 -m http.server` is fine), how to deploy to GitHub Pages, the DNS records to set at the registrar for an apex domain + `www` CNAME, where to edit the typing-animation phrases, and the placeholder checklist.
4. Show me the file tree and a summary of what you built. Don't over-explain the code.

# Stoiber Software LLC — website

Static company site for **stoibersoftware.us**. Plain HTML, CSS, and vanilla JS. No build step, no npm, no analytics.

## Status checklist

Done:

- [x] Contact email → `kyler@stoibersoftware.us` (index, privacy, support)
- [x] SaleScout App Store link
- [x] Domain → `stoibersoftware.us` in `CNAME` and in the `canonical` + `og:url` tags (`stoibersoftware.com` belongs to someone else)

Still to do:

- [x] Domain registered at Porkbun, DNS set, GitHub Pages enabled with HTTPS enforced. Live at https://stoibersoftware.us (Aug 31, 2026).
- [ ] **Fliqit App Store link.** Fliqit isn't live yet, so its card shows a non-clickable "Coming soon to the App Store" pill. When it ships, in `index.html`:
  1. replace `<span class="btn btn-ghost btn--pending">Coming soon to the App&nbsp;Store</span>` with `<a class="btn btn-primary" href="https://apps.apple.com/…">Get Fliqit on the App&nbsp;Store</a>`
  2. change the card meta `iOS · Productivity · Coming soon` → `iOS · Productivity`
  3. change the Products heading back to `Two apps. Both on the App&nbsp;Store.` and the hero fact `Two iOS apps` → `Two apps on the App&nbsp;Store`
- [ ] **Privacy & support pages** are drafts for SaleScout (Fliqit links to its own pages on getfliqit.com). Sentences highlighted in yellow (`<mark>…</mark>`) still need confirming — then delete the yellow "Draft" box at the top of both pages.
- [x] App icons and screenshots are the real ones (see `assets/`).
- [ ] Optional: an `og:image` (1200×630 PNG) so links unfurl with a picture.

If you ever reintroduce a bracketed placeholder href, the `a[href^="["]` rule in `styles.css` shows a yellow **placeholder** badge on it automatically.

## Run locally

```sh
cd "stoiber software website"
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repo (any name; `stoibersoftware.us` is conventional) and push these files to the root of `main`:
   ```sh
   git init -b main
   git add .
   git commit -m "Stoiber Software site"
   git remote add origin git@github.com:<your-username>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`**.
3. Under **Custom domain**, enter `stoibersoftware.us` and save. It must match the `CNAME` file exactly. Once the DNS check passes, tick **Enforce HTTPS**.
4. Recommended: **your profile → Settings → Pages → Add a domain** and verify `stoibersoftware.us` there too, so nobody else can claim it on GitHub Pages.

`.nojekyll` tells Pages to serve the files as-is; `CNAME` keeps the custom domain across future pushes.

## DNS records (at the registrar)

Apex domain (`stoibersoftware.us`):

| Type | Name | Value |
|------|------|-------|
| A    | `@`  | `185.199.108.153` |
| A    | `@`  | `185.199.109.153` |
| A    | `@`  | `185.199.110.153` |
| A    | `@`  | `185.199.111.153` |
| AAAA | `@`  | `2606:50c0:8000::153` |
| AAAA | `@`  | `2606:50c0:8001::153` |
| AAAA | `@`  | `2606:50c0:8002::153` |
| AAAA | `@`  | `2606:50c0:8003::153` |

`www` subdomain:

| Type  | Name  | Value |
|-------|-------|-------|
| CNAME | `www` | `<your-username>.github.io` |

Remove any registrar "parking" A record first. Propagation can take up to 24 hours; check with `dig stoibersoftware.us +noall +answer`. GitHub will redirect `www` to the apex automatically once both resolve.

## Editing the typing animation

Open `script.js`. The phrase list is at the very top:

```js
var CYCLE_PHRASES = [
  'builds iOS apps.',
  'makes small, useful things.',
  'turns screenshots into plans.',
  'finds the good yard sales.'
];
```

Add, remove, or reorder lines. Keep them short so they fit on one line on a phone. The timing constants (typing speed, hold time, pause between phrases) are right below the list. The company name itself is typed from the real `<h1>` text in `index.html`, so it never needs editing here.

## Files

```
index.html     landing page (hero, products, about, contact, footer)
privacy.html   privacy policy for both apps (draft — see checklist)
support.html   support page for both apps (draft — see checklist)
styles.css     all styling
script.js      typing hero, topographic hero canvas, scroll reveals, screenshot tilt, progress bar
favicon.svg    tab icon
assets/        app icons, App Store screenshots (WebP), Apple App Store badge
CNAME          custom domain for GitHub Pages
.nojekyll      disables Jekyll processing on GitHub Pages
CLAUDE.md      project brief
```

## Notes

- The typeface (Bricolage Grotesque, SIL Open Font License) is self-hosted from `assets/bricolage-grotesque-latin.woff2` and preloaded — the site makes no third-party requests at all.
- Everything Apple needs is plain HTML. JavaScript only adds motion; if `script.js` fails to load, the page shows itself after 3.5 s (see the `js-fallback` animation in `styles.css`). Test with JS off via Safari's **Develop → Disable JavaScript**.
- Every animation honours `prefers-reduced-motion` (System Settings → Accessibility → Display → Reduce Motion).
- Product screenshots are the App Store images, resized to 560px WebP in `assets/` (Fliqit uses App Store images 01, 02, 04 from `~/Downloads/Fliqit-App-Store-0*.png`; regenerate from those and the SaleScout App Store listing if they change). Icons are the 1024px app icons from each Xcode project.
- The hero background is a live topographic map: contour lines (marching squares) over a drifting fractal-noise height field. The pointer is a hill that raises rings around it; on touch, a tap or drag does the same. It pauses off-screen, is skipped under reduced motion, and without JS static hairlines show instead. Tuning knobs are at the top of `initHeroTopo()` in `script.js` (`LEVELS`, `WL`, `OCT`, `GAIN`, `SIGMA`, `LIFT`, `SPEED`).
- Lighthouse: open the site in Chrome, DevTools → Lighthouse → Mobile → Performance + Accessibility.

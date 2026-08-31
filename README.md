# Stoiber Software LLC — website

Static company site for **stoibersoftware.co**. Plain HTML, CSS, and vanilla JS. No build step, no npm, no analytics.

## Status checklist

Done:

- [x] Contact email → `kyler@stoibersoftware.co` (index, privacy, support)
- [x] SaleScout App Store link
- [x] Domain → `stoibersoftware.co` in `CNAME` and in the `canonical` + `og:url` tags (`stoibersoftware.com` belongs to someone else)

Still to do:

- [ ] **Register `stoibersoftware.co`** (it had no DNS records on Aug 30 2026), add the DNS records below, then enable GitHub Pages (see Deploy). Until the domain resolves, don't enable Pages with the `CNAME` file present — the preview URL would redirect into nothing.
- [ ] **Fliqit App Store link.** Fliqit isn't live yet, so its card shows a non-clickable "Coming soon to the App Store" pill. When it ships, in `index.html`:
  1. replace `<span class="btn btn-ghost btn--pending">Coming soon to the App&nbsp;Store</span>` with `<a class="btn btn-primary" href="https://apps.apple.com/…">Get Fliqit on the App&nbsp;Store</a>`
  2. change the card meta `iOS · Productivity · Coming soon` → `iOS · Productivity`
  3. change the Products heading back to `Two apps. Both on the App&nbsp;Store.` and the hero fact `Two iOS apps` → `Two apps on the App&nbsp;Store`
- [ ] **Privacy & support pages** are drafts. Sentences highlighted in yellow (`<mark>…</mark>`) describe app behaviour I guessed at — confirm or rewrite each, then delete the yellow "Draft" box at the top of both pages.
- [ ] **App icons.** The two icons in the product cards are inline SVG placeholders. Replace the contents of each `<div class="app-icon">` with `<img src="fliqit-icon.png" alt="" width="56" height="56">` (export at 256px or larger).
- [ ] Optional: an `og:image` (1200×630 PNG) so links unfurl with a picture.

If you ever reintroduce a bracketed placeholder href, the `a[href^="["]` rule in `styles.css` shows a yellow **placeholder** badge on it automatically.

## Run locally

```sh
cd "stoiber software website"
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repo (any name; `stoibersoftware.co` is conventional) and push these files to the root of `main`:
   ```sh
   git init -b main
   git add .
   git commit -m "Stoiber Software site"
   git remote add origin git@github.com:<your-username>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`**.
3. Under **Custom domain**, enter `stoibersoftware.co` and save. It must match the `CNAME` file exactly. Once the DNS check passes, tick **Enforce HTTPS**.
4. Recommended: **your profile → Settings → Pages → Add a domain** and verify `stoibersoftware.co` there too, so nobody else can claim it on GitHub Pages.

`.nojekyll` tells Pages to serve the files as-is; `CNAME` keeps the custom domain across future pushes.

## DNS records (at the registrar)

Apex domain (`stoibersoftware.co`):

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

Remove any registrar "parking" A record first. Propagation can take up to 24 hours; check with `dig stoibersoftware.co +noall +answer`. GitHub will redirect `www` to the apex automatically once both resolve.

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
styles.css     all styling, including the CSS-only product demos
script.js      typing hero, scroll reveals, card tilt, progress bar, demo pausing
favicon.svg    tab icon
CNAME          custom domain for GitHub Pages
.nojekyll      disables Jekyll processing on GitHub Pages
CLAUDE.md      project brief
```

## Notes

- Everything Apple needs is plain HTML. JavaScript only adds motion; if `script.js` fails to load, the page shows itself after 3.5 s (see the `js-fallback` animation in `styles.css`). Test with JS off via Safari's **Develop → Disable JavaScript**.
- Every animation honours `prefers-reduced-motion` (System Settings → Accessibility → Display → Reduce Motion).
- The product demos are pure CSS keyframes and pause automatically when scrolled off-screen.
- Lighthouse: open the site in Chrome, DevTools → Lighthouse → Mobile → Performance + Accessibility.

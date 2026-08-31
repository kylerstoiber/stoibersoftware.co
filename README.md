# Stoiber Software LLC — website

Static company site for **stoibersoftware.com**. Plain HTML, CSS, and vanilla JS. No build step, no npm, no analytics.

## Placeholder checklist (finish these before pointing Apple at the site)

Every placeholder is a bracketed token, so `grep -rn "\[" *.html` finds them all. Each one is a single find-and-replace across the project.

- [ ] `[EMAIL_ON_NEW_DOMAIN]` → the contact email (appears in `index.html`, `privacy.html`, `support.html`)
- [ ] `[FLIQIT_APP_STORE_URL]` → Fliqit's App Store link (`index.html`)
- [ ] `[SALESCOUT_APP_STORE_URL]` → SaleScout's App Store link (`index.html`)
- [ ] **Domain.** `CNAME` plus the `canonical` and `og:url` tags in all three HTML files currently say `stoibersoftware.com`. Change them if the domain ends up different.
- [ ] **Privacy & support pages** are drafts. Sentences highlighted in yellow (`<mark>…</mark>`) describe app behaviour I guessed at — confirm or rewrite each, then delete the yellow "Draft" box at the top of both pages. If you'd rather link to external policy/support pages, replace the `privacy.html#…` and `support.html#…` hrefs in `index.html`.
- [ ] **App icons.** The two icons in the product cards are inline SVG placeholders. Replace the contents of each `<div class="app-icon">` with `<img src="fliqit-icon.png" alt="" width="56" height="56">` (export at 256px or larger).
- [ ] Optional: an `og:image` (1200×630 PNG) so links unfurl with a picture.

Any link whose `href` still starts with `[` automatically shows a yellow **placeholder** badge (the `a[href^="["]` rule in `styles.css`). Once every href is real the badges disappear on their own; you can delete that rule.

## Run locally

```sh
cd "stoiber software website"
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repo (any name; `stoibersoftware.com` is conventional) and push these files to the root of `main`:
   ```sh
   git init -b main
   git add .
   git commit -m "Stoiber Software site"
   git remote add origin git@github.com:<your-username>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)`**.
3. Under **Custom domain**, enter `stoibersoftware.com` and save. It must match the `CNAME` file exactly. Once the DNS check passes, tick **Enforce HTTPS**.
4. Recommended: **your profile → Settings → Pages → Add a domain** and verify `stoibersoftware.com` there too, so nobody else can claim it on GitHub Pages.

`.nojekyll` tells Pages to serve the files as-is; `CNAME` keeps the custom domain across future pushes.

## DNS records (at the registrar)

Apex domain (`stoibersoftware.com`):

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

Remove any registrar "parking" A record first. Propagation can take up to 24 hours; check with `dig stoibersoftware.com +noall +answer`. GitHub will redirect `www` to the apex automatically once both resolve.

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

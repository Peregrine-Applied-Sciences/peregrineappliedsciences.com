# Peregrine Applied Sciences — Final Website

Production-ready static website for GitHub Pages, Cloudflare Pages, Netlify, Vercel static hosting, or a conventional web host.

## Included
- `index.html`
- `styles.css`
- `script.js`
- `assets/peregrine-logo.png`
- supplied imagery in `assets/`

## Local preview

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## GitHub Pages

1. Create a new GitHub repository.
2. Upload all files/folders from this project to the repository root.
3. Push to `main`.
4. Open **Settings → Pages**.
5. Choose **Deploy from a branch**.
6. Select `main` and `/ (root)`.
7. Save.

## Custom domain

Under **Settings → Pages**, enter the final company domain and apply the DNS records GitHub provides.

## Launch checks
- Confirm image reuse rights before publication.
- The supplied field-UAV image visibly carries Crown Copyright marking; verify commercial reuse rights or replace it.
- Do not present third-party/government imagery in a way that implies endorsement, contract performance, customer status, or partnership.
- The site states that SDVOSB certification is in progress and not finalized.
- Update the contact email if the final domain/address differs.

## Design direction

This build uses:
- Deep Space Obsidian `#0B0E14`
- Tactical Slate panels
- High-contrast white text
- Electrified Cyan `#00F0FF` only for priority telemetry/CTA accents
- Inter + JetBrains Mono
- HUD-style navigation
- telemetry animations
- grid overlays
- glassmorphism panels
- metric/imperial spec toggles

It intentionally avoids large external WebGL dependencies to preserve fast initial load times. The visual language is designed to feel like a classified mission display blended with high-end aerospace product UI.


## 2026 Brand Identity Update

This build now uses the professional graphite/titanium Peregrine identity package.

Website asset mapping:
- `assets/peregrine-header-logo.png` — desktop navigation/header
- `assets/peregrine-symbol.png` — mobile header / compact mark
- `assets/peregrine-full-logo.png` — contact brand lockup
- `favicon.ico` — browser favicon
- `assets/favicon-*.png` — web/app icon sizes

The former patriotic red/white/blue logo is no longer used by the site.

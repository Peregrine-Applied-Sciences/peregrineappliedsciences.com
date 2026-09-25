# Peregrine Applied Sciences Website

Production static website for `peregrineappliedsciences.com`, deployed from GitHub Pages.

## Current page structure

- `index.html` — company overview, current programs, founding team, product architecture, and near-term milestones.
- `capabilities.html` — detailed engineering capabilities, lifecycle model, and company snapshot.
- `pacn-01.html` — current PACN-01 architecture, FOVEA Engine / Peregrine Mission Console engineering-MVP status, and hardware-transition strategy.
- `stage.html` — transparent startup-stage page describing what is real today, what comes next, and how government, primes, airframe teams, research organizations, suppliers, and prototype shops can work with Peregrine.
- `styles.css` — shared responsive design system.
- `script.js` — navigation, active-page state, copyright year, and lightweight hero parallax.

## Current public company facts

The site intentionally distinguishes verified/current facts from design objectives.

- Legal name: **Peregrine Applied Sciences, Inc.**
- Corporate structure: **Delaware C-Corporation**.
- Location: **El Paso, Texas**.
- Public email: **info@peregrineappliedsciences.com**.
- Public phone: **(915) 270-3223**.

## Program posture represented on the site

### FOVEA Engine + Peregrine Mission Console

The website reflects the current **0.2.0 engineering MVP** baseline at a public, non-sensitive level. It describes mission, tracking, cooperative-fusion, radar-control, simulation, replay, geographic/offline operations, network-topology, and operator-console capabilities without publishing proprietary implementation details.

### PACN-01

The site replaces the former narrow airborne-relay description with the current development direction: a modular airborne edge mission node integrating configurable RF interfaces, sensing/radar integration points, mission compute, cooperative track exchange, and FOVEA software services.

The site does **not** present PACN-01 as flight-qualified or as fielded hardware.

### P-360 Stoop

The site presents P-360 as a **design-stage** Group 3 VTOL development path and explicitly labels performance values as engineering objectives until prototype and flight-test verification exists.

## Current business-stage messaging

The website states the near-term priorities directly:

1. win and execute first bounded engineering / sustainment work and establish documented periods of performance;
2. finish FOVEA defect closure, interface hardening, regression / qualification work, and representative hardware integration;
3. identify a mature surrogate airframe / prototyping partner for flight-relevant PACN-01 integration before relying on a purpose-built P-360 aircraft;
4. build repeatable bench, HIL/SIL, and flight-test evidence;
5. expand partnerships with government problem owners, primes, research organizations, suppliers, and prototype/manufacturing teams.

## Local preview

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deployment

The repository is compatible with GitHub Pages, Cloudflare Pages, Netlify, Vercel static hosting, or a conventional static web host.

The current production setup uses the repository root and the custom domain in `CNAME`.

## Brand / UI direction

- Light graphite / industrial gray base
- High-contrast graphite and off-white typography
- Plus Jakarta Sans + Space Grotesk + Inter
- technical grid and mission-system visual language
- responsive multi-page navigation
- no third-party UI framework or WebGL dependency

## Publication discipline

Do not publish claims that exceed the engineering evidence.

- Label design objectives as objectives.
- Do not imply a government customer, award, endorsement, or fielding status that does not exist.
- Do not imply an executed university partnership until an agreement or scoped effort exists.
- Keep mission-specific RF, sensor, waveform, software implementation, and proprietary technical detail out of the public site.
- Avoid publishing internal software screenshots or R&D analysis imagery; use abstract system graphics for public explanations.

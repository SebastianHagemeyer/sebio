# SEBIO — Interactive Biology Simulations

A collection of interactive biology learning modules and mini-games by Sebastian Hagemeyer.
A static site of vanilla HTML / CSS / JS, built with [Eleventy](https://www.11ty.dev/):
source lives in `src/`, the production build outputs to `_site/`.

## Modules

**Body Systems**

- **Excretory System** (`/excretory`) — function of ADH in the kidney.
- **Islets of Langerhans** (`/islet`) — alpha and beta cells in the pancreas.
- **Blood Glucose Regulation** (`/bloodglucose`) — how insulin and glucagon maintain blood sugar.
- **Pee Panic** (`/peepanic`) — osmoregulation game (with online leaderboard).
- **SRMER** (`/SRMER`) — stimulus–response model scenarios.

**Cell Biology**

- **Cell Passport** (`/cellpassport`) — explore animal and plant cell organelles stage by stage.

**Agriculture**

- **Plant Parts** (`/plantparts`) — macro outline of plant parts and their function.
- **Photosynthesis** (`/photosynthesis`) — how plants adapt photosynthesis (C3 / C4 / CAM) to their environment.

**Miscellaneous**

- **Other** (`/other`) — non-biology simulations (`can`, `displacement`).

## Building & running locally

```bash
npm install      # one-time
npm start        # dev server with live reload
npm run build    # production build to _site/
npm run format   # Prettier (write)
npm run lint     # ESLint
```

The site uses root-absolute paths (e.g. `/globalstyle.css`) and is intended for a
GitHub Pages user/apex deploy where `_site/` is the site root.

## Notes

- The Pee Panic leaderboard reads/writes to an external endpoint (to be moved to a
  serverless function behind a configurable base URL).
- Blood Glucose loads Chart.js (pinned, with SRI) from a CDN.

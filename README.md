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

## Deployment

`.github/workflows/deploy.yml` builds `_site/` and publishes it to GitHub Pages
on every push to `main` (enable Pages → Source: **GitHub Actions** in repo
settings).

> **Path note:** the site uses root-absolute paths (e.g. `/globalstyle.css`), so
> it must be served from the **site root** (apex). A GitHub Pages _project_ site
> serves at `username.github.io/sebio/` (a subpath), which breaks those paths —
> use a **custom domain** or a **`username.github.io` user repo** to serve at the
> apex, or rework the paths to be base-aware.

## Notes

- The **Pee Panic leaderboard** is backed by Supabase — see
  [`docs/leaderboard-setup.md`](docs/leaderboard-setup.md). It degrades
  gracefully until you add your project URL + anon key in `src/scripts/leaderboard.js`.
- Blood Glucose loads Chart.js (pinned, with SRI) from a CDN.

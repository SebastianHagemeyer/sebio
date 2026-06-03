# SEBIO — Interactive Biology Simulations

A collection of interactive biology learning modules and mini-games by Sebastian Hagemeyer.
Built as a static site (HTML / CSS / vanilla JS), with one module index linking out to each simulation.

## Modules

**Body Systems**
- **Excretory System** (`/excretory`) — function of ADH in the kidney.
- **Islets of Langerhans** (`/islet`) — alpha and beta cells in the pancreas.
- **Blood Glucose Regulation** (`/bloodglucose`) — how insulin and glucagon maintain blood sugar.
- **Pee Panic** (`/peepanic`) — osmoregulation game (with online leaderboard).
- **SRMER** (`/SRMER`) — stimulus–response model scenarios.

**Agriculture**
- **Plant Parts** (`/plantparts`) — macro outline of plant parts and their function.
- **Photosynthesis** (`/photosynthesis`) — how plants adapt photosynthesis (C3 / C4 / CAM) to their environment.

**Miscellaneous**
- **Other** (`/other`) — non-biology simulations (e.g. `displacement`, `can`, `cellpassport`).

## Running locally

The site uses root-absolute paths (e.g. `/globalstyle.css`), so serve it from the project root:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## Notes

- The Pee Panic leaderboard reads/writes to an external PHP endpoint.
- Blood Glucose loads Chart.js from a CDN.

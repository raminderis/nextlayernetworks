# Next Layer Network

React + Vite website for an AI infrastructure cabling sourcing business.

## Continue in Codex

Open this folder as a local project in Codex. Source files:
- `src/main.jsx`: React components, page content, product filters, sourcing dialog.
- `src/style.css`: responsive layout, typography, colors, artwork styling.
- `index.html`: page title and metadata.

Suggested first prompt:
> Continue developing this React + Vite website. Read README.md first. Preserve the Next Layer Network brand and focus on cabling sourcing for AI infrastructure. Start the local preview and inspect the current site before editing. Keep the app deployable as a Render Static Site. Do not invent customers, inventory, supplier partnerships, or certifications.

## Run locally

Install a current supported Node.js LTS version (Node 22.12+ is compatible with this setup), then run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To create the production build:

```sh
npm run build
```

## Render deployment

Push this folder into your own Git repository. Create a Render Static Site with:
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

If using a larger repository, set the Render root directory to this project folder.

## Before public launch

The quote inquiry dialog submits to Formspree at `https://formspree.io/f/mvkkblrn`. Configure and verify the notification recipient in the Formspree dashboard (intended mailbox: `support@nextlayernetworks.com`). Customers provide their name, reply email, company/project, category, and requirements. Formspree processes submissions; this static site has no database or email credentials. Verify a real submission arrives before launch. A successful API response confirms submission, not inbox delivery. The business name is provisional; domain and trademark availability have not been cleared. Product artwork is illustrative. No supplier authorization, stock availability, or customer relationships are claimed. Google Fonts is an external optional font dependency; system-font fallbacks are configured.

No credentials are included. `node_modules` and `dist` are generated and excluded from the source ZIP. Keep `package-lock.json` for reproducible installs.

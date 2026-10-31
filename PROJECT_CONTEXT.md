# Saved project context

Last updated: 2026-10-31 (Asia/Kolkata).

## Application

- Next Layer Network: a concept website for AI infrastructure cabling sourcing.
- React 19 + Vite 7; source is primarily `src/main.jsx` and `src/style.css`.
- `index.html` contains the title and metadata. `README.md` describes setup and launch limitations.
- The quote inquiry dialog now submits through Formspree, using the endpoint supplied by the user: `https://formspree.io/f/mvkkblrn`. Email delivery and recipient configuration have not been verified.
- Initial review made no source fixes. Subsequent Formspree integration is implemented locally; see the current work section.

## Local development and verification

User requested localhost port **8000** (superseding earlier ports).

```sh
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8000 --strictPort
```

Open http://localhost:8000.

During the initial review, `npm run build` failed because the local `node_modules/.bin/vite` launcher resolved its CLI path incorrectly. Direct invocation succeeded:

```sh
node node_modules/vite/bin/vite.js build
```

This was a local dependency-installation issue, not a demonstrated source compilation failure. Do not assume a fresh install or Render has the same problem. Browser behavior was not verified.

## Deployment

- GitHub repository: `raminderis/nextlayernetworks`.
- Local branch and Render linked branch observed: `main`.
- Render Static Site name: `nextlayernetworks`.
- Public domain shown in the user's screenshot: https://www.nextlayernetworks.com.
- The user confirmed via a Render Settings screenshot that **Auto-Deploy is already set to On Commit**.
- Pushing or merging a new commit to the linked GitHub `main` branch should trigger deployment. Local commits alone do not trigger it. No new deploy is expected when `git push` reports everything up to date.
- To verify a deployment, compare its commit hash in Render's Deploys page with the pushed commit.
- README deployment configuration: build command `npm ci && npm run build`; publish directory `dist`. These values were documented, not verified in Render Settings.
- Do not save deployment hook URLs or credentials in project files.

## Current work: business email, then Formspree

- The user wants website inquiries emailed to them rather than downloaded locally.
- Domain was purchased at GoDaddy. Website hosting remains on Render; no GoDaddy website package is needed.
- User chose to pursue Zoho Mail for business email, considering the free custom-domain plan. They are happy using Zoho webmail or its app and do not need IMAP/POP access through Outlook or Apple Mail. Confirm current plan availability during signup rather than assuming it.
- Desired mailbox: **support@nextlayernetworks.com**. Mailbox creation and working delivery have NOT been confirmed.
- Latest blocker: Zoho signup displayed India phone code/options while the user wanted to enter a US number. IP-based region selection was discussed; suggested checking the phone code/flag dropdown and signup Country/Region selector. The cause and resolution have not been confirmed.
- Next: finish Zoho signup, verify domain ownership using the exact DNS verification record Zoho supplies, create the mailbox, and configure Zoho-provided email DNS records. DNS is likely at GoDaddy but its actual authoritative host has not been verified. Preserve the existing Render website DNS records. Use Zoho's account-specific DNS values, not guessed values.
- User subsequently provided the Formspree endpoint `https://formspree.io/f/mvkkblrn`. It is connected in `src/InquiryDialog.jsx`; no API secret is required in the browser.
- Implemented locally: “Request a quote” CTAs; required name/reply email/company/requirements; selected product category; POST with JSON response handling; pending/success/error states; duplicate-submit guard; spam honeypot; native dialog backdrop and Escape handling. Failed submissions preserve entered fields. Reopening starts a new form.
- README now describes Formspree. The direct Vite production build passes after integration. No live POST was sent and inbox receipt is not confirmed; no browser interaction test has been performed.
- Next: ensure Zoho mailbox works and Formspree notification recipient is verified, preview locally at port 8000, then perform a user-authorized test submission and confirm inbox receipt. Review and push when authorized; Render auto-deploys main. Do not claim email delivery works based only on a successful build/API response.
- Do not request or store account passwords or private API keys. No commit, push, or deployment was performed as part of this email/form discussion.

## Initial review findings (addressed in local Formspree integration)

Originally found in `src/main.jsx`. The replacement `src/InquiryDialog.jsx` and category state in `App` address these; browser validation remains pending:

1. Product-specific brief buttons only call `setOpen(true)`; the category always defaults to Fiber assemblies. Pass the selected product/category into the dialog.
2. `done` remains true after closing and reopening the dialog, so a fresh empty brief displays the previous download confirmation. Reset it when starting a new brief.
3. The outside-click handler is on `.modal-backdrop`, outside a native dialog opened with `showModal()`. Native modal behavior makes the surrounding content inert; handle outside clicks through the dialog instead. This finding was based on code inspection and needs browser validation.

No automated test suite is configured. The direct production build passed at the reviewed initial commit `9a33741`.

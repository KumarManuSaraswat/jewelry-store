# Orniva

Orniva’s rebuilt storefront and owner workspace, using the existing React/Vite, Express, MongoDB, Netlify, and Render architecture. The live product catalog, contact details, INR pricing, shipping threshold, shipping charge, 3% tax calculation, and 30-day returns promise are preserved.

## Run locally

The client’s `.env.example` points to the existing public Render API. Copy it to `client/.env` if needed, install with `npm ci --prefix client`, and run `npm run client` from the root. The preview runs at `http://localhost:5173`.

To run the updated backend, install with `npm ci --prefix server`, copy `server/.env.example` to `server/.env`, supply the existing service credentials, and run `npm run server`. Point `VITE_API_URL` at `http://localhost:5000` when testing against that backend. The MongoDB Atlas network access list must permit the machine running the server. Transactions require an Atlas cluster or MongoDB replica set.

## Customer experience

### Brand introduction and motion

The home page (`/`) introduces Orniva through an animated editorial hero, brand story, styling edits, and direct shopping links. The original shopping homepage remains at `/collections`; the full catalog is at `/shop`.

Motion uses CSS and the browser’s Web Animations API, with no new runtime dependency: heading and portrait entrances, once-per-view scroll reveals, short page transitions, and feedback on buttons, navigation, saved pieces, filters and owner dialogs. All motion respects `prefers-reduced-motion`; keyboard focus cancels any pending reveal on the focused content. There is no loading gate, scroll interception or continuous decorative animation.

The production build pre-renders the home, about, contact, care and shipping/returns pages to HTML and generates `sitemap.xml`. Page titles, descriptions, canonical links, social previews and brand structured data use the existing Netlify address. The client mounts its interactive view over this public static content, so customer-specific bag and account state is never included in generated files. Netlify serves `/app.html` for dynamic routes instead of showing the landing page as their initial fallback.

After deployment, verify the site in Google Search Console and submit `https://orniva.netlify.app/sitemap.xml`. Search ranking or immediate indexing is not guaranteed. If the public domain changes, update `src/utils/pageMetadata.js`, `index.html` and `public/robots.txt` together. Approach: [Google’s JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

In development, API calls pass through Vite to `VITE_API_URL`. This supports both `localhost` and `127.0.0.1` previews with the existing Render API. Production calls the configured API directly; authentication requirements are unchanged.

### Shopping features

- Responsive storefront, category navigation, searchable catalog, price/material/availability filters, and sorting.
- Product galleries, actual material details and reviews when present, stock-aware quantity controls, related pieces, and jewelry care.
- Persistent device-local bag and wishlist. Prices and stock are authoritative on the server when an order is placed.
- Customer registration, sign-in with return to checkout, order history, order status, and shipment tracking.
- COD and WhatsApp-assisted orders. WhatsApp links open drafts that the customer must send themselves.
- Optional Razorpay checkout with verified payment signatures, provider-side amount/currency/capture checks, and signed webhook reconciliation.
- Contact, shipping/returns, and jewelry care pages. Existing social and support links now point to Orniva’s actual accounts.

## Owner workspace

Sign in through the normal account page with an existing admin account. Admin sign-in opens `/admin` by default, and an **Owner dashboard** link appears in the store header (a dashboard icon on narrow screens, plus a labeled mobile menu entry). An explicit shopping destination, such as checkout, is preserved. Customers and signed-out visitors see no owner links in the header, menu or footer. Role changes from a new sign-in and sign-out update navigation immediately and sync across tabs. The role returned by the server controls the interface; knowing an owner email does not grant access.

The workspace includes paid sales by month, orders awaiting fulfillment, customer counts, low-stock alerts, product and inventory management, image upload, materials, collection flags, order search/filter/export, shipment tracking, customer summaries/export, and team access. Product editing retains multiple existing images. You cannot remove your own owner access. Customer visits to owner URLs return to the storefront, and the backend independently checks the current database role before allowing any owner API request.

Orders reserve inventory inside a database transaction. Invalid quantities are rejected, duplicate product IDs are aggregated, repeated checkout requests return the existing order, and cancellation releases reserved inventory only once. Existing orders from before this rebuild are not automatically restocked because the old checkout did not reserve stock.

## Deploy to the existing services

Deploy the **backend first**, then the storefront. This source has not yet been published to the live services.

1. In Render, use root directory `server`, build command `npm ci`, and start command `npm start`. Set `NODE_ENV=production`, `CLIENT_URL=https://orniva.netlify.app`, and retain the existing MongoDB, JWT, and Cloudinary environment values. The server waits for the database and order index before listening. Confirm `/api/health` returns `ready`.
2. In Netlify, use the root `netlify.toml`: base `client`, build `npm run build`, publish `dist`. The production API URL is the existing Render service. SPA deep links are configured.
3. Test an owner sign-in and a disposable order in a staging database before accepting real orders. This computer could read the public catalog through Render but could not directly reach the configured Atlas cluster, so actual MongoDB transaction behavior and live owner credentials were not exercised here.
4. Rotate the database password that was shared in conversation through Atlas, then update Render and local environment settings. Do not put credentials in source control or frontend environment variables.

### Online payments

Online payment selection remains hidden until the updated server reports it ready. Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, and `ENABLE_ONLINE_PAYMENTS=true`. Register `https://orniva-jewelry-store.onrender.com/api/payments/razorpay/webhook` for `payment.captured`. Test with Razorpay test credentials before enabling live payment acceptance. No charge or live provider verification was performed during development. Refund status in the owner workspace records a refund; it does not execute a financial refund. Unpaid online orders retain their stock reservation until the owner cancels them.

### Password recovery email

Set `RESEND_API_KEY` and `EMAIL_FROM` to a verified sender. Recovery tokens are sent only by email, expire after 15 minutes, and are never returned by the API. Without email configuration, the customer sees an honest support message. Existing sessions are invalidated after a password reset. Email delivery has not been tested with a live provider.

### Store policies and catalog

No new delivery times, certifications, warranties, or refund conditions were invented. The existing catalog currently contains three records; those names, categories, photos, descriptions, and prices were kept exactly as supplied. The owner can expand and refine the catalog in Products & inventory. Before public launch, the owner should supply their final privacy notice and terms: the old site’s links pointed to the contact page, and no legal policy text was available to preserve.

## Verification

- `npm run build --prefix client`
- `npm run lint --prefix client`
- `npm test --prefix client`
- `npm test --prefix server`

Backend tests use controlled model doubles and a local HTTP server. They cover input validation, duplicate-item aggregation, totals consistency, atomic stock predicates, transaction rollback handling, checkout retries, one-time restocking, authentication, protected routes, payment binding, and webhook authentication/replay checks. They do not replace a staging run against MongoDB and payment providers.

Browser checks covered the real public catalog, wishlist and bag persistence, stock caps, product details, mobile navigation, filtering, sign-in redirection, and an isolated test checkout. Owner product editing and fulfillment updates were exercised against `server/test/browser-fixtures.mjs`, which is an explicit test-only process, never imported by the application and never connected to real data.

Research rationale: [docs/DESIGN-RESEARCH.md](docs/DESIGN-RESEARCH.md).

# Maison Crockery: storefront

A Next.js 16, Tailwind v4, Zustand and Sanity storefront for a crockery shop. Customers order without an account: they add items to the cart, check out and pay cash on delivery. Each order is saved in Sanity and emailed to the shop through Resend. The shop then calls the customer to confirm.

- **Products and categories** are managed by the client in Sanity Studio at `/studio`. When they publish a change, the site updates within seconds.
- **Orders** go to Sanity (Studio → Orders, grouped by status) and to `ORDER_NOTIFY_EMAIL`.
- **Without any env vars** the site runs on the mock catalogue in `src/lib/data/`. Orders are only printed to the server log. This mode is handy for design work.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in as you complete the steps below
npm run dev                  # http://localhost:3000  ·  Studio: http://localhost:3000/studio
npm run build                # production build
npm run typecheck
npm run seed                 # upload the example catalogue to Sanity (step 5 below)
```

## Folder structure

```
sanity.config.ts                # Studio config (schemas, sidebar, "orders can't be created by hand")
sanity.cli.ts                   # lets you run `npx sanity …` commands here
scripts/seed.ts                 # uploads the example catalogue + images to Sanity
src/
├── app/
│   ├── layout.tsx              # Root: <html>, fonts, metadata only
│   ├── (site)/                 # The storefront (shares header/footer via (site)/layout.tsx)
│   │   ├── page.tsx            # Home
│   │   ├── shop/  category/[slug]/  product/[slug]/
│   │   ├── cart/  checkout/  order-success/
│   │   └── about/  contact/
│   ├── studio/[[...tool]]/     # Embedded Sanity Studio (no shop chrome or Tailwind)
│   ├── api/revalidate/         # Sanity webhook → refreshes cached pages on publish
│   ├── not-found.tsx           # 404
│   └── globals.css             # Tailwind + design tokens (loaded by SiteShell)
├── components/
│   ├── layout/SiteShell.tsx    # Announcement bar, header, footer, cart drawer
│   ├── ui/ layout/ home/ product/ cart/
│   └── checkout/               # CheckoutForm, summary, Turnstile widget
├── emails/                     # React Email templates: NewOrderEmail (shop), OrderConfirmationEmail (customer)
├── sanity/
│   ├── env.ts                  # project ID / dataset; isSanityConfigured
│   ├── client.ts               # read client + sanityFetch (cache tags)
│   ├── write-client.ts         # server-only client that creates orders
│   ├── queries.ts              # GROQ queries, shaped like src/types
│   ├── image.ts                # Sanity image → 4:5 cropped URL (respects hotspot)
│   ├── structure.ts            # Studio sidebar: Orders by status, Products, Categories
│   └── schemaTypes/            # product, category, order
├── lib/
│   ├── api.ts                  # ⭐ The only place pages get data from (Sanity, or mock fallback)
│   ├── orders.ts               # placeOrder server action: validate → re-price → save → email
│   ├── order-notify.ts         # saveOrder (Sanity) + sendOrderEmails (Resend)
│   ├── turnstile.ts            # server-side bot check
│   ├── validation.ts           # zod checkout schema, PK mobile numbers, city list
│   └── data/                   # mock catalogue (fallback + seed source)
├── store/cart-store.ts         # Zustand cart, persisted to localStorage
└── config/site.ts              # ⭐ Brand name, contact, WhatsApp, delivery fee, nav, site URL
```

## Where to change things

| What | File |
|---|---|
| Brand name, phone, WhatsApp, email, address, **site URL** | `src/config/site.ts` |
| Free-delivery threshold, flat delivery fee | `src/config/site.ts` → `shipping` |
| Navigation (built from Sanity categories; order by each category’s *Position*) | `SiteShell.tsx`, limit in `src/config/site.ts` |
| City list at checkout | `src/lib/validation.ts` |
| Colours and fonts | `src/app/globals.css` → `@theme` |
| Product / category fields in the Studio | `src/sanity/schemaTypes/` |
| Order email layout | `src/emails/` |

---

## 1. Connect Sanity

1. **Create the project.** Sign in at [sanity.io/manage](https://www.sanity.io/manage) → *Create project*. Create a dataset named `production`. Copy the **Project ID** into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. **Allow the Studio to log in (CORS).** In the project → *API* → *CORS origins*, add each of these with **“Allow credentials” ticked**:
   - `http://localhost:3000`
   - `https://www.yourdomain.com` (and `https://yourdomain.com`)
   - your Vercel URL, e.g. `https://maison-crockery.vercel.app`

   If you skip this step, `/studio` shows a CORS error. It's the step people miss most often.
3. **Create tokens.** In *API* → *Tokens*, create two:
   - `website-write`, role **Editor** → `SANITY_API_WRITE_TOKEN`. This saves orders and runs the seed.
   - Optional, only for a private dataset: `website-read`, role **Viewer** → `SANITY_API_READ_TOKEN`
4. **Customer privacy (no action needed).** On the Free plan the dataset is public: anyone who knows the project ID can read published products, which is fine. Orders are saved with IDs like `orders.ORD-261003-K7QM`. Sanity treats any ID containing a dot as private, so only logged-in Studio users and token holders can read them. If you later move to a paid plan, you can also set the dataset to **Private**. The site then reads with the Viewer token (`SANITY_API_READ_TOKEN`), which isn't needed on the Free plan.
5. **Load the example catalogue.** Run `npm run seed`. It uploads 6 categories, 12 products and the Homepage content with images. It's safe to re-run: it only creates what's missing and never overwrites the client's edits. The client can then edit these or replace them with real photos.
6. **Webhook for instant updates.** Do this after the site is deployed. In *API* → *Webhooks* → *Create webhook*:
   - **URL:** `https://www.yourdomain.com/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["product", "category", "homepage"]`
   - **Projection:** `{_type}`
   - **HTTP method:** POST
   - **Secret:** any long random string. Put the same value in `SANITY_REVALIDATE_SECRET`.

   Without the webhook (e.g. on localhost, which Sanity can't reach), the site re-checks Sanity every 10 seconds instead. With the webhook it caches for an hour and refreshes instantly on publish.
7. **Invite the client.** Go to *Members* → *Invite*, role **Editor**. They log in at `https://www.yourdomain.com/studio`.

## 2. Domain and email

**Buy the domain.** For a `.com`, use Cloudflare Registrar (sold at cost, and DNS is easy). Namecheap and Porkbun also work. For a `.pk`, use PKNIC or a local reseller. The steps below assume the DNS is managed in Cloudflare.

**Point the domain to Vercel.** In Vercel → Project → *Settings* → *Domains*, add `yourdomain.com` and `www.yourdomain.com`. Then create the DNS records Vercel shows you in Cloudflare, with the proxy set to **DNS only** (grey cloud). Finally, set `url` in `src/config/site.ts` to the real domain. It's used for SEO and for the “Open order in Studio” link in emails.

**Receive orders at `orders@yourdomain.com`.** Pick one:
- **Cloudflare Email Routing** (free): *Email* → *Email Routing* → forward `orders@` to the client's Gmail. This is the simplest option.
- **Zoho Mail** (free tier) or **Google Workspace** (paid): use one of these if the client wants a real inbox and wants to reply from the domain.

**Send order emails (Resend).**
1. Create an account at [resend.com](https://resend.com) → *API Keys* → create one → `RESEND_API_KEY`.
2. *Domains* → *Add domain* → `yourdomain.com`. Add the records Resend shows (DKIM TXT, plus SPF/MX on the `send.` subdomain) in Cloudflare, then click *Verify*. These records live on a subdomain, so they don't clash with Cloudflare Email Routing.
3. Add a DMARC record: TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:orders@yourdomain.com`
4. Set these env vars:
   ```
   ORDER_NOTIFY_EMAIL=orders@yourdomain.com
   ORDER_FROM_EMAIL="Maison Crockery <orders@yourdomain.com>"
   ```

**Before the domain is verified,** leave `ORDER_FROM_EMAIL` empty and set `ORDER_NOTIFY_EMAIL` to the email you signed up to Resend with. Resend's test sender only delivers there. Customer confirmation emails switch on automatically once `ORDER_FROM_EMAIL` is a verified address.

## 3. Spam protection (recommended before launch)

In Cloudflare → *Turnstile* → *Add widget*, enter your domain and `localhost`. Copy the keys into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. A small check box then appears above “Place order”, and bots that skip it are rejected on the server. A hidden honeypot field is already active even without Turnstile.

## 4. Deploy to Vercel

Import the project in Vercel, or run `npx vercel` in this folder. Add every variable from `.env.local` under *Settings* → *Environment Variables*, then redeploy. Then:
- Add the Vercel and production URLs to Sanity CORS (step 1.2).
- Create the webhook (step 1.6).
- Place a test order and check that it appears both in the inbox and in Studio → Orders.

## Order flow

1. The cart lives in the browser (localStorage). No login is needed.
2. Checkout validates in the browser, then `placeOrder` (`src/lib/orders.ts`) runs on the server:
   - checks the honeypot and Turnstile
   - validates the fields again
   - re-reads prices and stock from Sanity, uncached. **Prices sent from the browser are never trusted.**
3. If an item is sold out or deleted, or its price has changed, checkout stops. It updates the cart (removing the item or applying the new price) and asks the customer to review. It never silently changes the order.
4. The order gets a number like `ORD-261003-K7QM` and is **saved to Sanity first, then emailed**:
   - A failed email never loses the order.
   - If both steps fail, the customer sees an error instead of a false “order placed”.
5. The client calls the customer and moves the order through **New → Confirmed → Dispatched → Delivered** (or Cancelled) in the Studio.

## Guide for the client (Studio)

- **Add a product:** *Products* → ✎ → fill in the name, then click *Generate* next to URL. Choose a category and drag in photos (the first is the main one). Add the price and descriptions → **Publish**.
- **Sale price:** put the old price in *Original price*. It shows crossed out, with a “Sale” badge.
- **Sold out:** turn off *In stock*. The product stays visible but can't be ordered.
- **Photo framing:** click a photo → *Edit* (crop icon) → drag the focus circle onto the important part.
- **Home page banner:** *Homepage* → change the banner photo, headline, text or second button → **Publish**. The “Our story” photo is in the second tab.
- **Orders:** *Orders* → *🆕 New*. Call the customer, change *Status*, and add an *Internal note* if useful.

## Still open

- Brand name, contact details, delivery fee (Rs 250), free-delivery threshold (Rs 10,000) and city list are placeholders. Confirm them with the client in `src/config/site.ts` and `src/lib/validation.ts`.
- Optional: move contact details and delivery fees into a Sanity “Site settings” document, so the client can edit them without a developer.

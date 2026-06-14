# SpreeDesk — Your place to work awaits in Berlin

A runnable MVP of **SpreeDesk**, an on-demand coworking marketplace for Berlin, built for the
Berlin market with real locations, photography, a services menu and a full
**cart → checkout** flow.

> **Tagline:** Discover SpreeDesk. Your place to work awaits.

## The product

**6 Berlin locations**, each with a code, a “Where X meets Y” tagline, real
coworking photography and its own microsite:

| Code | Location | District | Tagline |
| --- | --- | --- | --- |
| MIT | Spreebogen Loft | Mitte | Where history meets the future |
| KRZ | Oranien Works | Kreuzberg | Where industry meets creativity |
| PBG | Kollwitz Studio | Prenzlauer Berg | Where calm meets focus |
| FRH | RAW Hub | Friedrichshain | Where startups meet late nights |
| CHB | Kurfürst Offices | Charlottenburg | Where classic meets corporate |
| NKN | Sonnenallee Collective | Neukölln | Where culture meets community |

**Services** (Moar-style menu): Coworking Pass · Memberships · Meeting Rooms ·
Private Office · Event Venue.

## Features

- **Landing** — Berlin hero, services strip, location cards (real photos), how-it-works, perks carousel, pricing, testimonials, hours/community banner, FAQ
- **Locations** — searchable + district filter, map strip with location pins
- **Space microsite** — photo gallery + lightbox, services & rates with per-item **add to cart**, amenities, perks, map, reviews, sticky instant-booking pane
- **Services pages** — `/services/meeting-rooms`, `/private-office`, `/event-venue` list every location offering that service, each addable to cart
- **Cart & checkout** — quantities, discount codes (`SPREE10`, `REFER10`), order summary; checkout creates an Order, activates memberships (+wallet credits) and books rooms
- **Member dashboard** — tabbed (Overview, Bookings, Wallet, Perks, Team) with QR check-in
- **Operator dashboard** — sidebar (Overview, Inventory, Bookings, Analytics, Community, Settings) with revenue chart, occupancy gauge, heatmap
- **6-step onboarding wizard** that creates a real, live Space
- **Inventory webhook** at `POST /api/webhooks/spacesync`

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind · Prisma. Pragmatic swaps so it
runs demo-ready with **zero external accounts** (all documented integration
points): **SQLite** (→ Postgres in prod), **mock cookie auth** (→ NextAuth),
**Stripe/Mapbox/Pusher stubbed**. Images are real photos served from Unsplash.

## Run it

```bash
npm install
npm run setup     # prisma generate + db push + seed (6 Berlin locations)
npm run dev       # http://localhost:3100
```

Runs on **port 3100** to avoid clashing with other local servers on 3000.

### Demo logins (top-right)

- **Member** — `member@spreedesk.com` (40 credits, FlexPass 40)
- **Operator** — `operator@spreedesk.com` (Spree Spaces GmbH, 6 locations)

### Try the full flow

1. Open a location → **Add** a meeting room and a membership to cart.
2. Open the **cart** → apply `SPREE10` → **Checkout** (sign in as Member first).
3. Check the **Member dashboard** — credits topped up, booking listed.
4. **Operator demo** → occupancy/revenue reflect the new bookings.

## Production checklist

- [ ] Prisma → Postgres · NextAuth (magic-link + OAuth)
- [ ] Stripe Connect (payouts + PaymentIntents + webhook verification)
- [ ] Mapbox on Locations · Pusher real-time · S3 image uploads
- [ ] Playwright + Vitest · GitHub Actions CI

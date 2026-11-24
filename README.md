# Upsworth PMS

One Next.js project with two parts:

| Address | What it is | Code |
| --- | --- | --- |
| `/` | Coming soon page | `pages/index.tsx` |
| `/v2` | New marketing website (hidden from search engines until launch) | `app/[locale]` |

## Run it

Needs Node 20.9 or newer.

```bash
npm install
npm run dev
```

Coming soon: http://localhost:3000. New site: http://localhost:3000/v2

Other commands: `npm run build`, `npm start`, `npm run lint`, `npm run type-check`.

## Launch the new site

In `content/site.ts`, change `launched` to `true` and deploy. Then:

- the new site moves to `/` and replaces the coming soon page,
- `/v2/...` links redirect to the new addresses,
- the no-index tag is removed and `sitemap.xml` lists every page.

Set it back to `false` to undo.

## Environment variables

Copy `.env.example` to `.env`. On the host, add the same names in its settings.

| Name | Needed | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Sends enquiry emails |
| `ENQUIRY_FROM` | Yes, in production | Sender address on a domain verified in Resend |
| `ENQUIRY_TO` | No | Where enquiries go. Default `info@upsworth-pms.com` |

Until a domain is verified at [resend.com/domains](https://resend.com/domains),
Resend only delivers to the account owner's own address, and the forms show
their failure message.

**Without a backend (Formspree):** create a form at formspree.io, then in
`components/forms/useEnquiry.ts` change the `fetch` address from `/api/enquiry`
to your Formspree URL and add `Accept: "application/json"` to the headers. You
can then delete `app/api/enquiry`. Server-side validation no longer runs.

## Edit content

| What | Where |
| --- | --- |
| All text | `messages/en.json` |
| Phone, email, address, social links, footer credit, feature flags | `content/site.ts` |
| Services and their images | `content/services.ts` |
| Stats | `content/stats.ts` |
| Testimonials | `content/testimonials.ts` |
| Brand colours | top of `app/globals.css` |
| Logo | `public/brand/*.svg` (full, horizontal, mark; `-light` for dark backgrounds), shown by `components/ui/Logo.tsx`. Icons: `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` |

**Stats:** a stat with `value: null` is hidden. Replace `null` once confirmed.

**Testimonials:** add real ones, with permission, to the list. While it is empty
no testimonial shows anywhere. Once added, on desktop:

- one without `service` becomes the last message as visitors scroll the home hero,
- one with `service` closes that service in the home services section, replacing
  the key fact or disclaimer card there,
- `service: "logistics"` or `"realEstate"` also closes that page's scroll story.

The disclaimers still appear further down both investment pages. Keep each quote
under about 160 characters so it fits the services section on small laptops.

**Investor login:** set `features.investorLogin` to `true` in `content/site.ts`.

## Replace images

Images in `public/images` are placeholders rendered from the site's own 3D
models, so there are no stock licences to manage. Keep the file name and the
shape, or change the name in `content/services.ts` or the page.

| File | Used for | Size |
| --- | --- | --- |
| `hero-skyline.webp`, `hero-skyline-mobile.webp` | Home hero before 3D loads, and on phones | 2400x1350, 1200x1000, transparent |
| `story-truck.webp`, `story-truck-mobile.webp` | Logistics scroll story | 2000x1125, 1200x960, transparent |
| `story-building.webp`, `story-building-mobile.webp` | Real estate scroll story | 2000x1125, 1200x960, transparent |
| `construction-site.webp`, `truck-fleet.webp`, `residential-towers.webp`, `container-port.webp`, `dubai-skyline.webp` | Cards and page headers | 1600x1067 |
| `service-*.webp` | Service cards on phones (home page) | 1080x1008, transparent |
| `public/og/*.jpg` | Link previews | 1200x630 |

## Replace 3D models

The models are drawn in code (`components/three`). To use real ones, add any of
these to `public/models` and redeploy. They are picked up automatically, centred
and scaled:

- `skyline.glb` (home hero)
- `truck.glb` (logistics, facing +X)
- `building.glb` (real estate)

Use compressed glTF (Draco is supported, decoder in `public/draco`) and aim for
under 1.5 MB each. Update the matching still image so phones show the same thing.

## Motion and fallbacks

- The home hero, the home services section and both scroll stories are pinned on
  screens at least 1024 px wide with a mouse or trackpad. Phones and tablets get
  still images and normal page flow.
- Without WebGL 2 or enough memory, the pinned sections still play, with still
  images that zoom in place of the 3D. On a slow computer the 3D drops its
  sharpness and stops moving by itself, but always follows the scroll.
- `prefers-reduced-motion` turns off pinning, rotation, counters and fades.
- Nothing is hidden without JavaScript.
- GSAP ScrollTrigger drives the pinned scenes. The process timelines use a small
  scroll hook (`lib/useScrollProgress.ts`), so phones never download GSAP.

## Languages

English and Arabic share the same addresses. The header button saves the
visitor's choice in a cookie (`upsworth-lang`, one year) and reloads the page;
`next.config.ts` then serves that language's built page. Without a cookie,
visitors get English. Arabic browsers are offered Arabic once, never switched
automatically.

Because the address is the same, search engines only see English. To have
Arabic pages found on Google, give Arabic its own addresses and `hreflang` tags.

To change wording, edit `messages/en.json` and `messages/ar.json`. Both must have
the same keys.

To add a language:

1. Copy `messages/en.json` to `messages/<code>.json` and translate it.
2. Add the code and its own name in `i18n/config.ts`. Right-to-left is automatic.
3. Optionally add an offer in `content/language.ts`.
4. Add a font in `lib/fonts.ts` if Manrope lacks the letters, with typography
   rules in `app/globals.css` (see "Arabic").

The switcher cycles through the list, so with three or more languages it should
become a menu.

## Deploy

**Vercel:** import the repository, add the environment variables, deploy.
**Netlify:** the same; `netlify.toml` is ready and Next.js is detected.

Check your host's terms for commercial use. Some free plans, including Vercel's
Hobby plan, are for personal projects only.

## Decisions made

- `/v2` is a path, not a subdomain, so it needs no DNS or hosting changes.
- Budget is a free-text question, because price bands would have been invented.
- Orange is never used for text on white (contrast is too low). A darker shade
  (`--c-accent-ink`) is used, and orange buttons have navy text.
- Framer Motion was left out. CSS covers the simple transitions with less code.
- The Draco decoder is served from this site rather than a third-party CDN.

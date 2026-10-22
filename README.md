# EBCA Companion

A single-page, mobile-first **companion app** for the **East Bengaluru Cultural Association (EBCA)** —
built to help existing and prospective members **join or renew**, to introduce **sponsorship**
opportunities to brands, and to make **seva offerings** easy to find.

It is designed to *complement* EBCA's official website (https://ebcafamily.com), not replace it:
the official site is the full festival guide; this app is the quick, focused path to joining,
sponsoring and getting answers.

## What it does

- **Membership plans** — Solo (₹3,001/year) and Family (₹4,501/year, up to 4 members).
- **Join / Renew form** — validates details, autosaves progress on the device, and prepares a
  ready-to-send request for the EBCA membership desk via **WhatsApp**, **email** or
  **copy-to-clipboard**, with the payment link included.
- **Payment** — links to EBCA's secure portal (UPI, cards, net banking).
- **Bhakti Samarpan** — the divine offering / seva contribution, with query contacts.
- **Sponsorship** — impact figures, the four tiers (Shakti, Sanskriti, Mahotsav, Adya Shakti),
  and a **budget calculator** that maps a budget to a tier, its benefits and indicative reach.
- **Ask EBCA** — an on-device assistant that answers questions about membership, payment, the
  venue, bhog timings, sponsorship and volunteering, with action links.
- **Find your fit** — a 30-second recommender for members, sponsors and seva.
- **About / festival** — journey, awards, media recognition, and the day-wise Puja schedule.
- **FAQ, contact, venue directions**, add-to-calendar, and share.

## Features

- Light / dark theme (follows system preference, remembered per device)
- Installable PWA with offline support (service worker, network-first for pages)
- Accessible: keyboard focus states, skip link, ARIA labels, reduced-motion support
- No build step, no dependencies — plain HTML, CSS and vanilla JavaScript

## Tech

| File | Purpose |
| --- | --- |
| `index.html` | The whole app — markup, styles and logic |
| `manifest.webmanifest` | PWA metadata for install |
| `sw.js` | Service worker (offline / caching) |
| `icon-192.png`, `icon-512.png` | App icons |

Hosted with GitHub Pages.

## Updating

Most content lives in `index.html`. The festival dates are defined near the top of the script:

```js
var PUJA_START = new Date("2026-10-16T00:00:00+05:30");
var PUJA_END   = new Date("2026-10-21T23:59:59+05:30");
```

Update these each year — the countdown and status message adapt automatically (before, during
and after the festival). The assistant's answers live in the `KB` array in the same script.

## Contact

- Phone / WhatsApp: +91 96062 98720
- Email: info@ebcafamily.com · sponsorship@ebcafamily.com
- Web: https://ebcafamily.com

---

*An independent companion app. All EBCA details are drawn from the official EBCA website.*

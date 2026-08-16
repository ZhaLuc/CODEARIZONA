# Design system

One visual system. Cool mineral surfaces, ink text, a single copper accent on remaining counts. Not a cream-and-serif template, not a government portal, not a generic SaaS dashboard.

## Typography

- **UI / display:** Geist (`next/font/google`)
- **Numerals:** Geist Mono, tabular lining figures (`.num`)
- Display tracking is tight. Body is limited toward ~65 characters on reading blocks.

## Color tokens (`src/app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#f3f4f1` | Page |
| `--surface` | `#fbfcf9` | Cards |
| `--text` | `#161c19` | Primary text and primary buttons |
| `--text-2` | `#4a5550` | Secondary |
| `--text-3` | `#6b756f` | Captions |
| `--accent` | `#c24e1d` | Remaining-need emphasis |
| `--verified` | `#1b5c43` | Verified / closed |
| `--pending` | `#8a6419` | Pending copy |
| `--danger` | `#b42318` | Reject / errors |
| `--info` | `#2a4556` | Policy chrome |

Status is never color-only. Chips also say **Verified**, **Under review**, **Awaiting teacher confirmation**.

## Spacing and radius

Section gaps are large. Radii: 8 / 14 / 22px. Primary actions are full pills with 44px minimum height.

## Elevation and layers

Soft shadow `--shadow-2`. Z-index scale: base 1, sticky 20, header 40, dropdown 50, modal/menu 60, toast 70. Map is isolated at 0 so Leaflet panes cannot cover the header.

## Interaction

- Hover and `active: scale(0.98)` on buttons
- Ledger pop animation on verified updates (`need-pop`), skipped under `prefers-reduced-motion`
- Visible `:focus-visible` rings
- Scrollbars are visually hidden; scrolling still works

## Hierarchy

Every primary screen answers: what am I looking at, what remains, what can I do. Remaining numerals outrank biography and policy.

Screenshot references (when present): `docs/assets/meridian-hero.png`, `remaining-need-ledger.png`, `mobile-experience.png`.

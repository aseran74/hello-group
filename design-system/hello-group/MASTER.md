# Design System Master File — Hello Group

> **LOGIC:** When building a page, check `design-system/hello-group/pages/[page].md` first.
> Page rules override this Master. Otherwise follow Master.

**Project:** Hello Group  
**Stack:** Nuxt 4 + Vue 3 + Tailwind  
**Category:** Hospitality / urban stays + hotel  
**Generated via:** ui-ux-pro-max (adapted to live brand tokens)

---

## Global Rules (live brand — do not replace with navy/gold)

### Color Palette

| Role | Hex | Token |
|------|-----|-------|
| Ink / foreground | `#1a1a1a` | `--color-ink` |
| Paper / background | `#f7f4ef` | `--color-paper` |
| Card | `#ffffff` | `--color-paper-elevated` |
| Mute | `#6b6b6b` | `--color-mute` |
| Line / border | `#e8e2d9` | `--color-line` |
| Mist | `#fffaf5` | `--color-mist` |
| Accent / CTA | `#ff6b35` | `--color-accent` |
| Accent soft | `#ff8a5c` | `--color-accent-soft` |
| Accent deep | `#e85a28` | `--color-accent-deep` |

### Typography

- **Display:** Sora (headings)
- **Body:** Plus Jakarta Sans
- **Brand black:** Poppins 900 (hero brand line)
- Base body ≥ 16px; line-height ~1.5; avoid body text &lt; 12px

### Spacing

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

### Motion

- Hover/focus transitions: **150–300ms**
- Card image hover scale: soft, skip under `prefers-reduced-motion`
- Hero Apple scroll: already respects reduced motion
- Stagger grids only when meaningful; no width/height animation

### Anti-patterns (from skill + project)

- No purple/indigo theme drift
- No emoji as icons (use SVG)
- No hover-only critical actions
- No tiny touch targets (&lt; 44px interactive)
- No complex booking UI — RoomRaccoon embed is enough

---

## Landing pattern (skill)

**Hero → Stays (apartments / rooms) → Mission / Moments → About band + FAQ → CTA**

- Social proof / trust can sit in About band + FAQ
- Sticky primary CTAs: Book / Ver alojamientos
- Cards usable without hover; focus ring always visible

---

## Component rules

### Buttons
- `min-h-11` (44px), `cursor-pointer`, focus-visible ring with accent
- Primary = accent orange; Secondary = white border; Ghost = light on dark media

### House cards
- Mobile: **1 column**; Desktop: 2 → 3
- Name fully visible (no truncate)
- Arrow control ≥ 44×44 on touch
- Lazy images; reserve aspect ratio to avoid CLS
- Meaningful `alt` from house name

### Distances sidebar
- Compact landmark rows (Retiro, Alcalá…)
- Route link still tappable (≥ 32–44px hit area via padding)

### Accessibility checklist
- [x] Contrast ≥ 4.5:1 body text (ink on paper / mist on ink)
- [x] Focus visible (header, footer, FAQ, cards, forms)
- [x] `prefers-reduced-motion` (cards, FAQ chevrons, menu icon)
- [x] No emoji icons (SVG pin on house detail)
- [x] Touch targets ≥ 44px (nav mobile, FAQ, footer links, CTAs)
- [ ] Responsive spot-check 375 / 768 / 1024 / 1440 (manual)

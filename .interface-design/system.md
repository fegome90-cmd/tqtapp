# Design System — tqtapp

## Direction

**Personality:** Warmth & Trust (medical app for anxious patients)
**Foundation:** Cool-warm (slate + blue accent)
**Depth:** Surface color shifts (borders-only, minimal shadows)
**Iconography:** Lucide (SVG, consistent)

## Tokens

### Spacing
Base: 4px
Scale: 4, 8, 12, 16, 20, 24, 32

### Surfaces (elevation)
```
--surface-0: #f8f9fa    /* canvas background */
--surface-1: #ffffff    /* cards, panels */
--surface-2: #f1f5f9    /* inset, recessed areas */
```

### Borders
```
--border-subtle: rgba(0, 0, 0, 0.04)   /* minimal separation */
--border-default: rgba(0, 0, 0, 0.08)  /* standard cards */
--border-strong: rgba(0, 0, 0, 0.15)   /* emphasis, focus */
```
Tailwind: `border-slate-200/60` for cards, `border-slate-300` for hover

### Colors (Material tokens via tailwind.config.js)
```
primary: #002d60           /* deep navy — headers, active states */
primary-container: #014389 /* slightly lighter — CTA, emphasis */
secondary: #bc000c         /* red — urgency, emergency */
surface: #f8f9fa           /* canvas */
on-surface: #191c1d        /* default text */
error: #ba1a1a             /* destructive actions */
```

### Text Hierarchy
```
--text-primary: #1e293b    /* default text (slate-800) */
--text-secondary: #475569  /* supporting text (slate-600) */
--text-tertiary: #94a3b8   /* metadata, labels (slate-400) */
--text-muted: #cbd5e1      /* disabled, placeholder (slate-300) */
```

### Radius
Scale: `rounded-xl` (buttons/pills), `rounded-2xl` (cards), `rounded-3xl` (containers/modals)

### Typography
Font: Nunito (via Google Fonts)
Scale: 9px (nav labels), 14px (body), 18px (card titles), 20px (headings), 24px (hero)

## Patterns

### BottomNav
- Height: compact (`py-1.5 px-3`)
- Icons: Lucide SVG `w-5 h-5`
- Active: `bg-primary-container text-white rounded-xl`
- Inactive: `text-outline-variant hover:text-primary`
- Position: `fixed bottom-3 left-3 right-3`
- Shadow: `shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]` (subtle, not dramatic)

### CategoryCard
- Border: `border-slate-200/60`, hover: `border-slate-300`
- Padding: 16px (`p-4`)
- Radius: `rounded-2xl`
- Icon container: `w-14 h-14 rounded-2xl` with category-specific color
- No shadow — border-only depth
- Active: `scale-[0.98]`

### PhraseCard
- Border: `border-slate-200/60`
- Radius: `rounded-2xl`
- Playing indicator: `bg-primary-container` (not blue-500)
- Favorite: `fill-yellow-400 text-yellow-400`
- Height: `min-h-[80px]`

### EmergencyCTA
- Background: `bg-primary-container` (Material token)
- Shadow: `shadow-[0_8px_24px_-8px_rgba(1,67,137,0.25)]`
- Hover: `hover:brightness-110`
- Radius: `rounded-3xl`
- Icon container: `w-14 h-14 rounded-2xl bg-white/20`
- Active: `scale-[0.98]`

### Container (desktop frame)
- Border: `sm:border-[3px] sm:border-slate-300`
- Radius: `sm:rounded-3xl`
- Shadow: `sm:shadow-2xl`

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Surface color shifts over shadows | Medical app needs calm, not drama. Shadows add visual weight without info value. | 2026-04-13 |
| Lucide over Material Symbols | SVG icons load without external font dependency. Consistent with existing stack. | 2026-04-13 |
| Nunito font | Warm, approachable. Not clinical. Readable at large sizes for patients. | 2026-04-13 |
| Compact BottomNav | Mobile-first. Previous version was desktop-sized on mobile screens. | 2026-04-13 |
| Border-slate-200/60 as default | Barely visible but findable. Whisper-quiet structure. | 2026-04-13 |
| Zero shadow-sm across all cards | Critique revealed inconsistent shadow-sm on PhraseCard, Profile, Textarea. Removed all — depth via borders only. | 2026-04-13 |
| Volume button as `<button>` | Was a `<div>` with no hover state. Interactive elements need life. | 2026-04-13 |
| space-y-8 for Home sections | Breathing room between Emergency CTA and categories. The focal point needs space around it. | 2026-04-13 |
| Maia theme style | Warmth & Trust personality with cool-warm foundation. Maia provides the emotional tone: calm, approachable, non-clinical. Chosen specifically for laryngectomy patients who are anxious and vulnerable. | 2026-04-14 |

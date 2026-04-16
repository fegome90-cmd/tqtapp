# TQT App — Design SSOT (Single Source of Truth)

> Fecha: 2026-04-15
> Basado en: `stich_examples/example_1.html` como referencia visual
> Skills seleccionadas: `design-principles` (craft) + `typeui-clean` (tokens) + `typeui-friendly` (calidez clínica)
> Personalidad: **Warmth** — claridad profesional con cercanía humana

---

## 0. Decisión de Diseño

### Referencia visual

El archivo `stich_examples/example_1.html` establece el lenguaje visual objetivo. Este SSOT extrae sus patrones, los formaliza como tokens, y los eleva con las reglas de `design-principles`, `typeui-clean`, y `typeui-friendly`.

### Personalidad (design-principles)

**Warmth** — La app debe transmitir calma, confianza y cercanía a un paciente hospitalizado que no puede hablar.

Implicaciones:
- Sin contrastes agresivos, sin animaciones bruscas
- Colores suaves con saturación moderada
- Tipografía redondeada (Nunito) — ya en uso
- Espaciado generoso, sin congestión visual
- Feedback visual suave (scale sutil, transiciones calmadas)

### Skills autoritativas

| Skill | Rol | Autoridad sobre |
|-------|-----|----------------|
| `design-principles` | Craft general | Grid, jerarquía, anti-patrones |
| `typeui-clean` | Token system | Paleta, tipografía, estados de componentes, QA checklist |
| `typeui-friendly` | Tono clínico | Calidez, amigabilidad, contexto paciente |
| `web-design-guidelines` | Auditoría | WCAG, accesibilidad |
| `mobile-design` | Dispositivos | Touch targets, thumb zones, MFRI |

### Regla SSOT

> **Todo valor visual se define como CSS custom property en `src/index.css` `:root`.**
> **Los componentes consumen tokens, nunca valores crudos.**
> **`tailwind.config.js` solo referencia CSS vars. No define valores propios.**

---

## 1. Paleta de Color

### Análisis del ejemplo

El ejemplo usa **Material Design 3 Blue** con esta jerarquía real:

| Rol | Token MD3 | Hex | Uso en ejemplo |
|-----|-----------|-----|----------------|
| Surface (fondo) | `surface` / `background` | `#f8f9fa` | Body background |
| Card | `white` | `#ffffff` | Cards, chat bubbles |
| Primary (accion) | `primary-container` | `#014389` | BottomNav activo, EmergencyCTA, header icon |
| Primary light | `primary-fixed` | `#aac7ff` | Avatar border, icon backgrounds |
| Text principal | `on-surface` | `#191c1d` | Títulos, body text |
| Text secundario | `on-surface-variant` | `#424751` | Descripciones, labels |
| Text inactivo | `outline-variant` | `#c3c6d2` | BottomNav tabs inactivos |
| Error | `error` | `#ba1a1a` | Notification dot |
| Error suave | `error-container` | `#ffdad6` | "Me duele" icon bg |

### Tokens SSOT (`index.css` `:root`)

Reemplazar todos los colores existentes con:

```css
:root {
  /* --- Superficies --- */
  --color-surface:       #f8f9fa;   /* Fondo app */
  --color-card:          #ffffff;   /* Cards, sheets */
  --color-card-elevated: #ffffff;   /* Cards con shadow */

  /* --- Brand --- */
  --color-primary:       #002d60;   /* Acentos, focus rings */
  --color-primary-action: #014389;  /* Botones principales, nav activo */
  --color-primary-light:  #aac7ff;  /* Borders decorativos, icon bgs */

  /* --- Texto --- */
  --color-text-heading:  #191c1d;   /* Títulos */
  --color-text-body:     #191c1d;   /* Body text */
  --color-text-secondary:#424751;   /* Descripciones, labels */
  --color-text-muted:    #64748b;   /* Placeholder, hint (4.0:1 min) */
  --color-text-on-action:#ffffff;   /* Texto sobre primary-action */

  /* --- Bordes --- */
  --color-border:        rgba(0, 0, 0, 0.08);  /* Cards, dividers */
  --color-border-subtle: rgba(0, 0, 0, 0.04);  /* Separadores finos */
  --color-border-focus:  var(--color-primary);  /* Focus rings */

  /* --- Semánticos --- */
  --color-error:         #ba1a1a;
  --color-error-bg:      #ffdad6;

  /* --- Glass --- */
  --color-glass:         rgba(255, 255, 255, 0.90);  /* BottomNav, TopBar */
  --color-glass-border:  rgba(255, 255, 255, 0.50);
}
```

### Categorías médicas

Mantener colores semánticos por categoría desde `seed.ts`, pero refactorizar a tokens:

```css
:root {
  --cat-urgente-bg:      #fef2f2;  /* red-50 */
  --cat-urgente-text:    #dc2626;  /* red-600 */
  --cat-urgente-border:  #fecaca;  /* red-200 */

  --cat-dolor-bg:        #fff7ed;  --cat-dolor-text:    #ea580c;  --cat-dolor-border:  #fed7aa;
  --cat-respiracion-bg:  #eff6ff;  --cat-respiracion-text:#2563eb; --cat-respiracion-border:#bfdbfe;
  --cat-secreciones-bg:  #ecfeff;  --cat-secreciones-text:#0891b2; --cat-secreciones-border:#a5f3fc;
  --cat-posicion-bg:     #eef2ff;  --cat-posicion-text:  #4f46e5; --cat-posicion-border:#c7d2fe;
  --cat-familia-bg:      #faf5ff;  --cat-familia-text:   #9333ea; --cat-familia-border:#e9d5ff;
  --cat-necesidades-bg:  #ecfdf5;  --cat-necesidades-text:#059669; --cat-necesidades-border:#a7f3d0;
  --cat-emociones-bg:    #fdf2f8;  --cat-emociones-text: #db2777; --cat-emociones-border:#fbcfe8;
  --cat-gratitud-bg:     #fffbeb;  --cat-gratitud-text:  #d97706; --cat-gratitud-border:#fde68a;
}
```

---

## 2. Tipografía

### Análisis del ejemplo

| Elemento | Size | Weight | Tracking |
|----------|------|--------|----------|
| CTA título | `text-2xl` (24px) | `font-black` (900) | `tracking-tight` |
| Card título | `text-lg` (18px) | `font-black` (900) | — |
| Chat greeting | `text-xl` (20px) | `font-bold` (700) | — |
| Card descripción | `text-sm` (14px) | `font-medium` (500) | — |
| Nav label | `text-[10px]` | `font-black` (900) | uppercase |
| Section label | `text-base` (16px) | `font-bold` (700) | — |
| CTA subtítulo | `text-xs` (12px) | `font-bold` (700) | `tracking-widest` uppercase |
| Header subtitle | `text-[10px]` | `font-black` (900) | `tracking-wider` uppercase |

### Escala tipográfica SSOT

```css
:root {
  /* --- Familia --- */
  --font-family: 'Nunito', sans-serif;

  /* --- Tamaños (mobile-first) --- */
  --text-xs:     0.75rem;   /* 12px */
  --text-sm:     0.875rem;  /* 14px */
  --text-base:   1rem;      /* 16px */
  --text-lg:     1.125rem;  /* 18px */
  --text-xl:     1.25rem;   /* 20px */
  --text-2xl:    1.5rem;    /* 24px */
  --text-3xl:    1.875rem;  /* 30px */

  /* --- Pesos --- */
  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
  --weight-black:    900;

  /* --- Line-height --- */
  --leading-tight:  1.25;
  --leading-normal: 1.5;
  --leading-snug:   1.375;
}
```

### Mapeo por componente

| Componente | Token size | Token weight | Tracking |
|------------|-----------|-------------|----------|
| TopBar título | `--text-xl` | `--weight-bold` | default |
| EmergencyCTA título | `--text-2xl` | `--weight-black` | tight |
| EmergencyCTA subtítulo | `--text-xs` | `--weight-bold` | widest uppercase |
| CategoryCard título | `--text-lg` | `--weight-black` | default |
| CategoryCard descripción | `--text-sm` | `--weight-medium` | default |
| PhraseCard texto | `--text-lg` | `--weight-medium` | default |
| BottomNav label | `--text-xs` min | `--weight-black` | uppercase |
| Section label (h2) | `--text-sm` | `--weight-bold` | wider uppercase |
| Body text | `--text-base` | `--weight-regular` | default |

---

## 3. Espaciado y Grid

### Regla (design-principles + typeui-clean)

Grid **4px** base. Todos los valores son múltiplos de 4.

```css
:root {
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
}
```

### Touch targets (mobile-design + android-accessibility)

```css
:root {
  --touch-min:     48px;  /* WCAG/Android minimum */
  --touch-medical: 56px;  /* Contexto clínico */
}
```

---

## 4. Border Radius

### Análisis del ejemplo

| Elemento | Valor | Nota |
|----------|-------|------|
| BottomNav container | `2.5rem` (40px) | **Grande** — pill shape |
| BottomNav tab activo | `2rem` (32px) | Pill shape interno |
| Cards / chat bubbles | `1.5rem` (24px) | `rounded-3xl` |
| Icon containers | `1rem` (16px) | `rounded-2xl` |
| Avatares, notification dot | `9999px` | `rounded-full` |
| Chat bubble tail | `4px` | Solo el corner del tail |

### Escala SSOT

```css
:root {
  --radius-sm:   0.5rem;   /* 8px  — chips, small elements */
  --radius-md:   1rem;     /* 16px — icon containers */
  --radius-lg:   1.5rem;   /* 24px — cards */
  --radius-xl:   2rem;     /* 32px — nav tab, large buttons */
  --radius-pill: 2.5rem;   /* 40px — BottomNav container */
  --radius-full: 9999px;   /* avatares, dots */
}
```

### Regla

- **1 radius por nivel de componente** — sin excepciones.
- Cards siempre `--radius-lg` (24px).
- BottomNav container: `--radius-pill` (40px).
- BottomNav tab activo: `--radius-xl` (32px).
- Icon containers dentro de cards: `--radius-md` (16px).
- **Eliminar `rounded-[2rem]`** de ProfileScreen → usar `--radius-xl`.

---

## 5. Elevación (Sombras)

### Análisis del ejemplo

El ejemplo usa **exactamente 3 niveles** de sombra + glass:

| Nivel | Valor | Dónde |
|-------|-------|-------|
| Cards | `shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)]` | CategoryCards, chat bubble |
| Nav float | `shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]` | BottomNav |
| CTA emergencia | `shadow-[0_20px_40px_-12px_rgba(1,67,137,0.4)]` | EmergencyCTA |
| Glass | `bg-white/90 backdrop-blur-xl` | BottomNav |
| Glass suave | `bg-white/80 backdrop-blur-md` | TopBar |
| Sutil | `shadow-sm` | Chat bubble |

### Decisión: Surface color shifts + sombra sutil + glass selectivo

**4 niveles de elevación:**

```css
:root {
  --elevation-0: none;
  --elevation-1: 0 8px 20px -6px rgba(0, 0, 0, 0.05);
  --elevation-2: 0 20px 50px -12px rgba(0, 0, 0, 0.15);
  --elevation-3: 0 20px 40px -12px rgba(1, 67, 137, 0.4);
}
```

**Glass solo en elementos fijos de navegación:**

```css
:root {
  --glass-nav:     rgba(255, 255, 255, 0.90);  /* BottomNav */
  --glass-header:  rgba(255, 255, 255, 0.80);  /* TopBar */
  --glass-blur:    20px;                         /* backdrop-blur */
  --glass-border:  rgba(255, 255, 255, 0.50);
}
```

### Mapeo por componente

| Componente | Elevación | Glass | Border |
|------------|----------|-------|--------|
| CategoryCard | `--elevation-1` | No | `border-transparent` → `hover:border-primary-action` |
| PhraseCard | `--elevation-1` | No | `border-transparent` → `hover:border-primary-action` |
| EmergencyCTA | `--elevation-3` | No | Sin border |
| BottomNav | `--elevation-2` | **Sí** (`--glass-nav`) | `--glass-border` |
| TopBar | — | **Sí** (`--glass-header`) | `border-b surface-container` |
| ProfileScreen cards | `--elevation-1` | No | `border-transparent` |
| Voice Bank card | `--elevation-2` | No | Sin border |

### Regla

- **Glass solo en BottomNav y TopBar.** Son los únicos elementos fixed que flotan sobre contenido scrolleable.
- **Cards usan sombra, no glass.** Glass reduce legibilidad — inaceptable en contexto clínico.
- **PhraseCard dot playing:** glow `shadow-[0_0_12px_rgba(59,130,246,0.6)]` es feedback de estado, no elevación. Mantener.
- **Background decorativo:** los círculos `blur-3xl` del ejemplo son ambient glow. **Eliminar de ProfileScreen** (ruido visual). Considerar para fondo de HomeScreen si se desea.

---

## 6. Feedback de Interacción

### Análisis del ejemplo

| Elemento | Feedback |
|----------|----------|
| Cards (categorías) | `active:scale-95` + `hover:border-primary-container` |
| BottomNav tab activo | `active:scale-90` |
| EmergencyCTA | `active:scale-95` |
| Icon containers | `group-hover:scale-110` |

### Tokens SSOT

```css
:root {
  --scale-press:    0.95;   /* Botones/cards estándar */
  --scale-press-sm: 0.90;   /* Nav tabs (area grande) */
  --scale-hover:    1.10;   /* Icon containers dentro de cards */

  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --ease-out:        cubic-bezier(0.25, 1, 0.5, 1);
}
```

### Regla

- **`active:scale-[var(--scale-press)]`** en todos los botones y cards.
- **`hover:border-primary-action`** en cards (el ejemplo usa border highlight, no bg change).
- **`group-hover:scale-[var(--scale-hover)]`** en icon containers dentro de cards.
- **`transition-all`** siempre con `var(--duration-normal)`.
- **Sin hover en BottomNav tab inactivo** — solo `transition-colors`.
- **`prefers-reduced-motion: reduce`** ya implementado. Mantener.

---

## 7. Layout y Estructura

### BottomNav

Del ejemplo:
```
fixed bottom-6 left-6 right-6 z-50
rounded-[2.5rem]                    → --radius-pill
shadow-[0_20px_50px_...]            → --elevation-2
bg-white/90 backdrop-blur-xl        → --glass-nav
border border-white/50              → --glass-border
justify-around items-center px-2 py-3
```

Tab activo:
```
bg-primary-container                → --color-primary-action
text-white rounded-[2rem]           → --radius-xl
shadow-lg shadow-primary-container/20
px-8 py-3
```

Tab inactivo:
```
text-outline-variant                → PROBLEMA: contraste ~2.2:1
hover:text-primary transition-colors
px-5 py-2
```

### Decisión BottomNav

| Propiedad | Token/valor | Nota |
|-----------|------------|------|
| Container bg | `--glass-nav` | `bg-white/90` |
| Container shadow | `--elevation-2` | `shadow-[var(--elevation-2)]` |
| Container radius | `--radius-pill` | 2.5rem |
| Tab activo bg | `--color-primary-action` | `#014389` |
| Tab activo radius | `--radius-xl` | 2rem |
| Tab inactivo text | `--color-text-secondary` | `#424751` (4.5:1+ contraste) |
| Tab label size | `--text-xs` min (12px) | Subir de `text-[9px]` a `text-xs` |
| Tab label weight | `--weight-black` (900) | uppercase |
| Container position | `fixed bottom-6 left-6 right-6` | Con safe-area |
| Tab padding activo | `px-8 py-3` | |
| Tab padding inactivo | `px-5 py-2` | |

### Cards (categoría/frase)

Del ejemplo:
```
bg-white
border-2 border-transparent hover:border-primary-container
rounded-3xl                         → --radius-lg
shadow-[0_8px_20px_...]             → --elevation-1
p-5
active:scale-95                     → --scale-press
```

### EmergencyCTA

Del ejemplo:
```
bg-[#014389]                        → --color-primary-action
rounded-3xl                         → --radius-lg
shadow-[0_20px_40px_...]            → --elevation-3
py-5 px-8
active:scale-95                     → --scale-press
text-white
```

---

## 8. Safe Areas

```css
:root {
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
}
```

- BottomNav: `bottom: calc(var(--safe-bottom, 24px) + 24px)` (24px base gap del ejemplo)
- TopBar: `padding-top: calc(var(--safe-top) + 16px)` si se agrega safe area
- Main content: `padding-bottom: calc(var(--safe-bottom) + 100px)` (nav height + gap)

---

## 9. Componentes: Contrato Visual

### CategoryCard

```
Elemento:    <button>
Fondo:       var(--color-card)
Borde:       border-2 border-transparent hover:border-[var(--color-primary-action)]
Sombra:      var(--elevation-1)
Radio:       var(--radius-lg)
Padding:     p-5
Press:       active:scale-[var(--scale-press)]
Transición:  transition-all duration-[var(--duration-normal)]

Icon container:
  Size:      w-14 h-14
  Radio:     var(--radius-md)
  Fondo:     cat-[id]-bg con opacity 40%
  Hover:     group-hover:scale-[var(--scale-hover)]

Título:      var(--text-lg), var(--weight-black), var(--color-text-heading)
Descripción: var(--text-sm), var(--weight-medium), var(--color-text-secondary)
```

### PhraseCard

```
Container:   <div>
Fondo:       var(--color-card)
Borde:       border-transparent (hereda de card)
Sombra:      var(--elevation-1)
Radio:       var(--radius-lg)
Min height:  80px

Play button:
  Padding:   p-4
  Feedback:  active:bg-[var(--color-surface)] transition-colors
  Dot:       w-6 h-6 rounded-full, wrapper min-w-[var(--touch-min)]
  Playing:   bg-primary-action scale-125 + glow shadow

Fav button:
  Border:    border-l var(--color-border)
  Size:      min-w-[var(--touch-min)] min-h-[var(--touch-min)]
  Feedback:  active:scale-[var(--scale-press)] active:bg-surface
  Icon:      lucide Star (eliminar SVG inline)
  Filled:    fill-yellow-400 text-yellow-400
```

### EmergencyCTA

```
Elemento:    <button>
Fondo:       var(--color-primary-action)
Texto:       var(--color-text-on-action)
Sombra:      var(--elevation-3)
Radio:       var(--radius-lg)
Padding:     py-5 px-8
Press:       active:scale-[var(--scale-press)]
Transición:  transition-all
Playing:     animate-pulse

Icon container:
  Size:      w-16 h-16
  Radio:     rounded-full
  Fondo:     bg-white/10 group-hover:bg-white/20

Título:      var(--text-2xl), var(--weight-black), tracking-tight
Subtítulo:   var(--text-xs), var(--weight-bold), tracking-widest uppercase, text-white/70
Icono:       lucide Bell (eliminar SVG inline)
```

### BottomNav

```
Container:   fixed bottom-6 left-6 right-6 z-50
Fondo:       var(--glass-nav) + backdrop-blur-xl
Sombra:      var(--elevation-2)
Radio:       var(--radius-pill)
Borde:       var(--glass-border)
Safe area:   bottom: calc(var(--safe-bottom, 24px) + 24px)

Tab activo:
  Fondo:     var(--color-primary-action)
  Texto:     var(--color-text-on-action)
  Radio:     var(--radius-xl)
  Sombra:    shadow-lg shadow-[color:var(--color-primary-action)/20]
  Padding:   px-8 py-3
  Press:     active:scale-[var(--scale-press-sm)]

Tab inactivo:
  Texto:     var(--color-text-secondary) [NO outline-variant]
  Hover:     hover:text-[var(--color-primary)]
  Padding:   px-5 py-2

Label (ambos):
  Size:      var(--text-xs) min [NO text-[9px]]
  Weight:    var(--weight-black)
  Transform: uppercase
```

### TopBar

```
Elemento:    <header> sticky top-0 z-10
Fondo:       var(--glass-header) + backdrop-blur-md
Borde:       border-b var(--color-border)
Padding:     px-6 py-4

Título:      var(--text-xl), var(--weight-bold), var(--color-text-heading)
Botón back:  p-2 rounded-full, hover:bg-surface
```

---

## 10. Anti-patrones (reglas negativas)

Basado en `design-principles` y el análisis del ejemplo:

1. **Sin glass en cards** — solo BottomNav y TopBar
2. **Sin gradientes decorativos** en componentes de paciente — eliminar blur circles de ProfileScreen
3. **Sin `rounded-[custom]`** — solo valores de la escala `--radius-*`
4. **Sin `text-outline-variant`** para texto funcional — contraste insuficiente
5. **Sin `text-[9px]`** — mínimo `text-xs` (12px)
6. **Sin SVGs inline** — solo lucide-react imports
7. **Sin Tailwind shadows default** (`shadow-sm`, `shadow-md`, `shadow-lg`) — solo `--elevation-*` tokens
8. **Sin colores Material no usados** en `tailwind.config.js` — limpiar 37 tokens legacy
9. **Sin strings de clases en `seed.ts`** — refactorizar a IDs que lookup tokens CSS
10. **Sin hover como único feedback** — siempre `active:` para touch

---

## 11. Migración: Estado Actual → SSOT

### Tokens que ya existen y se mantienen

| Token actual | Renombrar a | Cambio |
|-------------|-------------|--------|
| `--surface-0` | `--color-surface` | Rename |
| `--surface-1` | `--color-card` | Rename |
| `--safe-top/bottom` | `--safe-top/bottom` | Sin cambio |
| `--elevation-0..3` | `--elevation-0..3` | **Reemplazar valores** por los del ejemplo |

### Tokens que se agregan

| Token | Nuevo |
|-------|-------|
| `--color-primary-action` | `#014389` |
| `--color-primary-light` | `#aac7ff` |
| `--color-text-heading` | `#191c1d` |
| `--color-text-secondary` | `#424751` |
| `--color-glass-*` | Glass system |
| `--radius-*` (6 niveles) | Shape system |
| `--space-*` (10 niveles) | Spacing system |
| `--scale-press/sm` | Interaction system |
| `--duration-*`, `--ease-*` | Motion system |
| `--cat-*` (9 categorías) | Category colors |

### Tokens que se eliminan

| Token | Razón |
|-------|-------|
| `--surface-2` | No hay 3 niveles de superficie |
| `--text-primary` (conflicto con `primary`) | Reemplazar por `--color-text-heading` |
| `--text-secondary` | Reemplazar por `--color-text-secondary` |
| `--text-tertiary` | Reemplazar por `--color-text-muted` |
| `--text-muted` | Reemplazar por `--color-text-muted` |
| `--border-default/subtle/strong` | Reemplazar por `--color-border` |
| 37 colores Material en `tailwind.config.js` | Sin uso |

---

## 12. Plan de Ejecución

### Fase 1: Definir tokens (solo `index.css` + `tailwind.config.js`)

- Reescribir `:root` con nomenclatura SSOT
- Eliminar 37 colores Material de config
- Limpiar config a solo referencias a CSS vars

**Estimación**: LOW — 2 archivos

### Fase 2: Conectar componentes (archivo por archivo)

Orden: BottomNav → EmergencyCTA → CategoryCard → PhraseCard → TopBar → ProfileScreen → FreeTextScreen → App shell

Cada archivo:
1. Reemplazar clases hardcoded por `var(--token)`
2. Reemplazar SVGs inline por lucide-react
3. Eliminar shadows Tailwind default por elevation tokens
4. Unificar radius a escala `--radius-*`

**Estimación**: MEDIUM — ~11 archivos

### Fase 3: Refactorizar seed.ts

- Separar `color: string` en campos semánticos
- CategoryCard lookup desde tokens CSS

**Estimación**: MEDIUM — 2 archivos

---

## Verificación

Cada fase se valida con:

1. `npm run lint` — 0 errors, 0 warnings
2. `npm run build` — clean
3. `npx vitest run` — 116/116 pass
4. Visual diff contra `stich_examples/example_1.html` — coherencia visual
5. QA checklist `typeui-clean` — todos los items pass

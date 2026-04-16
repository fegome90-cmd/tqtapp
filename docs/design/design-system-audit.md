# TQT App — Informe de Fragmentación de Design System

> Actualizado: 2026-04-15
> Anterior: 2026-04-14 (corregido contra estado real del código)

## Resumen Ejecutivo

TQT App tiene **4 fuentes de verdad fragmentadas** que se contradicen entre sí. Ninguna es autoritativa.

| Métrica | Valor |
|---------|-------|
| Fuentes de verdad activas | 4 |
| Colores definidos en config, nunca usados | 37 de 42 (88%) |
| Colores CSS vars no consumidos por componentes | 5 de 13 (38%) |
| Sistemas de sombras coexistiendo | 4 distintos |
| Variantes de border-radius | 5 distintas |
| Variantes de active:scale | 3 distintas |
| "Grises" de texto distintos | 9 (`slate-200` a `slate-900`) |
| Componentes auditados | 11 pantallas/componentes |

---

## 1. Las 4 Fuentes de Verdad

### Fuente A: `tailwind.config.js` — Material Design Tokens (LEGACY)

Define 42 colores con nomenclatura Material Design 3. **37 de 42 (88%) nunca se usan**.

También define `borderRadius` custom que **ningún componente consume**:
```js
borderRadius: {
  DEFAULT: '1.5rem',   // Nunca usado — componentes usan rounded-2xl, rounded-3xl
  lg: '2.5rem',
  xl: '4rem',
}
```

### Fuente B: `src/index.css` `:root` — Custom Properties

Define 20+ CSS variables agrupadas en:

| Grupo | Vars | ¿Consumidas? |
|-------|------|-------------|
| Surfaces | `--surface-0/1/2` | **No** — componentes usan `bg-slate-50`, `bg-white` |
| Borders | `--border-default/subtle/strong` | **No** — componentes usan `border-slate-200/60` etc |
| Text | `--text-primary/secondary/tertiary/muted` | **No** — componentes usan `text-slate-800/600/400/300` |
| Safe areas | `--safe-top/bottom` | **Sí** — BottomNav via style prop |
| Elevation | `--elevation-0/1/2/3` | **Parcial** — elevation-2 y 3 usadas, elevation-0 y 1 sin consumidor |

**Conflicto de nombres**: `--text-primary` (#1e293b = slate-800) vs `primary` en config (#002d60 = azul oscuro). Dos cosas distintas con el mismo nombre conceptual.

### Fuente C: `src/data/seed.ts` — Colores de Categoría

Define colores como string de clases Tailwind concatenadas:

```ts
color: 'bg-red-50 text-red-600 border-red-200'
```

Se inyecta como `colorClasses` prop en `CategoryCard`. HomeScreen ya usa `cat.color` directamente (corregido desde informe anterior). El string se aplica 2 veces en el mismo elemento (root + icon wrapper) — funciona por especificidad Tailwind pero es confuso.

### Fuente D: Hardcode en Componentes — La Mayoritaria

La mayoría de los componentes definen sus valores inline. **Ningún valor de surface/text/border viene de un token centralizado.**

| Componente | Fondo | Texto | Border | Radio | Sombra |
|------------|-------|-------|--------|-------|--------|
| TopBar | `bg-white/95` | `text-slate-900` | `border-slate-200/60` | — | — |
| BottomNav | `bg-white/90` | `text-outline-variant` | `border-white/50` | `rounded-2xl` | `shadow-[var(--elevation-2)]` |
| CategoryCard | `bg-white` | `text-slate-800` | implícito en colorClasses | `rounded-2xl` | — |
| PhraseCard | `bg-white` | `text-slate-800` | `border-slate-200/60` | `rounded-2xl` | — |
| EmergencyCTA | `bg-primary-container` | `text-white` | — | `rounded-3xl` | `shadow-[var(--elevation-3)]` |
| FreeText textarea | `bg-transparent` | `text-slate-800` | — | `rounded-3xl` | — |
| FreeText button | `bg-slate-900` | `text-white` | — | `rounded-3xl` | — |
| ProfileScreen card | `bg-white` | `text-slate-800` | `border-slate-100` | `rounded-[2rem]` | — |
| Voice Bank card | `bg-gradient-to-br from-blue-600 to-indigo-800` | `text-white` | — | `rounded-[2rem]` | `shadow-md` |
| PreopVoiceBank button | `bg-slate-900` | `text-white` | — | `rounded-2xl` | — |
| Error banner | `bg-red-50` | `text-red-700` | `border-red-200` | `rounded-xl` | — |

---

## 2. Inconsistencias por Dimensión

### 2.1 Colores de Superficie (Backgrounds)

| Uso | Valor | Debería ser token? |
|-----|-------|-------------------|
| Fondo app | `bg-slate-50` | `--surface-0` (ya definido, no consumido) |
| Card blanco | `bg-white` | `--surface-1` (ya definido, no consumido) |
| Fondo secciones | `bg-slate-50` | `--surface-2` (ya definido, no consumido) |
| Botón primario | `bg-slate-900` | No definido como token |
| Botón CTA | `bg-primary-container` | Definido en config |
| BottomNav glass | `bg-white/90` | Caso especial (glass) |
| Voice Bank gradiente | `bg-gradient-to-br from-blue-600 to-indigo-800` | No definido |

**9 valores distintos para "fondo de elemento"**, sin tokens que los unifiquen.

### 2.2 Colores de Texto

9 niveles de gris distintos:

| Tailwind class | Hex | Contraste sobre blanco | Uso | WCAG |
|---------------|-----|----------------------|-----|------|
| `text-slate-900` | #0f172a | 18.4:1 | TopBar título | AAA |
| `text-slate-800` | #1e293b | 12.7:1 | Card títulos, frases | AAA |
| `text-slate-700` | #334155 | 8.5:1 | Texto de lista | AAA |
| `text-slate-600` | #475569 | 5.6:1 | Texto secundario | AA |
| `text-slate-500` | #64748b | 4.0:1 | Subtítulos, labels sección | ⚠️ AA solo texto grande |
| `text-slate-400` | #94a3b8 | 2.9:1 | Empty states | ❌ No cumple AA |
| `text-slate-300` | #cbd5e1 | 1.9:1 | Placeholder, dot off | ❌ Decorativo |
| `text-outline-variant` | #c3c6d2 | ~2.2:1 | BottomNav inactivo | ❌ No cumple AA |
| `text-white` | #fff | N/A | Sobre fondos oscuros | OK |

### 2.3 Border Radius

| Valor | px | Dónde |
|-------|-----|-------|
| `rounded-xl` | 12px | BottomNav tab activo, Error banner |
| `rounded-2xl` | 16px | Cards, BottomNav container |
| `rounded-3xl` | 24px | EmergencyCTA, FreeText buttons |
| `rounded-full` | 9999px | Avatares, chips, toggle |
| `rounded-[2rem]` | 32px | ProfileScreen (2 lugares) |

5 valores sin escala definida.

### 2.4 Elevación (Sombras)

| Sistema | Valor | Dónde | Token? |
|---------|-------|-------|--------|
| CSS var | `shadow-[var(--elevation-2)]` | BottomNav | **Sí** |
| CSS var | `shadow-[var(--elevation-3)]` | EmergencyCTA | **Sí** |
| CSS var | `--elevation-1` | **Ningún componente** | Definido, sin uso |
| Tailwind | `shadow-sm` | ProfileScreen toggle, Voice Bank badge/button | No |
| Tailwind | `shadow-md` | Voice Bank card | No |
| Tailwind | `shadow-2xl` | App shell (desktop) | No |
| Tailwind | `shadow-lg` + colored | BottomNav tab activo | No |
| Inline | `shadow-[0_0_12px_rgba(59,130,246,0.6)]` | PhraseCard dot playing | No (glow) |

**7 fuentes de sombra.** Solo 2 usan tokens.

### 2.5 Feedback de Toque (active:scale)

| Valor | Dónde |
|-------|-------|
| `active:scale-95` | BottomNav tab activo |
| `active:scale-[0.95]` | PhraseCard favorito |
| `active:scale-[0.98]` | CategoryCard, EmergencyCTA, FreeText button, Voice Bank button |

3 valores sin token. Sin regla documentada de cuándo usar cuál.

### 2.6 Tipografía

14 combinaciones size×weight sin escala definida (ver informe principal §2).

---

## 3. Conflicto Central

**No hay mecanismo para que un cambio se propague.**

Ejemplo: cambiar el gris de texto secundario de `slate-500` a `slate-600` requiere tocar 5 archivos. `index.css` ya tiene `--text-secondary: #475569` (slate-600) pero ningún componente lo consume.

---

## 4. Diagnóstico

### Causas Raíz

1. **Config Material generado automáticamente** — 37 de 42 colores nunca adoptados.
2. **CSS vars como documentación, no como fuente operativa** — definidas pero no consumidas (excepto safe-area y elevation parcial).
3. **Cada componente diseñado de forma aislada** — sin design system previo.
4. **seed.ts usa strings de clases** — acopla datos al framework CSS.

### Correcciones desde informe anterior

| Lo que decía el informe | Estado real |
|------------------------|-------------|
| "CategoryCard tiene ~10 SVGs inline" | **Falso** — usa `lucide-react` imports |
| "PhraseCard dot `w-3 h-3`" | **Corregido** → `w-6 h-6` con wrapper `min-w-12` |
| "PhraseCard sin aria-labels" | **Corregido** → aria-labels dinámicos |
| "Sombras todas hardcoded" | **Parcial** → BottomNav y EmergencyCTA usan tokens |
| "`motion` instalada sin usar" | **Eliminada** del package.json |
| "`useCustomPhrases` hook sin usar" | **Eliminado** |
| "`h-screen` en App shell" | **Corregido** → `min-h-dvh` |
| "Sin PWA" | **Implementado** → manifest + SW + offline + iOS meta |

---

## 5. Propuesta: Fuente de Verdad Única

### Principio

> **Un token se define en exactamente un lugar. Los componentes consumen el token, nunca el valor crudo.**

### Arquitectura Propuesta

```
src/index.css (:root)
  ├── Color tokens
  │   ├── --color-primary / --color-primary-container / --color-on-primary
  │   ├── --color-surface-0 / --color-surface-1 / --color-surface-2
  │   ├── --color-text-primary / --color-text-secondary / --color-text-tertiary
  │   ├── --color-border-default / --color-border-subtle
  │   └── --color-cat-{urgente|dolor|...} (9 categorías)
  │
  ├── Typography tokens
  │   ├── --font-size-h1 / h2 / h3 / body / sm / xs
  │   └── --font-weight-bold / semibold / medium / regular
  │
  ├── Spacing tokens
  │   ├── --space-xs / sm / md / lg / xl
  │   └── --touch-min / --touch-medical
  │
  ├── Shape tokens
  │   └── --radius-sm / md / lg / xl / full
  │
  ├── Elevation tokens (ya definido)
  │   └── --elevation-0 / 1 / 2 / 3
  │
  └── Motion tokens
      └── --scale-press-sm / --scale-press-lg

tailwind.config.js
  └── Eliminar 37 colores Material sin uso
      Mantener solo los 5 usados como referencia a CSS vars

seed.ts
  └── color: cat.id (referencia, no string de clases)
      → CategoryCard lookup desde tokens CSS

Componentes
  └── Solo usan clases que referencian tokens (nunca hardcoded)
```

### Plan de Implementación

#### Fase 1: Consolidar tokens en `index.css` (solo definición)

- Eliminar 37 colores Material no usados de `tailwind.config.js`
- Mover 5 colores Material usados a CSS vars con nombre semántico
- Definir escala tipográfica, radius, y scale-press como vars

**Estimación**: LOW — 2 archivos

#### Fase 2: Conectar componentes a tokens

- `text-slate-800` → `text-[var(--color-text-primary)]`
- `bg-white` → `bg-[var(--color-surface-1)]`
- `rounded-2xl` → `rounded-[var(--radius-md)]`
- `active:scale-[0.98]` → `active:scale-[var(--scale-press-lg)]`
- `shadow-sm` → `shadow-[var(--elevation-1)]`

**Estimación**: MEDIUM — ~11 archivos, ~80 reemplazos

#### Fase 3: Refactorizar seed.ts color system

- Separar string `color` en campo semántico (`colorHue: 'red'`)
- CategoryCard construye clases desde token

**Estimación**: MEDIUM — 2 archivos

---

## 6. Decisión Requerida

1. **Nomenclatura**: Material (`on-primary`) o semántica (`accent`, `surface`)? Recomendación: semántica.
2. **Cards con elevación o border-only?** `--elevation-1` ya está definido pero sin consumidor. Decidir si CategoryCard y PhraseCard reciben sombra o se quedan con border.
3. **Prioridad vs P1 restante**: No bloquea, pero cada regla sobre valores hardcoded agrega superficie a migrar.

---

## Anexo: Inventario Completo

### Colores Material en config vs Uso Real

| Color en config | Hex | Usado? | Dónde |
|----------------|-----|--------|-------|
| `primary` | #002d60 | Sí | BottomNav hover, focus-visible |
| `primary-container` | #014389 | Sí | BottomNav activo, EmergencyCTA, PhraseCard dot |
| `error` | #ba1a1a | Sí | App.tsx error banner (via `bg-red-50` etc, indirecto) |
| `outline-variant` | #c3c6d2 | Sí | BottomNav inactivo (**contraste insuficiente**) |
| `on-primary-container` | #87b2ff | No | — |
| *+ 37 más* | — | No | — |

### Sombra Inventory por Componente

| Componente | Shadow actual | Token propuesto |
|------------|-------------|----------------|
| App shell | `shadow-2xl` | `--elevation-2` (desktop only) |
| BottomNav | `shadow-[var(--elevation-2)]` | Ya usa token |
| BottomNav tab activo | `shadow-lg shadow-primary-container/20` | Migrar a token |
| EmergencyCTA | `shadow-[var(--elevation-3)]` | Ya usa token |
| PhraseCard playing dot | `shadow-[0_0_12px_rgba(59,130,246,0.6)]` | Glow (mantener) |
| Voice Bank card | `shadow-md` | `--elevation-2` |
| Voice Bank badge | `shadow-sm` | `--elevation-1` |
| Voice Bank button | `shadow-sm` | `--elevation-1` |
| Profile toggle | `shadow-sm` | `--elevation-1` |
| CategoryCard | border only (sin shadow) | `--elevation-1` o mantener border |
| PhraseCard | border only (sin shadow) | `--elevation-1` o mantener border |

### SVGs Inline Restantes

| Componente | SVG inline | Import lucide equivalente |
|------------|-----------|--------------------------|
| PhraseCard | `StarIcon` (~16 líneas) | `Star` from `lucide-react` |
| EmergencyCTA | `NotificationsActiveIcon` (~16 líneas) | `Bell` from `lucide-react` |

CategoryCard ya fue migrada a lucide (corregido desde informe anterior).

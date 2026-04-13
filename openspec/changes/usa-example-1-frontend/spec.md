# Spec: usa-example-1-frontend

## 1. Visual Design System

### 1.1 Color Palette

**Primary (Material Tokens)**
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#002d60` | Headers, primary buttons, active states |
| `primary-container` | `#014389` | Active tab background, button fills |
| `primary-fixed` | `#d6e3ff` | Card accents, hover states |
| `on-primary` | `#ffffff` | Text on primary |

**Secondary**
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#bc000c` | Emergency button background (example_1 uses `#014389` as main CTA) |
| `error` | `#ba1a1a` | Error states |
| `on-error` | `#ffffff` | Text on error |

**Surface**
| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#f8f9fa` | Main background |
| `surface-container` | `#edeeef` | Card backgrounds |
| `on-surface` | `#191c1d` | Primary text |
| `on-surface-variant` | `#424751` | Secondary text |
| `outline-variant` | `#c3c6d2` | Borders |

### 1.2 Typography

- **Font Family**: Nunito (Google Fonts)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold), 800 (extra-bold), 900 (black)
- **Sizes**:
  - Headlines: `text-2xl` (24px), `text-lg` (18px)
  - Body: `text-xl` (20px), `text-base` (16px)
  - Labels: `text-sm` (14px), `text-xs` (12px)

### 1.3 Component Patterns

**Header**
- Sticky top, `bg-white/80 backdrop-blur-md`
- Avatar (40x40, rounded-full with `border-primary-fixed`)
- Branding: label + title (uppercase label, black title)

**Cards**
- `bg-white`, `rounded-3xl`, `border-surface-container`
- Shadow: `shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)]`
- Vertical layout (icon + title + description)

**Buttons**
- Category cards: horizontal flex, icon left, text right
- Emergency CTA: full-width, `bg-[#014389]`, `rounded-3xl`

**Bottom Navigation**
- 4 tabs: Inicio, Hablar, Bitácora (Favoritos), Perfil
- Active: `bg-primary-container text-white`
- Inactive: `text-outline-variant`

---

## 2. TTS Agnostic Architecture

### 2.1 Interface: TTSPort

The system MUST provide a vendor-agnostic TTS abstraction:

```typescript
// src/lib/tts/ports/TTSPort.ts
export interface TTSPort {
  speak(text: string): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
}

export interface TTSConfig {
  provider: 'mock' | 'gemini' | 'local-llm' | 'web-speech';
  voiceId?: string;
  rate?: number;
  pitch?: number;
}

export interface TTSProvider {
  initialize(config: TTSConfig): Promise<void>;
  getPort(): TTSPort;
}
```

### 2.2 Providers

| Provider | Status | Description |
|----------|--------|-------------|
| MockTTSProvider | Required | Development, returns Promise after delay |
| GeminiTTSProvider | Future | Google Gemini TTS API |
| LocalLLMProvider | Future | Ollama + local model |
| WebSpeechProvider | Future | Web Speech API fallback |

### 2.3 Mock Implementation

```typescript
// src/lib/tts/adapters/MockTTSProvider.ts
export class MockTTSProvider implements TTSProvider {
  async initialize(_config: TTSConfig): Promise<void> {
    // No-op for mock
  }
  
  getPort(): TTSPort {
    return {
      async speak(text: string): Promise<void> {
        console.log(`[MockTTS]speaking: ${text}`);
        await delay(1200);
      },
      stop(): void {},
      isSpeaking(): boolean { return false; },
    };
  }
}
```

---

## 3. Component Structure

### 3.1 File Organization

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Branding + avatar
│   │   ├── BottomNav.tsx   # 4-tab navigation
│   │   └── TopBar.tsx       # Dynamic title + back button
│   ├── cards/
│   │   ├── CategoryCard.tsx
│   │   ├── PhraseCard.tsx
│   │   └── EmergencyCTA.tsx
│   └── inputs/
│       ├── FreeTextInput.tsx
│       └── Predictions.tsx
├── lib/tts/
│   ├── ports/TTSPort.ts
│   ├── providers/
│   │   ├── MockTTSProvider.ts
│   │   ├── GeminiTTSProvider.ts
│   │   └── index.ts
├── data/
│   └── mock.ts
├── types/
│   └── index.ts
└── App.tsx
```

### 3.2 Component Boundaries

- **Layout components**: Header, TopBar, BottomNav — handle shell, persist across tabs
- **Card components**: CategoryCard, PhraseCard — pure presentational, accept props
- **PhraseList components**: PhraseListByCategory, PhraseListFavorites — handle filtering
- **TTS is an injectable dependency** — passed via React context or hook

### 3.3 Split Trigger

IF App.tsx exceeds 600 lines, the following SHOULD be extracted:
- TopBar component (already defined locally)
- Each tab's main view into separate file
- Type definitions to `src/types/`

---

## 4. Data Model

### 4.1 Category Type

```typescript
// src/types/index.ts
export type CategoryId = 
  | 'pain'
  | 'company'
  | 'needs'
  | 'mobility'
  | 'hunger'
  | 'thirst'
  | 'comfort'
  | 'breathing';

export interface Category {
  id: CategoryId;
  title: string;
  description: string;  // NEW: for display under title
  icon: string;       // Lucide icon name
  color: string;     // Tailwind color class
}
```

### 4.2 Phrase Type (Existing)

```typescript
export interface Phrase {
  id: string;
  text: string;
  categoryId: CategoryId;
  // future: audioUrl?, customVoiceId?
}
```

### 4.3 Category Data (Mock)

```typescript
// src/data/mock.ts
export const CATEGORIES: Category[] = [
  {
    id: 'pain',
    title: 'Me Duele Algo',
    description: 'Necesito alivio para un malestar',
    icon: 'Heart',  // Lucide icon name
    color: 'bg-error-container/40 text-error',
  },
  // ... rest of categories
];
```

---

## 6. Accessibility Requirements (Web Interface Guidelines)

Based on Web Interface Guidelines review, the following MUST be implemented:

### 6.1 Transitions & Animation

- **NEVER** use `transition: all` — list properties explicitly (e.g., `transition-colors`, `transition-transform`)
- Add `prefers-reduced-motion` consideration for animations (reduce or disable for users who prefer it)

### 6.2 Buttons & Interactive Elements

- **Icon-only buttons** MUST have `aria-label` (e.g., Volume2 in header, bottom nav icons)
- **Bottom navigation** needs `aria-label="Navegación principal"` or `role="navigation"`
- All `<button>` elements need explicit `type="button"` (already present)
- Interactive elements need visible **focus states**: use `focus-visible:ring-*` or equivalent

### 6.3 Icon Accessibility

- **Decorative icons** (non-interactive) MUST have `aria-hidden="true"`
- This includes: ChevronLeft (back button), Star (favorites), Volume2 (header)

### 6.4 Forms & Inputs

- Textarea placeholder should end with `…` (ellipsis) not `...`
- Example: `"Toca para escribir..."` → `"Toca para escribir…"`

### 6.5 Keyboard Navigation

- Interactive elements SHOULD have keyboard handlers (`onKeyDown`/`onKeyUp`) for Enter/Space
- Use `:focus-visible` over `:focus` to avoid focus ring on click

### 6.6 Touch & Interaction

- Add `touch-action: manipulation` to prevent double-tap zoom delay
- Consider `-webkit-tap-highlight-color` for custom tap feedback

---

## 7. Requirements Summary

| Domain | Type | Changes |
|--------|------|---------|
| Visual Design | ADDED | Material tokens from example_1.html |
| TTS Architecture | ADDED | TTSPort interface + providers |
| Component Structure | ADDED | File organization pattern |
| Data Model | MODIFIED | Category adds `description` field |
| Accessibility | ADDED | Web Interface Guidelines compliance |
| Code Quality | MODIFIED | Extract if >600 lines |

---

## 8. Scenarios

### Visual Design

- GIVEN app loads with Tailwind
- WHEN header renders
- THEN shows Material-style branding with Nunito font
- AND uses colors `#002d60`, `#014389`

- GIVEN user taps category card
- THEN displays vertical card with icon + title + description
- AND uses rounded-3xl, shadow from design system

- GIVEN user taps emergency button
- THEN shows blue CTA (`#014389`) with icon + label
- AND displays "Enfermería te responderá pronto"

### TTS Architecture

- GIVEN app initializes
- WHEN TTS port is injected
- THEN MockTTSProvider is default
- AND speak() returns Promise after ~1200ms

- GIVEN MockTTSProvider is active
- WHEN isSpeaking() is called
- THEN returns false after promise resolves
- AND no actual audio plays

### Component Extraction

- GIVEN App.tsx line count > 600
- WHEN developer runs build
- THEN SHOULD extract views to separate files
- AND maintain 4-tab navigation

### Data Model

- GIVEN Category rendered in list
- WHEN displaying title + description
- THEN shows: title in `font-black text-lg`
- AND description in `text-sm text-on-surface-variant`

---

## Next Step

Ready for design (sdd-design).
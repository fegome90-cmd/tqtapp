# Design: usa-example-1-frontend

## Technical Approach

Rediseñar el frontend existente de React para adoptar el sistema visual Material del ejemplo, implementar abstracción TTS agnóstica, reorganizar componentes, y añadir campo description a Category. El enfoque prioriza migración incremental manteniendo la navegación de 4 tabs.

---

## Architecture Decisions

### Decision: Color Token Strategy

**Choice**: Extender Tailwind config con tokens Material desde example_1.html  
**Alternatives considered**: CSS variables, theme provider de Tailwind  
**Rationale**: Tailwind 4 soporta `theme.extend` directamente en config. Los tokens `#002d60`, `#014389` del ejemplo se traducen a clases utilitarias predefinidas para consistencia.

### Decision: TTS Provider Pattern

**Choice**: Interfaz TTSPort con providers inyectables (Mock default)  
**Alternatives considered**: Direct Web Speech API, singleton global  
**Rationale**: Permite cambiar provider sin modificar componentes. Simula la arquitectura real (Gemini/LocalLLM) sin acoplamiento. Provider se selecciona via React Context.

### Decision: Component Extraction Threshold

**Choice**: Extraer componentes cuando App.tsx exceda 600 líneas  
**Alternatives considered**: Extraer inmediatamente, mantener todo en App.tsx  
**Rationale**: El archivo actual tiene 447 líneas. Con la migración visual + TTS + accesibilidad, estimación cruza ~600. Extraer preventivamente cuando alcance el umbral.

### Decision: Category Description

**Choice**: Añadir campo `description: string` a tipo Category  
**Alternatives considered**: derive from title, separate metadata file  
**Rationale**: El ejemplo muestra título + descripción en cada card (ej: "Me Duele Algo" / "Necesito alivio para un malestar"). Campo directo en tipo mantiene consistencia con mock data.

---

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Tab State │  │ TTS Hook │  │ Component Render │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
│         │            │                   │                │
│         └────────────┴───────────────────┘            │
│                      │                                │
│                      ▼                                │
│         ┌────────────────────────┐                   │
│         │   TTSContext (React)    │                   │
│         │   provides: speak()     │                   │
│         └────────────────────────┘                   │
│                      │                                │
│            ┌─────────┴─────────┐                     │
│            ▼                  ▼                     │
│   ┌──────────────┐   ┌─────────────┐                │
│   │MockTTSProvider│   │FutureProv.. │                │
│   └──────────────┘   └─────────────┘                │
└────────��────────────────────────────────────────────┘
```

**Flujo por tab**:
1. `currentTab` cambia → renderizado condicional en App.tsx
2. Usuario toca categoría → `activeCategory` se setea
3. Usuario toca frase → `useTTS().speak(phrase.text)` → provider retorna Promise

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `tailwind.config.js` | Modify | Añadir tokens Material (colors, borderRadius, fontFamily) |
| `index.html` | Modify | Añadir Google Fonts Nunito + Material Symbols |
| `src/index.css` | Modify | Estilos de componentes (chat-bubble, material-symbols) |
| `src/types/index.ts` | Modify | Category añade campo `description` |
| `src/lib/tts/ports/TTSPort.ts` | Create | Interfaz TTSPort, TTSConfig, TTSProvider |
| `src/lib/tts/providers/MockTTSProvider.ts` | Create | Implementación mock con delay |
| `src/lib/tts/providers/index.ts` | Create | Export de providers |
| `src/lib/tts/TTSContext.tsx` | Create | React context para inyección |
| `src/components/layout/Header.tsx` | Create | Header con branding + avatar |
| `src/components/layout/BottomNav.tsx` | Create | Navegación 4 tabs |
| `src/components/layout/TopBar.tsx` | Create | TopBar con back button |
| `src/components/cards/CategoryCard.tsx` | Create | Card de categoría |
| `src/components/cards/PhraseCard.tsx` | Create | Card de frase individual |
| `src/components/cards/EmergencyCTA.tsx` | Create | Botón emergencia |
| `src/App.tsx` | Modify | Usar nuevos componentes + TTS + accesibilidad |
| `src/data/mock.ts` | Modify | Categories con description |

---

## Interfaces / Contracts

### TTSPort Interface

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

### TTS Context

```typescript
// src/lib/tts/TTSContext.tsx
import { createContext, useContext } from 'react';
import type { TTSPort } from './ports/TTSPort';

interface TTSContextValue {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
}

const TTSContext = createContext<TTSContextValue | null>(null);

export function TTSProvider({ children }: { children: React.ReactNode }) {
  const speak = async (text: string) => {
    // usa MockTTSProvider.getPort().speak(text)
  };
  // ... provide context
}
```

### Category Type

```typescript
// src/types/index.ts
export interface Category {
  id: CategoryId;
  title: string;
  description: string;  // NEW:shown under title in cards
  icon: string;
  color: string;
}
```

---

## Accessibility Implementation

### Focus Visible

```css
/* src/index.css */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Interaction

```css
button {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

### ARIA Requirements

| Element | Attribute | Value |
|---------|-----------|-------|
| Icon-only buttons | `aria-label` | "Volver", "Notificaciones" |
| Bottom nav | `aria-label` | "Navegación principal" |
| Decorative icons | `aria-hidden` | "true" |
| Links (bottom nav) | `role` | "navigation" |

---

## Migration Path (Step-by-Step)

1. **Fase 1: Fundamentos visuales**
   - Añadir Nunito font a index.html
   - Configurar tailwind.config.js con tokens Material
   - Actualizar index.css con clases utilitarias

2. **Fase 2: Tipos y datos**
   - Añadir `description` a Category type
   - Actualizar mock.ts con descriptions

3. **Fase 3: Componentes layout**
   - Crear Header.tsx, BottomNav.tsx, TopBar.tsx
   - Refactorizar App.tsx para usar nuevos layout components

4. **Fase 4: Componentes cards**
   - Crear CategoryCard.tsx, PhraseCard.tsx, EmergencyCTA.tsx
   - Migrar UI de categorías y frases

5. **Fase 5: TTS Architecture**
   - Crear TTSPort.ts, MockTTSProvider.ts
   - Implementar TTSContext
   - Conectar uso en App.tsx

6. **Fase 6: Accessibility**
   - Añadir focus-visible, reduced-motion, touch-action a CSS
   - Añadir aria-labels aicon-only buttons
   - Marcar decorative icons con aria-hidden

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | TTSPort speak() resolves | Render test con jest |
| Unit | Category type description | Type check |
| Integration | Tab navigation flows | cypress/ Playwright |
| Integration | TTSContext injection | React Testing Library |
| E2E | Full user flow Home→Category→Play | agent-browser smoke |

---

## Open Questions

- [ ] ¿El mock de TTS debe loguear a console o tener UI de feedback?
- [ ] ¿Se mantiene el avatar hardcodeado o viene de datos paciente?
- [ ] ¿El font Material Symbols es necesario si usamos Lucide?

---

## Next Step

Ready for tasks (sdd-tasks).
# Tasks: usa-example-1-frontend

## Phase 1: Foundation (Visual Design System)

- [x] 1.1 Añadir Nunito font y Material Symbols a index.html desde example_1.html (líneas 5-8)
- [x] 1.2 Crear tailwind.config.js con tokens Material colors, borderRadius, fontFamily (ej: primary: #002d60)
- [x] 1.3 Añadir clases utilitarias a index.css: .chat-bubble-*, .material-symbols-outlined, .filled-icon (líneas 79-96 example_1)
- [x] 1.4 Configurar CSS global: body min-height, font-family Nunito

## Phase 2: Types & Data Model

- [x] 2.1 Añadir campo description: string a Category en src/types/index.ts
- [x] 2.2 Actualizar src/data/mock.ts con descriptions para cada categoría (ej: "Me Duele Algo" / "Necesito alivio para un malestar")
- [x] 2.3 Crear src/data/mock.ts nuevo con estructura de datos que coincida con spec

## Phase 3: Layout Components

- [x] 3.1 Crear src/components/layout/Header.tsx con branding, avatar, notificaciones (ej: lines 104-119 example_1)
- [x] 3.2 Crear src/components/layout/BottomNav.tsx con 4 tabs: Inicio, Hablar, Bitácora, Perfil (ej: lines 176-189 example_1)
- [x] 3.3 Crear src/components/layout/TopBar.tsx con back button y título dinámico
- [x] 3.4 Añadir aria-labels requeridos: BottomNav="Navegación principal", icon buttons con labels

## Phase 4: Card Components

- [x] 4.1 Crear src/components/cards/CategoryCard.tsx con estructura: icon + title + description, rounded-3xl
- [x] 4.2 Crear src/components/cards/PhraseCard.tsx para frases individuales con play button y star fav
- [x] 4.3 Crear src/components/cards/EmergencyCTA.tsx con estilo #014389, rounded-3xl, shadow

## Phase 5: TTS Architecture

- [x] 5.1 Crear src/lib/tts/ports/TTSPort.ts con interfaces TTSPort, TTSConfig, TTSProvider
- [x] 5.2 Crear src/lib/tts/providers/MockTTSProvider.ts con delay(1200), speak/stop/isSpeaking
- [x] 5.3 Crear src/lib/tts/providers/index.ts exports
- [x] 5.4 Crear src/lib/tts/TTSContext.tsx con React context.provider

## Phase 6: Integration (App.tsx Refactor)

- [ ] 6.1 Refactorizar App.tsx para usar nuevos componentes layout (Header, TopBar, BottomNav) — NO INTEGRADO (incompatibilidad visual)
- [x] 6.2 Reemplazar UI de categorías con CategoryCard
- [x] 6.3 Reemplazar UI de frases con PhraseCard
- [x] 6.4 Usar EmergencyCTA para botón urgencia
- [x] 6.5 Conectar useTTS hook en handlePlay para frases
- [x] 6.6 VERIFICAR: App.tsx línea count > 600? Si sí, extraer vistas a archivos

## Phase 7: Accessibility Implementation

- [x] 7.1 Añadir button:focus-visible en index.css con outline 2px primary
- [x] 7.2 Añadir prefers-reduced-motion media query en index.css (reduce animation/transition)
- [x] 7.3 Añadir touch-action: manipulation a buttons
- [x] 7.4 Añadir aria-hidden="true" a iconos decorativos (ChevronLeft, Star no interactive, Volume2)
- [x] 7.5 Corregir placeholder de textarea: "Toca para escribir…" (con ellipsis … no ...)
- [x] 7.6 VERIFICAR: spec scenarios de accesibilidad pasando

## Phase 8: Verification

- [x] 8.1 Ejecutar npm run lint — debe pasar sin errores
- [x] 8.2 Ejecutar npm run build — debe compilar exitosamente
- [x] 8.3 Ejecutar smoke test con agent-browser:
      ```
      npm run test:frontend
      ```
      Verifica: app carga, 4 tabs navigables, categorías renderizan, emergency button visible
- [ ] 8.4 Ejecutar test headed (opcional, para debug visual):
      ```
      npm run test:frontend:headed
      ```

## Phase 9: Quality Infrastructure (in progress)

### 9.1 Unit Tests
- [x] 9.1.1 Instalar Vitest (`npm install -D vitest @testing-library/react @testing-library/jest-dom`)
- [x] 9.1.2 Crear `vitest.config.ts` con configuración para este proyecto
- [x] 9.1.3 Agregar script `test` a package.json: `"test": "vitest run"`
- [ ] 9.1.4 Escribir tests unitarios para TTSPort (verifica interfaces y mock provider)
- [x] 9.1.5 Escribir tests unitarios para componentes: CategoryCard, PhraseCard

### 9.2 Conventional Commits
- [ ] 9.2.1 Instalar husky + commitlint: `npm install -D husky @commitlint/cli @commitlint/config-conventional`
- [ ] 9.2.2 Configurar `.commitlintrc.json` con tipo de commit (feat, fix, refactor, etc.)
- [ ] 9.2.3 Inicializar husky: `npx husky init` + hook en `commit-msg`

### 9.3 PR Workflow (GitHub Actions)
- [ ] 9.3.1 Crear `.github/workflows/ci.yml` con:
      - Runs on: push a main + PRs
      - Jobs: lint, typecheck, build, test (unit), test:e2e
      - Gate: todos los jobs deben pasar para merge
- [ ] 9.3.2 Crear `.github/workflows/playwright.yml` o usar agent-browser en CI
- [ ] 9.3.3 Agregar protección de branch en GitHub: require status checks

### 9.4 Coverage Gate
- [ ] 9.4.1 Agregar coverage a vitest: `--coverage`
- [ ] 9.4.2 Configurar coverage threshold (ej: 70%)
- [ ] 9.4.3 Agregar al CI: falla si coverage < threshold

---

## Quality Gates Summary

## Dependencies Overview

| Task | Depends On |
|------|------------|
| 2.1 (types) | 1.1-1.4 (fonts loaded) |
| 3.1 (Header) | 1.1-1.4 |
| 3.2 (BottomNav) | 1.1-1.4 |
| 4.1-4.3 | 2.1, 2.2 |
| 5.1-5.4 | Ninguno |
| 6.1 (App.tsx) | 3.1-3.3, 4.1-4.3, 5.1-5.4 |
| 7.1-7.6 | 6.1 |

## Files Summary

| File | Action |
|------|--------|
| index.html | Modify |
| src/index.css | Modify |
| tailwind.config.js | Create |
| src/types/index.ts | Modify |
| src/data/mock.ts | Modify |
| src/components/layout/Header.tsx | Create |
| src/components/layout/BottomNav.tsx | Create |
| src/components/layout/TopBar.tsx | Create |
| src/components/cards/CategoryCard.tsx | Create |
| src/components/cards/PhraseCard.tsx | Create |
| src/components/cards/EmergencyCTA.tsx | Create |
| src/lib/tts/ports/TTSPort.ts | Create |
| src/lib/tts/providers/MockTTSProvider.ts | Create |
| src/lib/tts/providers/index.ts | Create |
| src/lib/tts/TTSContext.tsx | Create |
| src/App.tsx | Modify |

---

## Quality Gates Summary

| Gate | Tool | Status | Description |
|------|------|--------|-------------|
| Lint | Biome | ✅ Ready | `npm run lint` — ya configurado |
| Type Check | TypeScript | ✅ Ready | `tsc --noEmit` — ya configurado |
| Build | Vite | ✅ Ready | `npm run build` — ya configurado |
| E2E Smoke | agent-browser | ✅ Ready | `npm run test:frontend` — ya configurado |
| Unit Tests | Vitest | ✅ Ready | `npm run test` — instalado y configurado |
| Commit Convention | husky + commitlint | ❌ Backlog | No configurado |
| CI/CD | GitHub Actions | ❌ Backlog | No configurado |
| Coverage Gate | Vitest coverage | ❌ Backlog | Requires unit tests first |

### Commitment
Al completar las phases 1-8, el proyecto tendrá una base sólida con lint/type/build/e2e verification. La Phase 9 es un **backlog de calidad** que puede ejecutarse en sprints futuros para alcanzar maturity de producción.
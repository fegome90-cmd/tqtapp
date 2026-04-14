# TQTApp — Design Skills & Improvement Analysis

> Generated: 2026-04-14
> App: Comunicación para pacientes con laringectomía total programada (FALP)
> Stack: React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Biome + Vitest

---

## Part A — Skills Inventory

### Project Skills (tqt_app/skills/)

| Skill | Purpose | Key Rules | Aspects |
|-------|---------|-----------|---------|
| **shadcn-component-discovery** | Search 1500+ shadcn registry components before building | Prefer official registries first (@shadcn, @blocks, @reui); present best matches with install command; MCP fallback | Visual Design, Components |
| **shadcn-component-review** | Audit components against shadcn patterns + theme styles | gap-* over space-y-*; semantic tokens only; data-slot attributes; 44px touch targets; min-w-0 on flex children | Visual Design, Components, A11y |

### Skill Registry Compact Rules (.atl/skill-registry.md)

| Skill | Key Compact Rules |
|-------|-------------------|
| **vercel-composition-patterns** | No boolean props for variants; use compound components; `use()` over `useContext()` in React 19; lift state to providers |
| **vercel-react-best-practices** | Check cheap sync conditions first; Promise.all() for parallel ops; derive state during render; extract static JSX outside component |
| **web-design-guidelines** | Fetch latest Vercel guidelines; review UI against Web Interface Guidelines; output in file:line format |

### Global Skills (applicable to tqt_app)

| # | Skill | Applies To | Key Rules |
|---|-------|-----------|-----------|
| 3 | **design-principles** | Visual Design | 4px grid base; commit to personality (Warmth & Trust); choose color foundation; typography sets tone |
| 4 | **frontend-patterns** | Components, Nav, A11y | Composition over inheritance; compound components; Context + Reducer; Error Boundary; Framer Motion patterns |
| 5 | **coding-standards** | All aspects | Immutability (spread, never mutate); verb-noun naming; explicit error handling; YAGNI; DRY |
| 6 | **tdd-workflow** | Testing | Tests BEFORE code; 80% coverage; RED-GREEN-REFACTOR; unit + integration + e2e |
| 7 | **security-review** | Security | No hardcoded secrets; Zod validation at boundaries; OWASP Top 10; input sanitization |
| 8 | **api-design** | Persistence (future API) | Resource-based URLs; consistent error envelope; pagination; versioning |
| 9 | **backend-patterns** | TTS, Persistence | Repository pattern; port/adapter; dependency injection; error handling layers |
| 10 | **verification-loop** | Build/Lint/Test | Build → Type check → Lint → Tests → Coverage gate; fix each phase before continuing |
| 11 | **database-migrations** | Data Model | Forward-only migrations; separate DDL/DML; test against prod-sized data; rollback plan |
| 12 | **liquid-glass-design** | Mobile visual | Glass effects; blur + reflection; interactive morphing; iOS 26 design language |
| 13 | **strategic-compact** | Architecture | Decision records; trade-off analysis; bounded contexts |

---

## Part B — Aspect-by-Aspect Improvement Analysis

### 1. Visual Design System

**Skills**: design-principles, shadcn-component-review, shadcn-component-discovery
**Files**: `tailwind.config.js`, `src/index.css`, `.interface-design/system.md`

#### Current State
- Material tokens defined in tailwind.config.js (40+ colors)
- CSS variables in index.css (surfaces, borders, text levels)
- Design decisions logged in .interface-design/system.md (dated entries)
- Nunito font (400-900 weights), border-only depth, Lucide icons
- Border radius: DEFAULT 1.5rem, lg 2.5rem, xl 4rem

#### Strengths
- Well-documented decisions log with rationale and dates
- Consistent border-only depth strategy (no shadow-sm on cards)
- Clear personality direction: "Warmth & Trust" for medical context
- Token system avoids hardcoded colors in most components

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| Mixed token sources | shadcn-component-review: semantic tokens only | Some components use `text-slate-*` directly instead of semantic tokens like `text-on-surface-variant`. Audit and replace. | **HIGH** |
| No theme style selected | shadcn-component-review: pick Vega/Nova/Maia/Lyra/Mira | The app's generous spacing + soft rounded corners align closest to **Maia** (generous, soft). Formalize this choice in system.md. | **MEDIUM** |
| Font scale not enforced | design-principles: 4px grid | Typography scale documented (9-24px) but not all values land on 4px grid. 9px nav labels should be 8px or 12px. | **MEDIUM** |
| Missing dark mode implementation | design-principles: commit to light or dark | `darkMode: 'class'` configured but no dark tokens defined. Either implement or remove the config. | **LOW** |
| No shadcn component reuse | shadcn-component-discovery: search before building | CategoryCard, PhraseCard could leverage existing shadcn card primitives (accordion, collapsible). Check registries. | **MEDIUM** |

---

### 2. Component Architecture

**Skills**: frontend-patterns, shadcn-component-review, vercel-composition-patterns
**Files**: `src/components/cards/`, `src/components/layout/`

#### Current State
- CategoryCard (237 lines with inline SVG icons), PhraseCard (73 lines), EmergencyCTA
- BottomNav (54 lines), TopBar (dynamic title + back)
- Cards use `bg-white rounded-2xl border-slate-200/60`
- No shadcn/ui primitives used

#### Strengths
- Clean separation: cards/ and layout/ directories
- PhraseCard has clear playing state visual feedback
- BottomNav is compact with proper aria attributes

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No compound components | vercel-composition-patterns: explicit variant components > boolean modes | CategoryCard mixes icon rendering + card layout. Extract `CategoryIcon` and compose. | **HIGH** |
| 237-line CategoryCard | frontend-patterns: single responsibility | Inline SVG icon map (10 icons) should be in `src/components/icons/` or use Lucide directly. Card component should be < 80 lines. | **HIGH** |
| No CVA variants | shadcn-component-review: use CVA for type-safe variants | PhraseCard has playing state via conditional className. Use CVA for `idle | playing | disabled` variants. | **MEDIUM** |
| No Error Boundary | frontend-patterns: Error Boundary pattern | No error boundary wrapping screens. Add at App level to catch render crashes gracefully. | **HIGH** |
| Missing data-slot attrs | shadcn-component-review: data-slot="component-name" | None of the components use `data-slot` attributes. Add for debugging and testing. | **LOW** |
| No React.memo on cards | frontend-patterns: React.memo for pure components | CategoryCard and PhraseCard are pure (props-driven). Wrap with React.memo to prevent unnecessary re-renders in list views. | **MEDIUM** |

---

### 3. TTS Architecture

**Skills**: backend-patterns (port/adapter), verification-loop
**Files**: `src/lib/tts/ports/TTSPort.ts`, `src/lib/tts/providers/`, `src/lib/tts/TTSContext.tsx`

#### Current State
- TTSPort interface: `speak()`, `stop()`, `isSpeaking()`
- Providers: BrowserTTSProvider (Web Speech API), MockTTSProvider (~1200ms delay)
- TTSContext with auto-detection (Browser fallback to Mock)
- Cleanup on unmount via useEffect return

#### Strengths
- Clean hexagonal architecture: port → providers
- MockTTSProvider enables testing without browser API
- Auto-detection of browser capability

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No error boundary for TTS | backend-patterns: error handling layers | BrowserTTSProvider can fail (no voices, permission denied). Wrap speak() in try-catch with user-friendly error state. | **CRITICAL** |
| No voice selection | TTSPort: TTSConfig has voice, rate, pitch | TTSConfig exists but no UI to change voice/rate. Essential for patients who need slower speech. | **HIGH** |
| No speaking queue | backend-patterns: single responsibility | Rapid button clicks queue multiple speak() calls. Add queue or cancel-previous behavior. | **HIGH** |
| Missing status events | backend-patterns: observable pattern | No `onStart` / `onEnd` / `onError` callbacks. PhraseCard can't reliably know when speech ends (polling isSpeaking is fragile). | **MEDIUM** |
| No volume indicator | — | Patients may not hear TTS output. Add visual waveform or pulse during playback. | **LOW** |

---

### 4. Navigation

**Skills**: frontend-patterns, vercel-react-best-practices
**Files**: `src/hooks/useNavigation.ts`, `src/components/layout/BottomNav.tsx`, `src/App.tsx`

#### Current State
- State-based navigation via `useNavigation` hook (no router)
- 4 tabs: Inicio, Escribir, Favoritos, Perfil
- 6 screens rendered conditionally in App.tsx
- No URL routing, no browser history integration

#### Strengths
- Zero dependency (no react-router)
- Simple tab-to-screen mapping
- Works for single-page PWA

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No screen transitions | frontend-patterns: AnimatePresence + motion | Screen switches are instant (no fade/slide). Add motion transitions for context continuity. | **MEDIUM** |
| No lazy loading | vercel-react-best-practices: dynamic import heavy components | All 6 screens loaded upfront. Use `lazy()` + `Suspense` for ProfileScreen and PreopVoiceBankScreen (less used). | **MEDIUM** |
| State not derived | vercel-react-best-practices: derive state during render | Navigation state is stored but screens could be derived from current tab index. Simplify. | **LOW** |
| No deep linking | — | Can't link to specific screen/category from external app. Add hash-based routing for PWA shareability. | **LOW** |
| Back navigation missing | frontend-patterns: focus management | CategoryDetailScreen needs back button but no focus restoration. TopBar has back but focus doesn't return to origin card. | **MEDIUM** |

---

### 5. Persistence Layer

**Skills**: backend-patterns (repository pattern), api-design, database-migrations
**Files**: `src/lib/persistence/`, `src/hooks/useFavorites.ts`, `src/hooks/useCustomPhrases.ts`

#### Current State
- useLocalStorage generic hook
- FavoritesRepository and CustomPhrasesRepository classes
- localStorage with JSON serialization
- No validation on read/write

#### Strengths
- Repository pattern separates storage from business logic
- Generic useLocalStorage hook is reusable
- Clean hook interface for components

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No validation on read | backend-patterns: validate at boundaries | localStorage data can be corrupted or tampered. Add Zod schema validation on read. | **CRITICAL** |
| No error handling | backend-patterns: explicit error handling | localStorage.getItem can throw (Safari private mode). Wrap in try-catch with fallback. | **CRITICAL** |
| Synchronous writes | backend-patterns: async repository interface | localStorage is sync but future backend won't be. Make repository interface async now for painless migration. | **HIGH** |
| No data versioning | database-migrations: forward-only migrations | No version field in stored data. If schema changes (e.g., adding carePhase filter), old data breaks. Add `__v` field. | **HIGH** |
| Missing migration for LEGACY_ID_MAP | database-migrations: separate DDL/DML | seed.ts has LEGACY_ID_MAP for old IDs. Should be a one-time migration, not embedded in seed data. | **MEDIUM** |

---

### 6. Accessibility

**Skills**: frontend-patterns (a11y), shadcn-component-review, coding-standards
**Files**: `src/index.css`, all components

#### Current State
- `button:focus-visible` outline (2px solid primary)
- `prefers-reduced-motion: reduce` disables all animations
- `touch-action: manipulation` on buttons (no double-tap delay)
- `aria-label` on BottomNav and icon containers
- `pb-safe` utility for safe-area-inset

#### Strengths
- Core a11y features implemented (focus, motion, touch)
- Semantic HTML (buttons, not divs)
- Safe area handling for mobile

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No screen reader testing | frontend-patterns: keyboard navigation | No aria-live regions for TTS feedback ("Reproduciendo...", "Frase completada"). Add live region for speaking state. | **CRITICAL** |
| No keyboard nav for cards | frontend-patterns: keyboard navigation | CategoryCards and PhraseCards are buttons (good) but no arrow-key navigation within card grids. Add roving tabindex. | **HIGH** |
| Missing skip navigation | WCAG 2.1 AA | No "Skip to main content" link. Add for keyboard users. | **HIGH** |
| Color contrast not verified | shadcn-component-review: accessibility | Primary text on primary-container (#014389 bg + white text) should be verified for 4.5:1 contrast ratio. | **MEDIUM** |
| No focus trap for modals | frontend-patterns: focus management | No modals yet, but PreopVoiceBankScreen will need them. Plan for focus trapping when modals arrive. | **LOW** |
| No aria-expanded on categories | WCAG 2.1 AA | Navigating into CategoryDetailScreen should announce context ("Categoría: Dolor, 5 frases"). | **MEDIUM** |

---

### 7. Data Model

**Skills**: coding-standards (immutability), database-migrations, backend-patterns
**Files**: `src/types/index.ts`, `src/data/seed.ts`

#### Current State
- CategoryId union type (9 literal strings)
- Category interface (optional `description` field)
- Phrase, PhraseTemplate, CustomPhrase interfaces
- PatientProfile with carePhase enum
- Seed data: 9 categories, 37 phrases across 5 clinical phases
- LEGACY_ID_MAP for migration

#### Strengths
- Union types for CategoryId prevent typos
- Clinical phases modeled explicitly
- Legacy ID migration considered

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| Mutable interfaces | coding-standards: always use spread, never mutate | Interfaces are mutable (no `readonly` modifiers). Add `readonly` to all type fields to enforce immutability at compile time. | **HIGH** |
| No runtime validation | backend-patterns: validate at boundaries | `as CategoryId` casts are unsafe. Use Zod or branded types for runtime safety on localStorage data. | **HIGH** |
| Seed data in code | database-migrations: separate data from schema | 434 lines of seed data in seed.ts. Should be JSON files or a seed function that can be versioned independently. | **MEDIUM** |
| Missing PhraseCategory assignment | coding-standards: type safety | Some phrases may not have proper carePhase assignment. Audit all 37 phrases against clinical pathway completeness. | **MEDIUM** |
| No PhraseGroup concept | — | As phrases grow (100+), grouping within categories becomes needed. Consider adding `PhraseGroup` type for subcategorization. | **LOW** |

---

### 8. Testing

**Skills**: tdd-workflow, verification-loop
**Files**: `src/test/` (5 test files), `vite.config.ts`, `package.json`

#### Current State
- App.test.tsx, domain.test.ts, persistence.test.ts, seed.test.ts, utils.test.ts
- Vitest + @testing-library/react
- No coverage thresholds configured
- No CI/CD pipeline
- agent-browser for E2E (installed but not used)

#### Strengths
- Test files exist for core domains
- Test setup with jest-dom matchers
- Agent-browser configured for E2E

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No coverage gate | tdd-workflow: 80% coverage minimum | No `coverageThreshold` in vitest config. Add thresholds: lines 80%, functions 80%, branches 80%. | **CRITICAL** |
| Missing component tests | tdd-workflow: unit tests for components | No tests for CategoryCard, PhraseCard, EmergencyCTA, BottomNav, TopBar. Add render + interaction tests. | **CRITICAL** |
| No TTS provider tests | tdd-workflow: unit tests for providers | MockTTSProvider and BrowserTTSProvider have no unit tests. Test speak(), stop(), isSpeaking() contract. | **HIGH** |
| No E2E tests running | tdd-workflow: E2E for critical flows | agent-browser installed but `test:frontend` never run. Write first E2E: "patient taps category, sees phrases, taps phrase to speak". | **HIGH** |
| No hooks testing | tdd-workflow: unit tests for hooks | useFavorites, useCustomPhrases, useNavigation, usePatient have no tests. Use `renderHook` from testing-library. | **HIGH** |
| No test isolation markers | tdd-workflow: clean up after tests | Tests may share localStorage state. Add `beforeEach(() => localStorage.clear())` to all test files. | **MEDIUM** |

---

### 9. Code Quality

**Skills**: coding-standards, verification-loop, security-review
**Files**: `biome.json`, `tsconfig.json`, `package.json`

#### Current State
- Biome for lint + format (replaces ESLint + Prettier)
- TypeScript strict mode
- No pre-commit hooks
- No CI/CD pipeline
- No conventional commits enforcement

#### Strengths
- Modern tooling (Biome > ESLint)
- TypeScript provides type safety
- Clean scripts in package.json

#### Gaps & Recommendations

| Gap | Skill Rule | Recommendation | Priority |
|-----|-----------|----------------|----------|
| No pre-commit hooks | verification-loop: build → typecheck → lint → test | Add `husky` + `lint-staged`: Biome check on staged files, typecheck on commit. | **CRITICAL** |
| No CI pipeline | verification-loop: continuous verification | No GitHub Actions. Add CI: Biome check → tsc → Vitest → Coverage gate. | **HIGH** |
| No .env validation | security-review: verify secrets exist | `.env.example` exists but no runtime validation. Add `zod` schema for env vars at app startup. | **HIGH** |
| No conventional commits | coding-standards: consistency | No commitlint or conventional commit enforcement. Add commitlint + config. | **MEDIUM** |
| Biome config not audited | coding-standards: enforce standards | biome.json exists but rules not reviewed against coding-standards skill. Audit for: no-console, no-unused-vars, explicit-function-return-type. | **MEDIUM** |
| No dependency audit | security-review: third-party security | No `npm audit` or Dependabot. Add Dependabot + weekly audit workflow. | **MEDIUM** |

---

## Part C — Prioritized Roadmap

### Quick Wins (< 1 session each)

| # | Action | Aspect | Impact |
|---|--------|--------|--------|
| Q1 | Add `coverageThreshold` to vitest config (80%) | Testing | CRITICAL |
| Q2 | Add try-catch to localStorage reads in useLocalStorage | Persistence | CRITICAL |
| Q3 | Add try-catch to BrowserTTSProvider.speak() | TTS | CRITICAL |
| Q4 | Add `readonly` to all interface fields in types/index.ts | Data Model | HIGH |
| Q5 | Add `aria-live="polite"` region for TTS speaking state | Accessibility | CRITICAL |
| Q6 | Formalize **Maia** as theme style in system.md | Visual Design | MEDIUM |
| Q7 | Add `beforeEach(() => localStorage.clear())` to test files | Testing | MEDIUM |

### Short-term (1-2 sessions)

| # | Action | Aspect | Impact |
|---|--------|--------|--------|
| S1 | Write component tests (CategoryCard, PhraseCard, BottomNav) | Testing | CRITICAL |
| S2 | Write TTS provider tests (MockTTS, BrowserTTS) | Testing | HIGH |
| S3 | Extract CategoryCard icons to `src/components/icons/` | Components | HIGH |
| S4 | Add Error Boundary at App level | Components | HIGH |
| S5 | Add Zod validation on localStorage reads | Persistence | CRITICAL |
| S6 | Add voice/rate selection UI in ProfileScreen | TTS | HIGH |
| S7 | Add motion transitions for screen navigation | Navigation | MEDIUM |
| S8 | Add roving tabindex for card grid keyboard nav | Accessibility | HIGH |
| S9 | Add husky + lint-staged pre-commit hooks | Code Quality | CRITICAL |
| S10 | Add GitHub Actions CI pipeline | Code Quality | HIGH |

### Long-term (future phases)

| # | Action | Aspect | Impact |
|---|--------|--------|--------|
| L1 | Implement dark mode with full token set | Visual Design | LOW |
| L2 | Add hash-based routing for PWA deep linking | Navigation | LOW |
| L3 | Make persistence layer async for backend migration | Persistence | HIGH |
| L4 | Write E2E test: "patient navigates → speaks phrase" | Testing | HIGH |
| L5 | Add data versioning (`__v` field) for schema evolution | Data Model | HIGH |
| L6 | Add PhraseGroup type for subcategorization | Data Model | LOW |
| L7 | Add focus trap for modals (PreopVoiceBank) | Accessibility | LOW |
| L8 | Audit color contrast for WCAG 2.1 AA compliance | Accessibility | MEDIUM |
| L9 | Add Dependabot + weekly npm audit | Code Quality | MEDIUM |
| L10 | Implement speaking queue for rapid TTS requests | TTS | HIGH |

---

## Critical Path Summary

The **4 most impactful improvements** (do these first):

1. **Error handling** — Add try-catch to localStorage + TTS providers (prevents crashes)
2. **Coverage gate** — Add 80% threshold + component tests (enables confident refactoring)
3. **Pre-commit hooks** — husky + lint-staged (prevents regressions)
4. **Aria-live for TTS** — Screen reader users need to know when speech starts/stops

# TQTApp — Comunicación Laringectomía

App de comunicación para pacientes con **laringectomía total programada** — FALP.

TQTApp permite a pacientes laringectomizados comunicarse con el equipo clínico y familiares mediante frases predefinidas, texto libre, y síntesis de voz (TTS).

## MVP — Alcance actual

### Lo que está implementado

- **9 categorías clínicas** alineadas con la vía de laringectomía total: Urgente, Respiración, Aspiración, Dolor, Posición, Familia, Necesidades, Emociones, Gratitud
- **33+ frases clínicas** específicas para laringectomía total programada
- **Síntesis de voz** vía Web Speech API (español) con fallback a MockTTSProvider en testing
- **Persistencia local** (localStorage) para favoritos y frases personalizadas
- **Texto libre** con sugerencias rápidas y reproducción TTS
- **Perfil clínico** con datos del paciente, accesibilidad y acceso al banco de voz
- **Navegación por tabs** sin router (state-based)

### Lo que NO está implementado (futuras fases)

- Banco de voz (grabación y clonación) — solo stub de interfaz
- Frases personalizadas por el usuario en la UI (backend del repositorio listo)
- Integración con servicios externos o backend
- Soporte multi-paciente
- Internacionalización más allá de español

## Fases clínicas soportadas

El sistema define las siguientes fases del cuidado:

1. **Preop** — Preoperatorio (preparación antes de la cirugía)
2. **Hospitalización** — Post-quirúrgica inmediata
3. **Rehabilitación temprana** — Primeras semanas de recuperación
4. **Rehabilitación tardía** — Meses siguientes
5. **Seguimiento** — Control ambulatorio

## Stack técnico

- **React 19** + TypeScript
- **Vite 6** (bundler)
- **Tailwind CSS 4** (estilos)
- **Biome** (linting + formatting)
- **Vitest** + Testing Library (tests)
- **Web Speech API** (TTS, navegador nativo)
- **localStorage** (persistencia, sin dependencias)

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev        # servidor de desarrollo en :3000
```

## Scripts disponibles

| Script | Propósito |
|--------|-----------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview local del build |
| `npm run lint` | Biome lint + TypeScript typecheck |
| `npm run format` | Formateo con Biome |
| `npm run check` | Check/fix amplio con Biome |
| `npm run test` | Tests unitarios (Vitest) |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con cobertura |

## Estructura del proyecto

```text
src/
├── App.tsx                    Composition root (thin shell)
├── main.tsx                   React bootstrap
├── index.css                  Estilos globales + Tailwind
├── types/index.ts             Tipos de dominio (PatientProfile, PhraseTemplate, etc.)
├── data/seed.ts               Datos iniciales (frases clínicas + categorías)
├── screens/                   6 pantallas decomisadas
│   ├── HomeScreen.tsx
│   ├── CategoryDetailScreen.tsx
│   ├── FreeTextScreen.tsx
│   ├── FavoritesScreen.tsx
│   ├── ProfileScreen.tsx
│   └── PreopVoiceBankScreen.tsx
├── hooks/                     Custom hooks
│   ├── useNavigation.ts       Navegación state-based
│   ├── useFavorites.ts        Favoritos con persistencia
│   └── useCustomPhrases.ts    Frases personalizadas con persistencia
├── lib/
│   ├── utils.ts               Helpers (cn)
│   ├── tts/                   Arquitectura hexagonal TTS
│   │   ├── TTSContext.tsx      React context + provider
│   │   ├── ports/TTSPort.ts   Interface TTSProvider
│   │   └── providers/
│   │       ├── MockTTSProvider.ts      Simulación para tests
│   │       └── BrowserTTSProvider.ts   Web Speech API real
│   ├── persistence/           Capa de persistencia
│   │   ├── useLocalStorage.ts Generic hook
│   │   ├── FavoritesRepository.ts
│   │   └── CustomPhrasesRepository.ts
│   └── voicebank/
│       └── VoiceBankService.ts Stub interface (sin implementación)
├── components/
│   ├── cards/                 CategoryCard, PhraseCard, EmergencyCTA
│   └── layout/
│       ├── BottomNav.tsx      Navegación inferior (4 tabs)
│       └── TopBar.tsx         Header compartido
└── test/                      Tests unitarios
    ├── setup.ts               jest-dom + cleanup
    ├── App.test.tsx           Tests de integración de la app
    ├── domain.test.ts         Tests de tipos de dominio
    └── persistence.test.ts    Tests de persistencia
```

## Validación

Para cambios en UI o TypeScript:

```bash
npm run lint
```

Para cambios de configuración o bundling:

```bash
npm run build
```

Para tests:

```bash
npm run test
```

## Roadmap

| Fase | Descripción | Estado |
|------|-------------|--------|
| MVP | Decomposición, TTS real, persistencia, datos clínicos | ✅ Actual |
| Fase 2 | Banco de voz con grabación, frases personalizadas en UI | 🔲 Pendiente |
| Fase 3 | Integración con servicios externos, perfil dinámico | 🔲 Pendiente |
| Fase 4 | Multi-paciente, analytics, accesibilidad avanzada | 🔲 Pendiente |

<!-- FOR AI AGENTS - Human readability is a side effect, not a goal -->
<!-- Root defaults only. Prefer more specific agent files when present. -->

# AGENTS.md

## Precedence
- The closest AGENTS.md or agent-specific file to the changed area wins.
- Root rules apply when no more specific instructions exist.
- Direct user instructions override this file.

## Project Snapshot
- App stack: React 19 + TypeScript + Vite 6.
- Styling/tooling: Tailwind CSS 4, Biome, TypeScript.
- Repo type: frontend app with some Node-side dependencies present.
- Main branch: `main`.

## Commands
Commands below are sourced from `package.json`.

| Task | Command | Use when |
|------|---------|----------|
| Install deps | `npm install` | first setup or lockfile changes |
| Dev server | `npm run dev` | local development |
| Build | `npm run build` | changes affecting bundling or app output |
| Lint + typecheck | `npm run lint` | any TS/React change before finishing |
| Format | `npm run format` | formatting-only cleanup |
| Biome check/fix | `npm run check` | broad code cleanup when requested |
| Preview build | `npm run preview` | verifying production build locally |
| Frontend smoke test | `npm run test:frontend` | validating core UI flow with agent-browser |

## Working Rules
1. Make the smallest change that solves the request.
2. Validate against real files; do not invent scripts, paths, or APIs.
3. Do not edit generated output or dependencies unless explicitly asked.
4. Ask before adding dependencies, changing architecture, or modifying public interfaces.
5. Never commit secrets or sample real credentials.

## Validation
1. TS/React/UI changes: run `npm run lint`.
2. Build/config changes: run `npm run build`.
3. User-facing frontend flow changes: run `npm run test:frontend` when agent-browser is available.
4. If both source and config changed, run both.
5. If validation fails due to pre-existing issues, report that clearly.

## File Map
| Path | Purpose |
|------|---------|
| `src/App.tsx` | main application composition |
| `src/main.tsx` | app bootstrap |
| `src/index.css` | global styles |
| `src/data/` | mock or local data |
| `src/lib/` | utilities |
| `src/types/` | shared types |
| `.github/agents/` | custom project agents |
| `stich_examples/` | reference/example assets |
| `.atl/` | local project tooling metadata |

## Boundaries

### Always Do
- Read the nearest instructions before editing.
- Preserve existing code style and naming patterns.
- Keep diffs focused and easy to review.
- Mention what changed and how it was validated.

### Ask First
- New dependencies or package removals.
- Large refactors across multiple folders.
- Build pipeline or deployment changes.
- Changes to environment variable contracts.

### Never Do
- Edit `node_modules/`, `dist/`, or other generated artifacts.
- Introduce secrets into tracked files.
- Rewrite unrelated code just to make style uniform.
- Assume backend behavior that is not present in the repo.

## Agent Index
- `.github/agents/tqtapp.agent.md` - implementation agent for React/TypeScript/Vite/Biome work.

## Done Criteria
- Requested change implemented.
- Relevant validation command executed, or blocker explained.
- Final response includes changed files, validation result, and any open risk.
# AGENTS.md

## Stack
- Single-package Next.js 16 app-router app at repo root.
- Use `bun`; Bun is installed in this environment. `pnpm-lock.yaml` is still present, so prefer not to mix lockfiles unless the task includes migrating package management.
- Styling uses Tailwind CSS v4 through `app/globals.css`; there is no `tailwind.config.*` file.
- UI primitives come from shadcn/ui (`components.json` uses `new-york`, `rsc: true`, aliases like `@/components` and `@/lib`).

## Commands
- Install: `bun install`
- Dev server: `bun run dev`
- Production build: `bun run build`
- Start built app: `bun run start`
- Lint: `bun run lint`

## Verification
- There is no dedicated `typecheck` script and no test suite/config in the repo.
- `next.config.mjs` sets `typescript.ignoreBuildErrors = true`, so `bun run build` will not catch TS errors reliably.
- If you need a real TS check, run `bunx tsc --noEmit` manually.
- Best available focused verification is usually `bun run lint` plus `bunx tsc --noEmit`.

## Structure
- `app/page.tsx` is the main product entrypoint and currently owns the screen-state flow.
- The quiz flow is entirely client-side right now: notes input -> processing -> quiz -> results.
- Quiz data is currently hardcoded in `app/page.tsx`; there is no backend/API or generation pipeline yet.
- Core feature components live in `components/` (`notes-input.tsx`, `quiz.tsx`, `question-card.tsx`, `results-screen.tsx`, `processing-screen.tsx`).
- Shared utilities are minimal; `lib/utils.ts` provides the usual `cn()` helper.

## Repo Quirks
- `app/layout.tsx` includes Vercel Analytics only in production.
- `next.config.mjs` also sets `images.unoptimized = true`; do not assume Next image optimization is active.
- `components/theme-provider.tsx` exists, but the root layout does not currently wrap the app with it.

## Editing Guidance
- Prefer updating the existing client-side flow instead of inventing server infrastructure unless the task requires it.
- When changing styling or tokens, edit `app/globals.css`; that file defines the theme variables and Tailwind v4 `@theme` mappings.

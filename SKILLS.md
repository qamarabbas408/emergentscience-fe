# SKILLS.md — Project Workflow & Conventions

## Tech Stack
- **React 19 + TypeScript** (Vite 8, rolldown bundler)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (CSS-first config, no `tailwind.config.js`)
- Node 24, npm 11

## Commands
```bash
npm install          # install dependencies
npm run dev          # start dev server (default port 5173)
npm run build        # typecheck (tsc -b) + production build
npm run lint         # oxlint (React + TS rules)
```

## Project Structure
```
src/
  components/   # shared UI (Header, Footer)
  pages/        # route-level pages (Landing, ...)
  App.tsx       # root component
  main.tsx      # entry point
  index.css     # Tailwind import + @theme design tokens
```

## Design System (Frontiers-inspired)
Design tokens live in `src/index.css` under `@theme`:

| Token | Value |
|---|---|
| `--color-primary` | `#003bde` |
| `--color-primary-hover` / `-deep` | `#0024b0` / `#001959` |
| `--color-primary-tint` | `#eef5ff` |
| `--color-sky` | `#00a0dc` |
| `--color-ink` / `-secondary` / `-muted` | `#282828` / `#545454` / `#6b6b6b` |
| `--color-body` / `-surface` | `#f7f7f7` / `#ffffff` |
| `--color-border` | `#e6e6e6` |
| `--color-success` / `-warning` / `-danger` | `#459d3a` / `#e56000` / `#d51a2c` |
| `--radius-card` | `8px` |
| `--shadow-card` | subtle multi-layer 40/40/8 shadows |
| `--shadow-hero` | `0 4px 33px rgba(0,0,0,.25)` |

- **Font:** Inter (300/400/500/600/700), loaded via Google Fonts in `index.html`; stand-in for Frontiers' proprietary MuseoSans
- Brand accent for the navbar is crimson `#dc2626` (per header spec), independent of the blue primary tokens
- Use tokens (`bg-primary`, `text-ink-secondary`, `rounded-card`, `shadow-card`) instead of raw hex

## Conventions
- **TypeScript strict**; no `any` unless unavoidable
- **No comments in code** unless explicitly requested
- Components: function components with named exports, PascalCase files
- Data arrays (nav links, cards) defined as module-level constants, mapped in JSX
- Mobile-first responsive: base styles for mobile, `sm:`/`md:`/`lg:`/`xl:`/`2xl:` breakpoints for larger screens
- Verify responsiveness (no horizontal overflow) with headless Chrome at 320–1280px before finishing a layout change
- Use real Unsplash images (auto=format&fit=crop&w=2400&q=80) for hero/featured backgrounds with a dark overlay for text legibility

## Workflow
- New feature → verify `npm run build` passes → manually verify in `npm run dev`
- Commit convention: conventional prefixes (`feat:`, `fix:`, `refactor:`)
- Always run `npm run build` after changes before committing
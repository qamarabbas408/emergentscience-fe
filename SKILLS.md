# SKILLS.md — Project Workflow & Conventions

## Tech Stack
- **React 19 + TypeScript** (Vite 8, rolldown bundler)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (CSS-first config, no `tailwind.config.js`)
- **TanStack Query** for server state; **Axios** for HTTP; **react-i18next** for i18n; **react-router-dom** for routing
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
  api/          # API modules (endpoints, auth, query hooks)
  components/   # shared UI (Header, Footer, AuthModal, LanguageSwitcher)
  i18n/         # i18next setup + locale resources
  lib/          # utilities (apiClient, uploader)
  pages/        # route-level pages (Landing, ...)
  appConstants.ts  # shared UI data (nav, stats, features, ...)
  appImages.ts     # shared image URLs
  appRoutes.ts     # route path constants
  App.tsx       # root component + router
  main.tsx      # entry point (providers)
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

## React Best Practices
Reference: https://react.dev/reference/react
- **Components:** function components, PascalCase file names, named exports
- **Hooks:** call only at the top level of components/custom hooks; never conditionally or in loops. Custom hooks prefixed `use` (e.g. `useMe`, `useLogin`)
- **Server state → TanStack Query:** use `useQuery` for reads, `useMutation` for writes; manage loading/error states from the hook, not local state. Never `useEffect` + fetch
- **Derived state:** compute during render (plain variables/memo), don't mirror it in state
- **Props:** type everything with TS; use discriminated unions for component variants; destructure props
- **Lists:** give stable keys from data (id/slug), never array index
- **Events:** use semantic HTML (`<button>`, `<form>`, `<label>`) with proper `aria-*` and `onSubmit` for forms instead of divs with onClick
- **Accessibility:** visible focus styles (`focus-visible:`), `aria-live`/`role="status"` for dynamic content (toasts, inline messages)
- **i18n:** all user-facing strings go through `t()` from react-i18next; never hardcode copy in JSX
- **Composition:** extract small presentational components over big config props; avoid over-spreading props
- **Performance:** reach for `useMemo`/`useCallback` when a child re-renders on a fresh object/function; avoid premature optimization
- **Error boundaries** for sections that can throw (upload, render of external data)

## Tailwind CSS v4 Best Practices
Reference: https://tailwindcss.com/docs/installation/using-vite
- **CSS-first config:** all design tokens live in `@theme` in `index.css` — that file is the single source of truth
- **Use tokens, not raw values:** prefer `bg-primary`, `text-ink-secondary`, `rounded-card`, `shadow-card` over `bg-[#003bde]`, `rounded-[8px]`, `p-[13px]`
- **Naming:** `@theme` namespaces `--color-*`, `--radius-*`, `--shadow-*` generate `bg-*`, `rounded-*`, `shadow-*` utilities
- **Utility-first in JSX:** compose classes inline; prefer extracting repeated class groups into small components over `@apply`. If `@apply` is used inside a CSS file, prefix the file with `@reference "../index.css"` in v4
- **Avoid arbitrary values** (`h-[37px]`, `w-[400px]`) when a spacing-scale utility exists (`h-9`, `max-w-*`); the 4px spacing scale is preferred
- **Responsive:** mobile-first — base styles un-prefixed, then `sm:`/`md:`/`lg:`/`xl:`/`2xl:` upgrades
- **Interactions:** prefer `hover:`/`focus-visible:`/`active:`/`disabled:` variants; use `focus-visible:` for keyboard-visible focus, not `focus:`
- **Layering:** manage z-index deliberately; document it (navbar `z-50`, modals `z-50`, toasts `z-60`). Reserve custom media queries for rare cases
- **No global element styling** beyond reset; style through utilities on elements

## Conventions
- **TypeScript strict**; no `any` unless unavoidable
- **No comments in code** unless explicitly requested
- Components: function components with named exports, PascalCase files
- Data arrays (nav links, cards) defined as module-level constants, mapped in JSX
- Centralize shared UI data in `appConstants.ts`, paths in `appRoutes.ts`, image URLs in `appImages.ts`
- Mobile-first responsive: base styles for mobile, `sm:`/`md:`/`lg:`/`xl:`/`2xl:` breakpoints for larger screens
- Verify responsiveness (no horizontal overflow) with headless Chrome at 320–1280px before finishing a layout change
- Use real Unsplash images (auto=format&fit=crop&w=2400&q=80) for hero/featured backgrounds with a dark overlay for text legibility

## Workflow
- New feature → verify `npm run build` passes → manually verify in `npm run dev`
- Commit convention: conventional prefixes (`feat:`, `fix:`, `refactor:`)
- Always run `npm run build` after changes before committing

## Agent Practices
- Follow the React best practices above before developing a feature: https://react.dev/reference/react
- Follow the Tailwind v4 best practices above when designing UI: https://tailwindcss.com/docs/installation/using-vite
- Check that UI additions reuse existing design tokens and shared constants before adding new ones
- Keep `npm run build` and `npm run lint` green before finishing any task
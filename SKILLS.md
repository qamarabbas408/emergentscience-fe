# Skills

## PORT-UIUX: copy UI/UX from other codebase → this project
Assume NOTHING carries over. Max context, min tokens.

### 0. cp > Read→Write
- NEVER read-to-rewrite. `cp src/a/X.tsx src/b/X.tsx` = zero content tokens. Batch copies 1 cmd.
- READ only what must CHANGE. Untouched file → cp only.
- Contract-only peek: `grep -n "interface\|type \|export function\|const .* = (" X.tsx`
- Read once → note inventory → never re-read unchanged files.

### 1. Inventory (1 pass)
exports (components/props/types/helpers/constants/hooks); imports (icon lib? utils? theme tokens? react-query/zustand/form libs); child component prop signatures exact (`onSelect(j,s)` vs `onSelect(j)`); state shape (draft defaults, localStorage keys, validators, word/char limits).

### 2. Dependency map (before code)
icons: source→target (`<SearchIcon/>`→lucide `Search`); tokens: raw class→project token (`bg-blue-50`→`bg-primary-tint`, text→`text-ink`); types: field diffs (`section` vs `specialties[]`, `category` vs `domain`); API: fetch→client/endpoints/hooks + response shapes. Missing dep → install/substitute/stub BEFORE porting.

### 3. Adapt at boundary only
- NO internal edits to copied components. Thin adapter/mapper at call site (`{section,category}`→`{specialties[],domain}`).
- 1 type source-of-truth; extend/re-export; alias clashes: `import type { JournalOption as PickerJournalOption }`.
- Replacing inline impl w/ shared component → GREP shared component CURRENT props first (call sites often stale vs component API).

### 4. Behavior > markup
carry validators/computed (word counters, limits, `hasEditableVersion`); persistence keys + default factories + resume logic; keyframes/animate-in classes from index.css.

### 5. Verify (once, batched)
grep stale refs (old props, removed setters, dead constants, unused imports) → lint+tsc+build one pass → smoke route curl 200 → commit only after pass.

### 6. Context trail
summary: files ported, mappings applied, intentional drops, fallbacks (mock-on-API-fail).

## BEST-PRACTICES (current docs)

### React 19+ (react.dev)
fn components+hooks; named exports. NO useEffect fetching → TanStack Query. Derive state in render, no effect-sync. Stable keys (IDs not index). State colocated low. useRef = DOM/imperative only.

### TS strict (typescriptlang.org/docs)
no `any` → `unknown`+narrow at boundaries. `import type`. Props derived from API resource types. `satisfies` for configs. Discriminated unions > bool flags. No enums → literal unions / `as const`. tsc catches drift pre-runtime.

### TanStack Query v5 (tanstack.com/query/latest)
object syntax only `{queryKey,queryFn}`. ALL vars in queryKey. `enabled` conditional. `placeholderData: keepPreviousData` (imported fn). `select` transform = fewer re-renders. UI handles isPending/isError/error, no try/catch around hooks. Mutations → invalidateQueries. v4→v5 migration guide if behavior differs.

### Tailwind (tailwindcss.com/docs)
project tokens ONLY (`bg-primary-tint`,`text-ink`,`border-border`) not raw palette/arbitrary values; check index.css/@theme first. Conditional classes via cn()/clsx. Mobile-first prefixes. Extract patterns → components not @apply.

## DEBUG ESCALATION
Bug survives 2–3 fix attempts → STOP guessing → official docs: react.dev · typescriptlang.org/docs · tanstack.com/query/latest · tailwindcss.com/docs. Search exact error + pkg version; check migration guide for installed major BEFORE more fixes.

## TOKEN EFFICIENCY
grep/glob before read; offset/limit windows; parallel tool calls (1 msg many calls); write final code ONCE (no patch churn); targeted edits > rewrites; no re-reads; terse replies (no code restating/preamble); port N files → verify once at end.

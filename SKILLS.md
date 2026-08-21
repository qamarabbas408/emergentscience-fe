# Skills

## REVAMP-UI source
- repo: `/Users/qabbas715/Projects/emerginscience/emergentsci-google-ai-ui` (clone of this app, same stack)
- port = cp page + unique components/data; keep OUR Header/Footer/skeletons/toast/api; no cross-repo imports
- ported: /articles (ArticlesPage, ArticleCard, ArticleDetailModal, QuickCiteModal, data/articlesData.ts)
- mock data → swap queryFn when real API shared

## PORT-UIUX (other codebase → here)
Assume nothing carries over. Max context, min tokens.

### 0. cp > Read→Write
- never read-to-rewrite: `cp a/X.tsx b/X.tsx`; batch 1 cmd
- read only what must change; contract peek: `grep -n "interface\|type \|export function" X.tsx`
- read once → note → no re-reads

### 1. Inventory (1 pass)
exports; imports (icons/utils/tokens/state libs); child prop signatures exact; state shape (defaults, localStorage keys, validators, limits)

### 2. Dependency map (pre-code)
icons→lucide equiv; raw class→token (`bg-blue-50`→`bg-primary-tint`, text→`text-ink`); type field diffs (`section` vs `specialties[]`); fetch→our api layer. Missing dep → install/substitute/stub first.

### 3. Adapt boundary only
- no internal edits to copied components; thin mapper at call site
- 1 type source-of-truth; alias clashes: `import type { X as Y }`
- replacing inline impl w/ shared comp → grep shared comp CURRENT props first

### 4. Behavior > markup
carry validators/computed/limits; persistence keys + default factories; keyframes from index.css

### 5. Verify (once)
grep stale refs → lint+tsc+build one pass → curl route 200 → commit after pass

### 6. Context trail
summary: files ported, mappings, intentional drops, fallbacks

## BEST-PRACTICES

### React 19+ (react.dev)
fn components+hooks; named exports; NO useEffect fetching → TanStack Query; derive state in render; stable keys (IDs); state colocated low; useRef = DOM only

### TS strict (typescriptlang.org/docs)
no `any` → `unknown`+narrow; `import type`; props from API types; `satisfies`; discriminated unions > bool flags; no enums → unions/`as const`

### TanStack Query v5 (tanstack.com/query/latest)
object syntax `{queryKey,queryFn}`; all vars in queryKey; `enabled` conditional; `placeholderData: keepPreviousData`; `select` transform; UI handles isPending/isError; mutations → invalidateQueries

### Tailwind (tailwindcss.com/docs)
project tokens only (`bg-primary-tint`,`text-ink`,`border-border`); cn()/clsx for conditionals; mobile-first; components > @apply

## DEBUG ESCALATION
bug survives 2–3 fixes → docs: react.dev · typescriptlang.org/docs · tanstack.com/query/latest · tailwindcss.com/docs; search exact error + version; check migration guide first

## TOKEN EFFICIENCY
grep/glob before read; offset/limit windows; parallel calls; write once (no patch churn); targeted edits; no re-reads; terse replies; port N files → verify once at end

# Upgrade Roadmap

## Context

This project is a fork of [satnaing/astro-paper](https://github.com/satnaing/astro-paper), diverged after the **Astro 5.0.5** update (commit `037eba7`, Dec 2024) and never re-synced. Since then:

| | This fork (pre-upgrade) | Upstream astro-paper (now) |
|---|---|---|
| Astro | 5.0.5 | 7.x |
| React | 18 (kept, used for islands) | removed entirely |
| Styling | Tailwind CSS v3 | Tailwind CSS v4 |
| Search | Fuse.js (custom `Search.tsx`) | Pagefind |
| i18n | Custom (`src/i18n/*`, `[lang]` routing) | Native Astro i18n |
| TOC | Custom (`tocbot` + `Tocbot.tsx`) | Built-in |
| Comments | Giscus (custom) | not in base theme |
| Content dir | `src/content/blog/<slug>/<lang>.md` | `src/content/posts/` |
| Config | `src/config.ts` | `astro-paper.config.ts` (user) + internal `src/config.ts` |

*(Table reflects state at the start of this roadmap. Phase 5 below adopted the i18n string pattern, Pagefind, and the content/config restructure — see that section for what actually changed and why "native i18n"/"built-in TOC" weren't quite what they first appeared to be. React, the custom TOC sidebar, and Giscus comments were kept throughout; upstream doesn't have equivalents for the latter two.)*

Upstream has effectively become a different codebase (React removed, config layout changed). **A rebase/merge from upstream is not realistic** — it would clobber the localization, TOC, and comments work that upstream doesn't have at all. Instead, this roadmap is an **incremental upgrade of our own stack**, treating upstream as a reference to borrow ideas from where they don't conflict with our custom features.

## Guiding principles

- Upgrade Astro one major version at a time (5 → 6 → 7), fully testing between each.
- Keep our custom i18n, TOC, search, and comments implementations — don't adopt upstream's native replacements unless a specific phase below calls for evaluating one.
- One phase = one branch = one PR, so a regression is easy to isolate and revert.
- Run `npm run build`, `npm run lint`, `npm run format:check`, and a manual smoke test (home, a post in each locale, tags, search, RSS, OG image) after every phase.

---

## Phase 0 — Prep ✅ done

- [x] Create a working branch (`chore/astro-upgrade`).
- [x] Confirmed local Node (v24.15) satisfies Astro 6/7's `>=22.12.0`; added an explicit `engines.node` field since nothing pinned it before.
- [x] Baseline established via `npm run build` + a full-site screenshot pass (used later to catch the Tailwind v4 regression in Phase 4).

## Phase 1 — Astro 5.0.5 → latest 5.x ✅ done

Bumped to **5.18.2**. No breaking changes hit, as expected.

## Phase 2 — Astro 6.x ✅ done

Bumped to **6.4.8**. What actually happened, vs. the plan:

- [x] `<ViewTransitions />` → `<ClientRouter />` in `src/layouts/Layout.astro`.
- [x] `engines.node: ">=22.12.0"` added; CI node-version matrix bumped `18.x` → `22.x`.
- [x] Zod v4 — non-issue as predicted, schema unaffected.
- [x] Content Layer API — already in place, no action.
- [x] `Astro.glob()` — not used, no action.
- [x] **Not predicted:** `src/content/config.ts` had to move to `src/content.config.ts` (legacy content-config-file location removed in v6).
- [x] **Not predicted:** `@astrojs/tailwind`'s peer range hard-caps at Astro 5 (`^3.0.0 || ^4.0.0 || ^5.0.0`) — it doesn't declare v6 support at all. Replaced with a plain PostCSS setup (`postcss.config.cjs` + `tailwindcss`/`autoprefixer`) to unblock the bump; this was itself replaced by `@tailwindcss/vite` in Phase 4.
- [x] **Not predicted:** Astro's built-in i18n router started conflicting with the manual `[lang]` routing for the default locale (`pt-br`) in dev mode only (`astro dev` 404'd on `/pt-br/*`; `astro build` output was already correct). Fixed with `i18n.routing.prefixDefaultLocale: true`.

## Phase 3 — Astro 7.x ✅ done

Bumped to **7.2.0**.

- [x] Markdown pipeline: added `@astrojs/markdown-remark`, switched to the `markdown.processor` / `unified()` API (this API itself landed in 6.4, so it was available slightly before v7, but v7 is what made the old `markdown.remarkPlugins` truly deprecated-with-a-warning).
- [x] Rust compiler strictness — build passed clean, no unclosed-tag/invalid-nesting errors surfaced.
- [x] `compressHTML: 'jsx'` default — checked rendered post text and static templates for glued-together inline content; none found (markdown-sourced spacing survives fine; no hand-authored adjacent-tag markup in components).
- [x] `src/fetch.ts` reserved name, `@astrojs/db` removed — neither applicable.
- [x] **Not predicted:** Astro 7's dev server is now a detached daemon process (`astro dev status` / `astro dev stop`) — `npm run dev` returns immediately after spawning it rather than blocking in the foreground.

## Phase 4 — Ecosystem cleanup ✅ done

- [x] Bumped `fuse.js`, `tocbot`, `@giscus/react`, `prettier` + plugins, `@types/react`. tocbot 4.36 moved its API onto a default export (`import tocbot from "tocbot"` instead of `import * as tocbot`).
- [x] Bumped `typescript` — capped at **6.0.3**, not the newest **7.x**, because `typescript-eslint`'s peer range (`>=4.8.4 <6.1.0`) doesn't support TS 7 yet. Revisit once typescript-eslint catches up.
- [x] Bumped `eslint` 9→10, `eslint-plugin-astro` 1→3, `typescript-eslint`/`@typescript-eslint/parser` to 8.66, `globals` to 17, `satori` 0.11→0.29, `react`/`react-dom` 18→19 (matching the `@types/react@19` that was already installed).
  - `eslint-plugin-astro@3`'s flat-config preset (`configs["flat/recommended"]`) now wires `astro-eslint-parser` itself, including TS frontmatter support — removed the manual parser block and the direct `astro-eslint-parser` dependency from `eslint.config.mjs`.
  - `@eslint/js` had to become an explicit devDependency (was only ever present transitively).
  - `src/utils/generateOgImages.tsx`: wrapped the resvg `Buffer` output in `new Uint8Array(...)` before `new Response(...)` — newer `@types/node`'s `Buffer` type no longer structurally satisfies `BodyInit`.
- [x] Dockerfile pinned to `node:22-alpine` (was `node:lts`, functionally the same today, just explicit now).
- [x] **Tailwind v3 → v4.** Bigger than expected — see the dedicated writeup below.

### Tailwind v4 migration — what actually happened

- Dropped the PostCSS route entirely in favor of **`@tailwindcss/vite`** (the officially recommended Astro/Vite integration) — the `postcss.config.cjs` + `@tailwindcss/postcss` combination broke on `@reference` + a nested `@import "tailwindcss"` inside Astro's scoped `<style>` blocks.
- `tailwind.config.cjs` removed; config now lives in `src/styles/base.css` (`@theme` for colors/font/breakpoint, `@plugin "@tailwindcss/typography"`).
- Two color tokens (`skin-fill`, `skin-inverted`) mapped to *different* CSS variables depending on utility category in the old per-category `theme.extend` config (e.g. `bg-skin-fill` used `--color-fill` but `border-skin-fill`/`outline-skin-fill` used `--color-text-base`/`--color-accent`). v4's single `--color-*` namespace can't express that split — the two colliding call sites were renamed to the equivalent non-colliding token (`outline-skin-accent`, `border-skin-base`/`border-skin-fill/40`→`border-skin-base/40`), same resolved color.
- Every scoped `<style>` block using `@apply` needs `@reference "path/to/base.css"`.
- **The big one:** those same blocks also need wrapping in `@layer components { ... }`. v4 uses real native CSS cascade layers, and unlayered CSS unconditionally beats *any* layered rule regardless of specificity — v3's layers were just a build-time convention, not real `@layer`. Without this, `Header.astro`'s scoped `nav ul { grid }` rule silently beat the `sm:flex` utility class applied directly in markup on the same `<ul>`, collapsing the desktop nav into a stacked column. This was caught only by screenshot-diffing against the pre-migration build (via a throwaway `git worktree`) — build, lint, and typecheck all stayed green throughout.
- `outline-2`/`outline-offset-1` utilities now also set `outline-style: solid` by default (v3 needed a separate style utility) — this was making every link's focus ring permanently visible instead of only on `:focus-visible`. Moved behind `focus-visible:`.
- Found and fixed a genuinely-invalid pre-existing `<li>`-in-`<li>` nesting in `Header.astro` while investigating the nav regression above (browsers were already silently auto-correcting it, so fixing it was a no-op for rendering — but worth having fixed).

## Phase 5 — Upstream feature adoption ✅ done

What was originally scoped as a backlog ("evaluate individually, low priority") turned into its own body of work once actually pursued: native i18n, Pagefind, and the content/config restructure.

**Correction discovered along the way:** "adopt upstream's native i18n" was based on a wrong premise from the changelog summary alone. Upstream doesn't actually run multiple languages simultaneously — it ships `locales: ["en"]` (single-locale), and its "i18n" is a translatable-strings pattern (typed `UIStrings`, one file per locale) plus `astro:i18n` URL helpers, not a routing system that duplicates pages/content per locale (Astro itself has no such feature — every multi-locale Astro site hand-writes that routing regardless). So this fork's `[lang]`-prefixed routing structure was never actually replaceable by "more native" Astro i18n; there's nothing upstream to swap it for. What *was* genuinely adoptable: the typed string-file pattern, and `astro:i18n` helpers (`getRelativeLocaleUrl`, `Astro.currentLocale`) in place of the hand-rolled path helpers.

**Also corrected:** "adopt upstream's built-in TOC" would have meant *removing* the tocbot sidebar — upstream has no sidebar/scroll-spy TOC at all, only the same inline `remark-toc` collapsible list this fork already had underneath. Kept the sidebar (user's explicit call).

- [x] **i18n restructure.** `src/i18n/ui.ts` (flat dot-string keys, `t("category.key")` function calls) → `src/i18n/types.ts` (typed `UIStrings`) + `src/i18n/lang/{en,pt-br}.ts` (nested objects) + `src/i18n/index.ts` (`useTranslations()` via `import.meta.glob`). Every call site now does `t.category.key` (property access) instead of a function call — a real API shape change, with TS now catching typos/missing keys at compile time. `src/i18n/utils.ts` trimmed to the routing-only exports still needed (`LANGUAGES_KEYS`, `DEFAULT_LANG`, `UiType`) since those have no Astro-native replacement. `Layout.astro`'s hreflang/canonical generation now uses `getRelativeLocaleUrl` instead of a hand-rolled prefix-replace.
  - **Found along the way:** `<html lang>` was set from a static config constant (always `"en"`), not the actual per-page locale — so every `/pt-br/*` page was shipping `<html lang="en">`. Real pre-existing bug, fixed. This also mattered for Pagefind below, which filters search results by `<html lang>`.
- [x] **Pagefind search**, replacing Fuse.js + `src/components/Search.tsx` (the React island that shipped the whole index as client JS). Build script now runs `pagefind --site dist` after `astro build` and copies the index into `public/pagefind/` (gitignored, regenerated every build). `src/pages/[lang]/search.astro` rewritten around the vanilla-JS `PagefindUI` pattern. Per-language filtering needed no extra work once `<html lang>` was correct — Pagefind buckets by it automatically. Verified end-to-end with Playwright against a real build (not just "build succeeded") and inside an actual Docker build.
- [x] **Content dir / config restructure.** `src/content/blog/` → `src/content/posts/` (collection renamed `blog` → `posts`, ~19 call sites updated). Config split into `astro-paper.config.ts` (user-facing, project root) + `src/types/config.ts` (typed shape + `defineAstroPaperConfig` helper) + `src/config.ts` (now the internal resolved-defaults module) — kept `SITE`/`SOCIALS`/`GISCUS`/`LOGO_IMAGE`'s existing flat export shape so none of the ~19 consuming files needed to change. Adopted upstream's actual documented behavior for social link labels along the way: `linkTitle` is now optional and auto-generated from `site.title` + link name, instead of every entry repeating the same template-string boilerplate.
- [ ] **MDX support** — not pursued; no post has needed embedded components yet.
- [ ] **RTL language support** — not pursued; irrelevant unless a right-to-left locale is added.
- [ ] **Callouts / accessible image lightbox** (upstream v6.1.0) — not pursued; small, low-risk additions if wanted later.

---

## Rollback

Each phase lives on its own branch/PR against `master`. If a phase introduces a regression that isn't quickly fixable, revert that PR rather than trying to fix forward under time pressure — the next phase attempt can incorporate the fix.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal blog built with Astro 7 (content layer API), React 19 (for interactive islands), and Tailwind CSS v4. Based on the AstroPaper theme, tracking several of upstream's post-fork changes (Pagefind search, the `astro-paper.config.ts`/`src/config.ts` split, typed per-locale i18n strings, `src/content/posts/`) while keeping this fork's own bilingual (English/Portuguese) routing, a custom TOC sidebar (`tocbot`) on top of the inline collapsible one, and GitHub-based comments (Giscus) — none of which upstream has. See `ROADMAP.md` for the history of the Astro 5→7 upgrade, the Tailwind v3→v4 migration, and the upstream-adoption work, including the non-obvious issues each surfaced.

## Commands

- `npm run dev` — starts the dev server at `http://localhost:4321/`. Astro 7's dev server runs as a **detached daemon**: the command returns immediately after spawning it. Use `npx astro dev status` / `npx astro dev stop` to check on or stop it.
- `npm run build` — runs `astro check` (type checking) then `astro build`; output goes to `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — ESLint over the whole repo
- `npm run format` / `npm run format:check` — Prettier (with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`)
- `npm run sync` — regenerate Astro's generated types (`astro sync`), needed after changing content collection schemas

There is no test suite in this repo. CI (`.github/workflows`) runs on push/PR against `master` and checks lint, format, and build (Node 22.x). Requires Node ≥22.12.0 (`engines.node` in `package.json`).

## Architecture

### i18n routing

All public routes live under `src/pages/[lang]/...` (e.g. `src/pages/[lang]/posts/[id]/index.astro`), so `lang` is a required route param almost everywhere, generated via `getStaticPaths` + `LANGUAGES_KEYS` on every one of those pages. The root `src/pages/index.astro` is just a meta-refresh redirect to `/pt-br/` (the default locale).

This is a fork-specific structure, not something adopted from upstream: Astro's `i18n` config doesn't auto-duplicate pages or content collection entries across locales, so a bilingual site has to hand-write this routing regardless. What *was* adopted from upstream is how translated UI strings and locale-aware URLs are handled underneath that routing:

- `src/i18n/types.ts` — the `UIStrings` interface (typed, nested: `nav`, `home`, `post`, `footer`, `a11y`, `pages`).
- `src/i18n/lang/{en,pt-br}.ts` — one file per locale, each `satisfies UIStrings`.
- `src/i18n/index.ts` — `useTranslations(lang)`, loads the lang files via `import.meta.glob` and returns the `UIStrings` object directly. Call sites use property access (`t.nav.posts`), not a function call — this is a real API shape (not just a relocation) from the old `t("nav.posts")`-style dotted-string lookup.
- `src/i18n/utils.ts` — routing-only: `LANGUAGES_KEYS`, `DEFAULT_LANG` (`"pt-br"`), `UiType`.
- `src/utils/getSlugTranslations.ts` — derives cross-language slug equivalents (used by the language switcher on a post page, since translated posts don't share a slug) from content structure itself: posts sharing a parent directory under `src/content/posts/<topic>/` are treated as translations of each other, so there's no separate mapping file to hand-maintain. Astro's i18n APIs have no equivalent of this — it's purely this fork's own content structure.
- Astro's built-in `i18n` config (`astro.config.ts`: `defaultLocale: "pt-br"`, `locales: ["en", "pt-br"]`, `routing.prefixDefaultLocale: true`) backs the `astro:i18n` helpers actually used in code (`getRelativeLocaleUrl`, `Astro.currentLocale`) — see `Layout.astro`'s canonical/hreflang generation — but page routing itself is still the manual `[lang]` structure above.
- `<html lang>` (set in `Layout.astro`) must be the actual per-page `lang`, not a static default — Pagefind's per-language search filtering keys off it.

### Content collections

Blog posts are markdown files under `src/content/posts/<post-slug>/`, one file per language (e.g. `en.md`, `pt-br.md`), sharing the same parent directory but each with its own `lang` field in frontmatter. The schema is defined in `src/content.config.ts` (not inside `src/content/` — that legacy location was removed in Astro 6) using the `content_layer`/`glob` loader, in the `posts` collection. Required frontmatter: `pubDatetime`, `title`, `description`, `lang`; optional: `modDatetime`, `featured`, `draft`, `tags`, `ogImage`, `canonicalURL`.

Post routing derives the `id` param from `slugifyStr(post.data.title)` (see `src/pages/[lang]/posts/[id]/index.astro`), not from the filename — so changing a post's `title` changes its URL.

Key filtering/sorting logic:
- `src/utils/resolvePostsForLang.ts` — the single choke point for "what posts exist in this lang": filters out drafts and posts scheduled in the future (respecting `SITE.scheduledPostMargin`, skipped in dev mode), then resolves one post per topic directory — the post's own translation if `data.lang` matches, otherwise the `DEFAULT_LANG` version as a fallback (`isFallback: true`) instead of the topic silently disappearing from that locale's listings/routes. `src/pages/[lang]/posts/[id]/index.astro`'s `PostDetails` compares `post.data.lang` to the route `lang` to show a "not translated yet" notice on fallback pages.
- `src/utils/getSortedPosts.ts`, `src/utils/getPostsByTag.ts`, `src/utils/getPostsWithRT.ts` (adds reading time), `src/utils/getUniqueTags.ts` — combine with `resolvePostsForLang` for listing pages. The post detail route (`[id]/index.astro`) and its OG image route (`[id]/index.png.ts`) also call `resolvePostsForLang` directly in `getStaticPaths` so fallback pages get a real URL and OG image, not just a listing entry.

### OG image generation

`src/pages/[lang]/og.png.ts` and `src/pages/[lang]/posts/[id]/index.png.ts` dynamically generate Open Graph images at build time using `satori` + `@resvg/resvg-js`, templated from `src/utils/og-templates/{site,post}.tsx` and `src/utils/loadGoogleFont.ts`. If a post doesn't provide a custom `ogImage`, one is generated from its title.

### Styling (Tailwind v4)

Tailwind is wired up via the `@tailwindcss/vite` plugin (`astro.config.ts`), not a `tailwind.config.*` file or `@astrojs/tailwind` (that integration's peer range caps at Astro 5). All theme config — the `skin-*` color tokens, `font-mono`, and the sm-only breakpoint override — lives in `@theme` at the top of `src/styles/base.css`, alongside `@plugin "@tailwindcss/typography"`.

Every `.astro` file's scoped `<style>` block that uses `@apply` needs two things, or the build errors / styles silently misbehave:
1. `@reference "path/to/styles/base.css";` at the top — v4 processes each `<style>` block as an independent CSS context, so this is what makes the `@theme` tokens and utilities resolvable for `@apply` there.
2. Its rules wrapped in `@layer components { ... }`. Astro's compiled `@apply` output is otherwise unlayered CSS, and v4 uses real native CSS cascade layers where **unlayered CSS always beats layered CSS regardless of specificity** — so an unlayered scoped-style rule can silently override a Tailwind utility class (e.g. `sm:flex`) applied directly in markup on the same element. This exact bug collapsed the desktop nav in `Header.astro` during the v4 migration; see `ROADMAP.md` for the full story.

### Search (Pagefind)

`npm run build` runs `astro build`, then `pagefind --site dist` (indexes the built HTML), then copies the generated index into `public/pagefind/` (gitignored — it's regenerated every build) so it's served in future runs too. `src/pages/[lang]/search.astro` loads `@pagefind/default-ui` client-side and points it at `/pagefind/`.

Pagefind has no search index in dev mode (`astro dev` serves unbuilt source, nothing for it to query) — the search page shows a dev-mode notice instead of results; run `npm run build` once and use `npm run preview` to actually test search locally. Per-language result filtering needs no extra code: Pagefind buckets and filters automatically by each page's `<html lang>` attribute.

### Config & path aliases

- `astro-paper.config.ts` (project root) — the user-facing config: `site`, `posts`, `features`, `logo`, `socials`, `giscus`. Edit this file for day-to-day changes (title, pagination counts, social links, etc.).
- `src/types/config.ts` — the typed `AstroPaperConfig` shape and the `defineAstroPaperConfig` helper (editor support only, no runtime effect) that `astro-paper.config.ts` is written against.
- `src/config.ts` — internal, applies defaults on top of `astro-paper.config.ts` and re-exports the flat `SITE`, `SOCIALS`, `GISCUS`, `LOGO_IMAGE` objects that the rest of the codebase actually imports (`import { SITE } from "@config"`). Don't edit values here — change `astro-paper.config.ts` instead; this file exists so consuming code doesn't need to know about the user-config/defaults split. Notably, `SocialLink.linkTitle` is optional and auto-generated here (`"{site.title} on {name}"`, special-cased for Mail) if omitted from `astro-paper.config.ts`.
- Path aliases (`tsconfig.json`): `@assets`, `@config`, `@components`, `@content`, `@layouts`, `@pages`, `@styles`, `@utils` all resolve under `src/`.

### Components vs layouts

- `src/components/*.astro` are static/server-rendered; `src/components/*.tsx` (`Card`, `Comments`, `Datetime`, `LangSelector`, `Tocbot`) are React islands for interactive pieces (TOC sidebar uses `tocbot`, comments use `@giscus/react`). Search is not a React island — see above.
- `src/layouts/` composes pages: `Layout.astro` (base HTML shell) → `Main.astro`/`PostDetails.astro`/`Posts.astro`/`TagPosts.astro`/`AboutLayout.astro` for specific page types.

## Deployment

`Dockerfile` does a two-stage build: builds the Astro static site with `node:22-alpine`, then serves `dist/` via nginx. `docker-compose.yml` is for local dev only (runs `npm run dev` in a container, not the production image). Note: nginx's default config listens on port 80, not the `EXPOSE 4002` the Dockerfile documents — that mismatch predates the Astro/Tailwind upgrade and wasn't introduced or fixed by it.

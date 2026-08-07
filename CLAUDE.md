# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal blog built with Astro 7 (content layer API), React 19 (for interactive islands), and Tailwind CSS v4. Based on the AstroPaper theme, extended with i18n (English/Portuguese), a custom table of contents (tocbot), and GitHub-based comments (Giscus). See `ROADMAP.md` for the history of the Astro 5→7 / Tailwind v3→v4 upgrade and the non-obvious issues it surfaced.

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

All public routes live under `src/pages/[lang]/...` (e.g. `src/pages/[lang]/posts/[id]/index.astro`), so `lang` is a required route param almost everywhere. The root `src/pages/index.astro` is just a meta-refresh redirect to `/pt-br/` (the default locale).

- `src/i18n/ui.ts` — translation strings, keyed by locale.
- `src/i18n/utils.ts` — locale helpers: `getLangFromUrl`, `useTranslations` (the `t()` function), `getLocalizedPathname`, `pathNameIsInLanguage`. `DEFAULT_LANG` is `"pt-br"`.
- `src/i18n/slugsMapping.ts` — manual mapping between a post's slug in one language and its equivalent slug in another (used for the language switcher on a post page, since translated posts don't share a slug).
- Astro's built-in `i18n` config (in `astro.config.ts`) declares `defaultLocale: "pt-br"` and `locales: ["en", "pt-br"]`, but actual routing/param handling is done manually via the `[lang]` directory + the helpers above, not Astro's automatic i18n routing.

### Content collections

Blog posts are markdown files under `src/content/blog/<post-slug>/`, one file per language (e.g. `en.md`, `pt-br.md`), sharing the same parent directory but each with its own `lang` field in frontmatter. The schema is defined in `src/content.config.ts` (not inside `src/content/` — that legacy location was removed in Astro 6) using the `content_layer`/`glob` loader. Required frontmatter: `pubDatetime`, `title`, `description`, `lang`; optional: `modDatetime`, `featured`, `draft`, `tags`, `ogImage`, `canonicalURL`.

Post routing derives the `id` param from `slugifyStr(post.data.title)` (see `src/pages/[lang]/posts/[id]/index.astro`), not from the filename — so changing a post's `title` changes its URL.

Key filtering/sorting logic:
- `src/utils/postFilter.ts` — filters out drafts, posts scheduled in the future (respecting `SITE.scheduledPostMargin`), and posts not matching the current `lang`. Draft/future-dated filtering is skipped in dev mode.
- `src/utils/getSortedPosts.ts`, `src/utils/getPostsByTag.ts`, `src/utils/getPostsWithRT.ts` (adds reading time), `src/utils/getUniqueTags.ts` — combine with `postFilter` for listing pages.

### OG image generation

`src/pages/[lang]/og.png.ts` and `src/pages/[lang]/posts/[id]/index.png.ts` dynamically generate Open Graph images at build time using `satori` + `@resvg/resvg-js`, templated from `src/utils/og-templates/{site,post}.tsx` and `src/utils/loadGoogleFont.ts`. If a post doesn't provide a custom `ogImage`, one is generated from its title.

### Styling (Tailwind v4)

Tailwind is wired up via the `@tailwindcss/vite` plugin (`astro.config.ts`), not a `tailwind.config.*` file or `@astrojs/tailwind` (that integration's peer range caps at Astro 5). All theme config — the `skin-*` color tokens, `font-mono`, and the sm-only breakpoint override — lives in `@theme` at the top of `src/styles/base.css`, alongside `@plugin "@tailwindcss/typography"`.

Every `.astro` file's scoped `<style>` block that uses `@apply` needs two things, or the build errors / styles silently misbehave:
1. `@reference "path/to/styles/base.css";` at the top — v4 processes each `<style>` block as an independent CSS context, so this is what makes the `@theme` tokens and utilities resolvable for `@apply` there.
2. Its rules wrapped in `@layer components { ... }`. Astro's compiled `@apply` output is otherwise unlayered CSS, and v4 uses real native CSS cascade layers where **unlayered CSS always beats layered CSS regardless of specificity** — so an unlayered scoped-style rule can silently override a Tailwind utility class (e.g. `sm:flex`) applied directly in markup on the same element. This exact bug collapsed the desktop nav in `Header.astro` during the v4 migration; see `ROADMAP.md` for the full story.

### Config & path aliases

- `src/config.ts` — central site config: `SITE` (title, pagination counts, scheduling margin, etc.), `SOCIALS`, `GISCUS` (comments) settings. Most cross-cutting behavior (posts per page, scheduled-post margin, comments repo) is changed here rather than in component code.
- Path aliases (`tsconfig.json`): `@assets`, `@config`, `@components`, `@content`, `@layouts`, `@pages`, `@styles`, `@utils` all resolve under `src/`.

### Components vs layouts

- `src/components/*.astro` are static/server-rendered; `src/components/*.tsx` (`Card`, `Comments`, `Datetime`, `LangSelector`, `Search`, `Tocbot`) are React islands for interactive pieces (search uses `fuse.js`, TOC uses `tocbot`, comments use `@giscus/react`).
- `src/layouts/` composes pages: `Layout.astro` (base HTML shell) → `Main.astro`/`PostDetails.astro`/`Posts.astro`/`TagPosts.astro`/`AboutLayout.astro` for specific page types.

## Deployment

`Dockerfile` does a two-stage build: builds the Astro static site with `node:22-alpine`, then serves `dist/` via nginx. `docker-compose.yml` is for local dev only (runs `npm run dev` in a container, not the production image). Note: nginx's default config listens on port 80, not the `EXPOSE 4002` the Dockerfile documents — that mismatch predates the Astro/Tailwind upgrade and wasn't introduced or fixed by it.

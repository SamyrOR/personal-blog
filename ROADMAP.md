# Upgrade Roadmap

## Context

This project is a fork of [satnaing/astro-paper](https://github.com/satnaing/astro-paper), diverged after the **Astro 5.0.5** update (commit `037eba7`, Dec 2024) and never re-synced. Since then:

| | This fork | Upstream astro-paper (now) |
|---|---|---|
| Astro | 5.0.5 | 7.x |
| React | 19 (kept, used for islands) | removed entirely |
| Styling | Tailwind CSS v3 | Tailwind CSS v4 |
| Search | Fuse.js (custom `Search.tsx`) | Pagefind |
| i18n | Custom (`src/i18n/*`, `[lang]` routing) | Native Astro i18n |
| TOC | Custom (`tocbot` + `Tocbot.tsx`) | Built-in |
| Comments | Giscus (custom) | not in base theme |
| Content dir | `src/content/blog/<slug>/<lang>.md` | `src/content/posts/` |
| Config | `src/config.ts` | `astro-paper.config.ts` (user) + internal `src/config.ts` |

Upstream has effectively become a different codebase (React removed, config layout changed, native i18n replaces what we hand-built). **A rebase/merge from upstream is not realistic** — it would clobber the localization, TOC, and comments work that upstream doesn't have at all. Instead, this roadmap is an **incremental upgrade of our own stack**, treating upstream as a reference to borrow ideas from where they don't conflict with our custom features.

## Guiding principles

- Upgrade Astro one major version at a time (5 → 6 → 7), fully testing between each.
- Keep our custom i18n, TOC, search, and comments implementations — don't adopt upstream's native replacements unless a specific phase below calls for evaluating one.
- One phase = one branch = one PR, so a regression is easy to isolate and revert.
- Run `npm run build`, `npm run lint`, `npm run format:check`, and a manual smoke test (home, a post in each locale, tags, search, RSS, OG image) after every phase.

---

## Phase 0 — Prep

- [ ] Create a working branch (e.g. `chore/astro-upgrade`).
- [ ] Confirm local Node version satisfies the *highest* target (Astro 6/7 need **Node ≥ 22.12.0**; current shell reports v24.15, so fine — but there's no `.nvmrc`/`engines` field pinning this, worth adding).
- [ ] Record a baseline: `npm run build` output, Lighthouse score, and a manual pass of the site as it stands today, to compare against after each phase.

## Phase 1 — Astro 5.0.5 → latest 5.x (5.18.x)

Low-risk, no breaking changes expected within the 5.x line.

- [ ] `npx @astrojs/upgrade` (or bump `astro`, `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/tailwind`, `@astrojs/check` to latest 5.x-compatible versions).
- [ ] `npm run build` + `astro sync` to confirm content collection types still generate.
- [ ] Re-check OG image generation (`satori`/`@resvg/resvg-js`) still works — this pairing has been sensitive to Astro version bumps in the past.

## Phase 2 — Astro 6.x

Breaking changes that apply to this codebase specifically:

- [ ] **`<ViewTransitions />` → `<ClientRouter />`.** Used in `src/layouts/Layout.astro:4,164` — rename the import and tag.
- [ ] **Node ≥ 22.12.0 required.** Add an `engines` field to `package.json` and update the CI workflow's node-version matrix (`.github/workflows/*.yml` currently pins `18.x`).
- [ ] **Zod v4.** `src/content/config.ts` schema uses `z.string()`, `z.date()`, `z.array()`, `z.boolean()` — none of the deprecated shorthand (`z.string().email()` etc.) — should be a safe upgrade, but re-verify against the Zod v4 changelog since `astro:content` re-exports it.
- [ ] **Content Layer API required for all collections.** Already using it (`type: "content_layer"`, `glob()` loader in `src/content/config.ts`) — no action needed, just confirm.
- [ ] **Legacy `.cjs`/`.cts` Astro config unsupported.** `astro.config.ts` is already TS — no action. (`tailwind.config.cjs` is a Tailwind config, not an Astro config, so it's unaffected here — revisit in Phase 4 if moving to Tailwind v4.)
- [ ] **`Astro.glob()` removed.** Not used anywhere in `src/` — confirmed via grep, no action needed.
- [ ] Re-run full build/lint/format/manual smoke test.

## Phase 3 — Astro 7.x

- [ ] **Markdown pipeline default changes** (Sätteri replaces remark/rehype by default). This project relies on `remarkToc`, `remarkCollapse`, and the custom `remarkReadingTime` plugin (`astro.config.ts`) — install and configure `@astrojs/markdown-remark` to keep the existing remark pipeline rather than porting three plugins to a new processor.
- [ ] **Rust-based compiler is now mandatory and stricter about HTML validity.** Run the build and fix any unclosed-tag/invalid-nesting errors it surfaces across `.astro` files — can't pre-audit this without running it.
- [ ] **`compressHTML` default changes to `'jsx'`**, which can strip whitespace between inline elements more aggressively. Visually diff rendered post pages (inline elements like tags/links next to text) after upgrading.
- [ ] **`src/fetch.ts` is now a reserved filename** for routing config. Not present in this repo — no action needed.
- [ ] **`@astrojs/db` removed** — not a dependency here, no action.
- [ ] Re-run full build/lint/format/manual smoke test, plus a pass specifically comparing rendered spacing/typography before vs. after (per the `compressHTML` change).

## Phase 4 — Ecosystem cleanup (optional, do after Astro is current)

- [ ] Evaluate Tailwind v3 → v4. This is a bigger, separate migration (CSS-first config, `tailwind.config.cjs` goes away, `@tailwindcss/typography` plugin syntax changes) — worth its own PR, not bundled with the Astro bump.
- [ ] Bump remaining deps (`fuse.js`, `tocbot`, `@giscus/react`, `typescript`, `eslint` + plugins, `prettier` + plugins) to latest.
- [ ] Update CI node-version matrix and any Dockerfile base image (`node:lts` in `Dockerfile` — pin explicitly once the target Node version is decided).

## Phase 5 — Ideas worth borrowing from upstream (backlog, evaluate individually)

These are upstream features not present here; each should be its own decision, not part of the version bump:

- **Pagefind vs. Fuse.js search** — Pagefind indexes at build time and doesn't ship a JS search index to the client; would replace `src/components/Search.tsx`. Worth it once traffic/post count grows, but our i18n split (`lang` field vs. Pagefind's own i18n indexing) needs a compatibility check first.
- **MDX support** — only if a future post needs embedded components; markdown has been sufficient so far.
- **RTL language support** — irrelevant unless a right-to-left locale is added.
- **Callouts / accessible image lightbox** (added upstream in v6.1.0) — small, low-risk UI additions if wanted later.

---

## Rollback

Each phase lives on its own branch/PR against `master`. If a phase introduces a regression that isn't quickly fixable, revert that PR rather than trying to fix forward under time pressure — the next phase attempt can incorporate the fix.

import { getCollection } from "astro:content";
import { slugifyStr } from "./slugify";
import type { UiType } from "../i18n/utils";

export type SlugTranslations = Record<string, Partial<Record<UiType, string>>>;

/**
 * Derives cross-language slug equivalents from content structure: posts that
 * are translations of each other share a parent directory
 * (src/content/posts/<topic>/{en,pt-br}.md), so the mapping doesn't need to
 * be hand-maintained separately from that grouping.
 */
export async function getSlugTranslations(): Promise<SlugTranslations> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  const byTopic = new Map<string, { lang: UiType; slug: string }[]>();
  for (const post of posts) {
    const topic = post.id.split("/")[0];
    const entry = {
      lang: post.data.lang as UiType,
      slug: slugifyStr(post.data.title),
    };
    byTopic.set(topic, [...(byTopic.get(topic) ?? []), entry]);
  }

  const translations: SlugTranslations = {};
  for (const versions of byTopic.values()) {
    for (const { lang, slug } of versions) {
      translations[slug] = Object.fromEntries(
        versions.filter(v => v.lang !== lang).map(v => [v.lang, v.slug])
      );
    }
  }
  return translations;
}

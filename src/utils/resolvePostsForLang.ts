import type { CollectionEntry } from "astro:content";
import { SITE } from "@config";
import { DEFAULT_LANG } from "../i18n/utils";

export interface ResolvedPost {
  post: CollectionEntry<"posts">;
  /** True when no translation exists for the requested lang and this is the
   * default-locale post shown in its place. */
  isFallback: boolean;
}

const isPublished = (post: CollectionEntry<"posts">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(post.data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !post.data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

const topicOf = (post: CollectionEntry<"posts">) => post.id.split("/")[0];

/**
 * Resolves one post per topic for the given lang: the post's own translation
 * if it exists, otherwise the default-locale version as a fallback (instead
 * of the topic silently disappearing from that locale).
 */
export function resolvePostsForLang(
  posts: CollectionEntry<"posts">[],
  lang: string
): ResolvedPost[] {
  const byTopic = new Map<string, CollectionEntry<"posts">[]>();
  for (const post of posts.filter(isPublished)) {
    const topic = topicOf(post);
    byTopic.set(topic, [...(byTopic.get(topic) ?? []), post]);
  }

  const resolved: ResolvedPost[] = [];
  for (const versions of byTopic.values()) {
    const exact = versions.find(post => post.data.lang === lang);
    const chosen =
      exact ?? versions.find(post => post.data.lang === DEFAULT_LANG);
    if (chosen) resolved.push({ post: chosen, isFallback: chosen !== exact });
  }
  return resolved;
}

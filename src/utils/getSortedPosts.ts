import type { CollectionEntry } from "astro:content";
import { resolvePostsForLang } from "./resolvePostsForLang";

const getSortedPosts = (posts: CollectionEntry<"posts">[], lang: string) => {
  return resolvePostsForLang(posts, lang)
    .map(({ post }) => post)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedPosts;

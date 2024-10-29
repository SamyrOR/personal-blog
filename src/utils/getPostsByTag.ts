import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";
import { slugifyAll } from "./slugify";

const getPostsByTag = (
  posts: CollectionEntry<"blog">[],
  tag: string,
  lang: string
) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag)),
    lang
  );

export default getPostsByTag;

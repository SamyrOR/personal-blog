import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { resolvePostsForLang } from "@utils/resolvePostsForLang";
import { slugifyStr } from "@utils/slugify";
import { LANGUAGES_KEYS } from "i18n/utils";

export async function getStaticPaths() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  return LANGUAGES_KEYS.flatMap(lang =>
    resolvePostsForLang(posts, lang)
      .filter(({ post }) => !post.data.ogImage)
      .map(({ post }) => ({
        params: { id: slugifyStr(post.data.title), lang },
        props: post,
      }))
  );
}

export const GET: APIRoute = async ({ props }) =>
  new Response(
    await generateOgImageForPost(props as CollectionEntry<"posts">),
    {
      headers: { "Content-Type": "image/png" },
    }
  );

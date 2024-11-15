import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { slugifyStr } from "@utils/slugify";
import { LANGUAGES_KEYS } from "i18n/utils";

export async function getStaticPaths() {
  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  let allPosts: any = [];
  for (let lang of LANGUAGES_KEYS) {
    const localizedPosts = posts
      .filter(post => post.data.lang == lang)
      .map(post => ({
        params: { slug: slugifyStr(post.data.title), lang: lang },
        props: post,
      }));
    allPosts = [...allPosts, ...localizedPosts];
  }

  return allPosts;
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props as CollectionEntry<"blog">), {
    headers: { "Content-Type": "image/png" },
  });

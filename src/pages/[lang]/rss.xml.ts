import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";
import { LANGUAGES_KEYS, type UiType } from "../../i18n/utils";

export async function getStaticPaths() {
  return LANGUAGES_KEYS.map(lang => {
    return {
      params: { lang },
    };
  });
}

export async function GET({ params }: { params: { lang: UiType } }) {
  const { lang } = params;
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts, lang);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, slug }) => ({
      link: `/${lang}/posts/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}

import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";
import { getLangFromUrl } from "i18n/utils";

const postFilter = ({ data }: CollectionEntry<"blog">, lang: string) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;

  return (
    !data.draft &&
    (import.meta.env.DEV || isPublishTimePassed) &&
    data.lang == lang
  );
};

export default postFilter;

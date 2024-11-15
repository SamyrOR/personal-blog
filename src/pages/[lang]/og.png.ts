import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@utils/generateOgImages";
import { LANGUAGES_KEYS, type UiType } from "../../i18n/utils";

export async function getStaticPaths() {
  return LANGUAGES_KEYS.map(lang => {
    return {
      params: { lang },
    };
  });
}

export const GET: APIRoute = async () =>
  new Response(await generateOgImageForSite(), {
    headers: { "Content-Type": "image/png" },
  });

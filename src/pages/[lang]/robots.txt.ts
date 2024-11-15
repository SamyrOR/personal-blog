import type { APIRoute } from "astro";
import { SITE } from "@config";
import { LANGUAGES_KEYS } from "../../i18n/utils";

const robots = `
User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", SITE.website).href}
`.trim();

export async function getStaticPaths() {
  return LANGUAGES_KEYS.map(lang => {
    return {
      params: { lang },
    };
  });
}

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });

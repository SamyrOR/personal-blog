/**
 * Internal resolved configuration used throughout the codebase.
 *
 * Prefer editing `astro-paper.config.ts` instead of this file. This module
 * applies defaults and derives values (like each social link's default
 * accessible label) on top of the user-facing config.
 */
import userConfig from "../astro-paper.config";
import type { Site, SocialObjects } from "./types";
import type { GiscusProps } from "@giscus/react";

export const SITE: Site = {
  website: userConfig.site.url,
  author: userConfig.site.author,
  profile: userConfig.site.profile ?? "",
  desc: userConfig.site.description,
  title: userConfig.site.title,
  ogImage: userConfig.site.ogImage,
  lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
  postPerIndex: userConfig.posts?.perIndex ?? 4,
  postPerPage: userConfig.posts?.perPage ?? 3,
  scheduledPostMargin: userConfig.posts?.scheduledPostMargin ?? 15 * 60 * 1000,
};

export const LOGO_IMAGE = userConfig.logo ?? {
  enable: false,
  svg: false,
  width: 216,
  height: 46,
};

function defaultLinkTitle(name: string): string {
  return name === "Mail"
    ? `Send an email to ${SITE.title}`
    : `${SITE.title} on ${name}`;
}

export const SOCIALS: SocialObjects = userConfig.socials.map(social => ({
  ...social,
  linkTitle: social.linkTitle ?? defaultLinkTitle(social.name),
}));

export const GISCUS: GiscusProps = userConfig.giscus as GiscusProps;

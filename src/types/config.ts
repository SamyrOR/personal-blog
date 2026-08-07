import type socialIcons from "@assets/socialIcons";
import type { GiscusProps } from "@giscus/react";

export interface SiteConfig {
  /** Deployed URL of the site, e.g. "https://example.com/" */
  url: string;
  /** Blog title shown in header and meta tags */
  title: string;
  /** Short description used in SEO meta and RSS feed */
  description: string;
  /** Default post author name */
  author: string;
  /** Author profile URL (used in structured data) */
  profile?: string;
  /** Fallback OG image filename in /public, e.g. "og.jpg" */
  ogImage?: string;
}

export interface PostsConfig {
  /** Posts per page on paginated listing pages */
  perPage?: number;
  /** Posts shown on the index/home page */
  perIndex?: number;
  /**
   * Scheduled posts within this window (ms) of their pubDatetime
   * are shown as published. Defaults to 15 minutes.
   */
  scheduledPostMargin?: number;
}

export interface FeaturesConfig {
  /** Enable light/dark mode toggle. Defaults to true. */
  lightAndDarkMode?: boolean;
}

export interface LogoConfig {
  enable: boolean;
  svg: boolean;
  width: number;
  height: number;
}

export type SocialLink = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  /**
   * Accessible label for the icon link (aria-label, title attribute).
   * Auto-generated if omitted: "{site.title} on Github", "Send an email to
   * {site.title}" for Mail. Override when the default wording doesn't fit.
   */
  linkTitle?: string;
};

export interface AstroPaperConfig {
  site: SiteConfig;
  posts?: PostsConfig;
  features?: FeaturesConfig;
  logo?: LogoConfig;
  /** Social profile links shown in header/footer */
  socials: SocialLink[];
  /** Giscus (GitHub Discussions) comments config. Omit to disable comments. */
  giscus?: GiscusProps;
}

/**
 * Type helper for astro-paper.config.ts.
 * Provides full IntelliSense without any runtime overhead.
 */
export function defineAstroPaperConfig(
  config: AstroPaperConfig
): AstroPaperConfig {
  return config;
}

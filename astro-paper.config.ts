import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://blog.samyr.dev/", // replace this with your deployed domain
    title: "Code & Craft",
    description: "Personal blog to keep up with my carrer insights",
    author: "Samyr Oliveira Ribeiro",
    profile: "https://samyr.dev/",
    ogImage: "astropaper-og.jpg",
  },
  posts: {
    perPage: 3,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  },
  features: {
    lightAndDarkMode: true,
  },
  logo: {
    enable: false,
    svg: false,
    width: 216,
    height: 46,
  },
  // linkTitle omitted throughout - auto-generated from site.title + name
  // (see SocialLink in src/types/config.ts). Only override when the
  // default wording doesn't fit.
  socials: [
    { name: "Github", href: "https://github.com/SamyrOR", active: true },
    {
      name: "Facebook",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Instagram",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/samyr-ribeiro/",
      active: true,
    },
    { name: "Mail", href: "mailto:saamyr@live.com", active: true },
    {
      name: "Twitter",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Twitch",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "YouTube",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "WhatsApp",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Snapchat",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Pinterest",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "TikTok",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "CodePen",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Discord",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "GitLab",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Reddit",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Skype",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Steam",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Telegram",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
    {
      name: "Mastodon",
      href: "https://github.com/satnaing/astro-paper",
      active: false,
    },
  ],
  giscus: {
    repo: "SamyrOR/personal-blog",
    repoId: "R_kgDOM7_VGw",
    category: "Announcements",
    categoryId: "DIC_kwDOM7_VG84CjOGi",
    mapping: "pathname",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    loading: "lazy",
  },
});

type BlogSlugs = {
  [lang: string]: {
    posts: {
      [slug: string]: string;
    };
  };
};
export const slugsMapping: BlogSlugs = {
  en: {
    posts: {
      "como-integrar-giscus": "how-to-integrate-giscus-comments", // Portuguese equivalent slug
      // Add more slugs here as needed
    },
  },
  "pt-br": {
    posts: {
      "how-to-integrate-giscus-comments": "como-integrar-giscus", // Portuguese equivalent slug
      // Add more slugs here as needed
    },
  },
  // Add more languages and their respective slugs
};

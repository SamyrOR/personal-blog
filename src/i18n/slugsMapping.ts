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
      "minha-primeira-contribuicao": "my-first-contribution", // Portuguese equivalent slug
      // Add more slugs here as needed
    },
  },
  "pt-br": {
    posts: {
      "my-first-contribution": "minha-primeira-contribuicao", // Portuguese equivalent slug
      // Add more slugs here as needed
    },
  },
  // Add more languages and their respective slugs
};

type BlogSlugs = {
  [lang: string]: {
    posts: {
      [id: string]: string;
    };
  };
};
export const slugsMapping: BlogSlugs = {
  en: {
    posts: {
      "minha-primeira-contribuicao-opensource":
        "my-first-open-source-contribution", // Portuguese equivalent slug
      // Add more slugs here as needed
    },
  },
  "pt-br": {
    posts: {
      "my-first-open-source-contribution":
        "minha-primeira-contribuicao-opensource", // Portuguese equivalent slug
      // Add more slugs here as needed
    },
  },
  // Add more languages and their respective slugs
};

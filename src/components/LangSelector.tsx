const slugMapping = {
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
export default function LangSelector() {
  const currentLang = window.location.pathname.startsWith("/pt-br")
    ? "pt-br"
    : "en";
  // Function to handle language switch
  const switchLanguage = event => {
    const newLang = event.target.value;
    const currentUrl = window.location.pathname;

    // Split the URL to get the language part (assuming /[lang]/path/structure)
    const parts = currentUrl.split("/");
    //
    // Get the current slug from the URL
    const currentSlug = parts[3]; // Assuming slug is at index 2

    // Determine the new slug based on the selected language
    const newSlug = slugMapping[newLang]?.posts[currentSlug] || currentSlug;

    // Replace the language segment with the selected one
    if (parts[1]) {
      parts[1] = newLang; // Update to the selected language
    }

    if (parts[3]) {
      parts[3] = newSlug; // Replace the slug with the new slug
    }

    // Join the parts back into a full URL
    const newUrl = parts.join("/");

    // Reload the page with the new URL
    window.location.href = newUrl;
  };

  return (
    <select
      onChange={switchLanguage}
      aria-label="Language Selector"
      value={currentLang}
    >
      <option value="en">en</option>
      <option value="pt-br">pt-br</option>
      {/* Add more languages here if needed */}
    </select>
  );
}

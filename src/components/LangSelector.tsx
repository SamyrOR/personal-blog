import { slugsMapping } from "i18n/slugsMapping";

export default function LangSelector() {
  const currentLang = window.location.pathname.startsWith("/pt-br")
    ? "pt-br"
    : "en";

  const switchLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    const currentUrl = window.location.pathname;
    const parts = currentUrl.split("/");
    const currentSlug = parts[3];
    const newSlug = slugsMapping[newLang]?.posts[currentSlug] || currentSlug;
    if (parts[1]) {
      parts[1] = newLang;
    }
    if (parts[3]) {
      parts[3] = newSlug;
    }
    const newUrl = parts.join("/");
    window.location.href = newUrl;
  };

  return (
    <>
      <select
        onChange={switchLanguage}
        aria-label="Language Selector"
        value={currentLang}
        className="lang-selector bg-transparent pr-1 font-medium hover:text-skin-accent"
      >
        <option className="lang-selector__opt" value="en">
          en-us
        </option>
        <option className="lang-selector__opt" value="pt-br">
          pt-br
        </option>
      </select>
    </>
  );
}

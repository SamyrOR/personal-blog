import { GISCUS } from "@config";
import Giscus, { type Theme } from "@giscus/react";
import type { UiType } from "i18n/utils";
import { useEffect, useState } from "react";

interface CommentsProps {
  lightTheme?: Theme;
  darkTheme?: Theme;
  lang: UiType;
}

export default function Comments({
  lightTheme = "light",
  darkTheme = "dark",
  lang,
}: CommentsProps) {
  let giscusLang = lang == "pt-br" ? "pt" : "en";
  const [theme, setTheme] = useState(() => {
    const currentTheme = localStorage.getItem("theme");
    const browserTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return currentTheme || browserTheme;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => {
      setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
    };

    themeButton?.addEventListener("click", handleClick);

    return () => themeButton?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const langSelectorButton = document.querySelector(
      ".lang-selector"
    ) as HTMLSelectElement;
    const handleChange = () => {
      // if (langSelectorButton?.nodeValue == "pt-br") {
      // }
      for (let lang of Array.from(langSelectorButton?.options))
        console.log(langSelectorButton);
    };

    langSelectorButton?.addEventListener("change", handleChange);

    return () => langSelectorButton?.removeEventListener("click", handleChange);
  }, []);

  return (
    <div className="mt-8">
      <Giscus
        theme={theme === "light" ? lightTheme : darkTheme}
        lang={giscusLang}
        {...GISCUS}
      />
    </div>
  );
}

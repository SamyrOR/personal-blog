import { useEffect } from "react";
import * as tocbot from "tocbot";

export default function Tocbot(props: { collapseDepth?: number }) {
  useEffect(() => {
    tocbot.init({
      // Where to render the table of contents.
      tocSelector: "#tocbot",
      scrollSmoothOffset: -30,
      // Where to grab the headings to build the table of contents.
      contentSelector: "#article",
      // Which headings to grab inside of the contentSelector element.
      headingSelector: "h1, h2, h3, h4, h5, h6",
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
      collapseDepth: props.collapseDepth ?? 3,
    });
    return tocbot.destroy;
  }, []);
  return null;
}

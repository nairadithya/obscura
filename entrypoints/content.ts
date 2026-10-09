import "./hiders.css";
import { hideReelElements } from "./lib/hide-reel";

export default defineContentScript({
  matches: ["*://*.instagram.com/*"],
  main() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            hideReelElements(node);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    hideReelElements(document.body);

    return () => {
      observer.disconnect();
    };
  },
});

import "./hiders.css";

export default defineContentScript({
    matches: ["*://*.instagram.com/*"],
  main() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            const reels = node.querySelectorAll('a[href^="/reels/"]');
            for (const reel of reels) {
              // Try to find the container of the reel and hide it
              let parent = reel.parentElement;
              while (parent && !parent.classList.contains("x1lliihq")) {
                parent = parent.parentElement;
              }
              if (parent) {
                parent.style.display = "none";
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  },
});

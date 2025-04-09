import "./hiders.css";

export default defineContentScript({
  matches: ["*://*.instagram.com/*"],
  main(ctx) {
    function removeAllElementsAfterSuggestedPosts() {
      const divs = document.querySelectorAll("div");
      let suggestedPostsDiv = null;
      for (const div of divs) {
        if (
          div.textContent &&
          div.textContent.toLowerCase() == "suggested posts"
        ) {
          suggestedPostsDiv = div;
          console.log("HAHA I FOUND YOU SUGGESTED");
          console.log(suggestedPostsDiv);
          break;
        }
      }

      if (suggestedPostsDiv) {
        let parentNode = suggestedPostsDiv.parentNode;

        let foundDiv = false;
        const nodesToRemove = [];

        for (const item of parentNode.children) {
          if (item === suggestedPostsDiv) {
            foundDiv = true;
            continue;
          }

          if (foundDiv) {
            nodesToRemove.push(item);
          }
        }
        for (const item in nodesToRemove) {
          item.remove();
        }
      }
    }
    const observer = new MutationObserver((mutations) => {
      removeAllElementsAfterSuggestedPosts();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  },
});

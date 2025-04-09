import "./hiders.css";

export default defineContentScript({
  matches: ["*://*.instagram.com/*"],
  main(ctx) {
    function removeAllElementsAfterSuggestedPosts() {
      const divs = document.querySelectorAll("div");
      let suggestedPostsDiv = null;
      for (const div of allDivs) {
        if (
          div.textContent &&
          div.textContent.toLowerCase().includes("suggested posts")
        ) {
          suggestedPostsDiv = div;
          console.log("HAHA I FOUND YOU SUGGESTED");
          break;
        }
      }
    }
    document.addEventListener("DOMContentLoaded", (event) => {
      console.log("HAHAI FOUND YOU SUGGESTED");
      removeAllElementsAfterSuggestedPosts();
    });
  },
});

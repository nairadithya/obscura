export default defineContentScript({
    matches: ["*://*.instagram.com/"],
    main() {
        function deleteReelsSuggestions() {
            if (!location.pathname.startsWith("/reel/")) return;
            console.log("Hello from content.ts");
            const divs = document.querySelectorAll("div");
            let morePostsFromDiv;
            for (const div of divs) {
                if (
                    div.textContent &&
                    div.textContent.startsWith("More posts from")
                ) {
                    morePostsFromDiv = div;
                    morePostsFromDiv.remove();
                    console.log(morePostsFromDiv);
                    break;
                }
            }
            return;
        }

        deleteReelsSuggestions();

        function removeAllElementsAfterSuggestedPosts() {
            const divs = document.querySelectorAll("div");
            let suggestedPostsDiv = null;
            for (const div of divs) {
                if (
                    div.textContent &&
                    div.textContent.toLowerCase() == "suggested posts"
                ) {
                    suggestedPostsDiv = div;
                    break;
                }
            }

            if (suggestedPostsDiv) {
                const parentNode = suggestedPostsDiv.parentNode.parentNode;

                let foundDiv = false;
                const nodesToRemove = [];

                for (const item of parentNode.children) {
                    if (item === suggestedPostsDiv.parentNode) {
                        foundDiv = true;
                        continue;
                    }

                    if (foundDiv) {
                        item.style.display = "none";
                    }
                }
            }
        }

        const observer = new MutationObserver((mutations) => {
            removeAllElementsAfterSuggestedPosts();
        });

        observer.observe(document.body, { childList: true });

        return () => {
            observer.disconnect();
        };
    },
});
